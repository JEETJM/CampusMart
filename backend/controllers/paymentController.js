const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const createNotification = require("../utils/createNotification");

// ===============================
// RAZORPAY INSTANCE
// ===============================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================================================
// CREATE RAZORPAY ORDER
// =========================================================
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body || {};

    // ===============================
    // VALIDATE ORDER ID
    // ===============================
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    // ===============================
    // FIND CAMPUSMART ORDER
    // ===============================
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ===============================
    // BUYER AUTHORIZATION
    // ===============================
    if (String(order.buyer) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this order.",
      });
    }

    // ===============================
    // PAYMENT METHOD
    // ===============================
    if (order.paymentMethod !== "Online") {
      return res.status(400).json({
        success: false,
        message: "This order does not require online payment.",
      });
    }

    // ===============================
    // ORDER STATUS CHECK
    // ===============================
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be paid.",
      });
    }

    if (order.orderStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed orders cannot be paid again.",
      });
    }

    // ===============================
    // ALREADY PAID
    // ===============================
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid.",
      });
    }

    // ===============================
    // VALIDATE AMOUNT
    // ===============================
    const amountInPaise = Math.round(Number(order.subtotal) * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    let razorpayOrder;

    // =====================================================
    // RETRY PAYMENT
    // Reuse existing Razorpay order when available.
    // =====================================================
    if (order.razorpayOrderId) {
      try {
        const existingOrder = await razorpay.orders.fetch(
          order.razorpayOrderId,
        );

        if (
          existingOrder &&
          Number(existingOrder.amount) === Number(amountInPaise) &&
          existingOrder.currency === "INR" &&
          existingOrder.status !== "paid"
        ) {
          razorpayOrder = existingOrder;
        }
      } catch (fetchError) {
        console.warn(
          "Existing Razorpay order could not be reused:",
          fetchError?.message,
        );
      }
    }

    // =====================================================
    // CREATE NEW RAZORPAY ORDER
    // =====================================================
    if (!razorpayOrder) {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
          campusmartOrderId: String(order._id),
        },
      });

      order.razorpayOrderId = razorpayOrder.id;

      order.paymentStatus = "Pending";

      await order.save();
    }

    // ===============================
    // RESPONSE
    // ===============================
    return res.status(200).json({
      success: true,
      message: "Payment order created successfully.",

      keyId: process.env.RAZORPAY_KEY_ID,

      orderId: razorpayOrder.id,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      campusMartOrderId: order._id,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.error?.description || "Unable to create payment order.",
    });
  }
};

// =========================================================
// VERIFY PAYMENT
// =========================================================
const verifyPayment = async (req, res) => {
  try {
    const {
      campusMartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    // ===============================
    // VALIDATION
    // ===============================
    if (
      !campusMartOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete.",
      });
    }

    // ===============================
    // FIND ORDER
    // ===============================
    const order = await Order.findById(campusMartOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "CampusMart order not found.",
      });
    }

    // ===============================
    // BUYER AUTHORIZATION
    // ===============================
    if (String(order.buyer) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify this payment.",
      });
    }

    // ===============================
    // ALREADY PAID
    // ===============================
    if (order.paymentStatus === "Paid") {
      const populatedExistingOrder = await Order.findById(order._id)
        .populate("buyer", "name email studentId college")
        .populate("items.product", "title images category condition price")
        .populate("items.seller", "name email studentId college isVerified");

      return res.status(200).json({
        success: true,
        message: "Payment has already been verified.",
        order: populatedExistingOrder,
      });
    }

    // ===============================
    // RAZORPAY ORDER MATCH
    // ===============================
    if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order mismatch.",
      });
    }

    // ===============================
    // SIGNATURE VERIFICATION
    // ===============================
    const signaturePayload = `${order.razorpayOrderId}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest("hex");

    // ===============================
    // INVALID SIGNATURE
    // ===============================
    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "Failed";

      await order.save();

      await createNotification({
        user: order.buyer,
        type: "payment",
        title: "Payment verification failed",
        message: `We could not verify the payment for order ${order.orderNumber}. Please try again.`,
        link: `/orders/${order._id}`,
      });

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    // ===============================
    // MARK PAYMENT AS PAID
    // ===============================
    order.paymentStatus = "Paid";

    order.razorpayPaymentId = razorpay_payment_id;

    order.razorpaySignature = razorpay_signature;

    order.paidAt = new Date();

    await order.save();

    // =====================================================
    // CLEAR CART AFTER VERIFIED PAYMENT
    // =====================================================
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // ===============================
    // BUYER PAYMENT NOTIFICATION
    // ===============================
    await createNotification({
      user: order.buyer,
      type: "payment",
      title: "Payment successful",
      message: `Payment for order ${order.orderNumber} was completed successfully.`,
      link: `/orders/${order._id}`,
    });

    // ===============================
    // UNIQUE SELLERS
    // ===============================
    const sellerIds = [
      ...new Set(
        order.items
          .filter((item) => item.seller)
          .map((item) => String(item.seller)),
      ),
    ];

    // ===============================
    // SELLER PAYMENT NOTIFICATION
    // ===============================
    for (const sellerId of sellerIds) {
      await createNotification({
        user: sellerId,
        type: "payment",
        title: "Payment received",
        message: `Payment has been received for order ${order.orderNumber}. You can now process the order.`,
        link: `/seller/orders`,
      });
    }

    // ===============================
    // POPULATE ORDER
    // ===============================
    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email studentId college")
      .populate("items.product", "title images category condition price")
      .populate("items.seller", "name email studentId college isVerified");

    // ===============================
    // RESPONSE
    // ===============================
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================
module.exports = {
  createPaymentOrder,
  verifyPayment,
};
