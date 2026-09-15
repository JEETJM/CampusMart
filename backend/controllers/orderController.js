const crypto = require("crypto");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const createNotification = require("../utils/createNotification");

// ===============================
// GENERATE ORDER NUMBER
// ===============================
const generateOrderNumber = () => {
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `CM-${Date.now()}-${randomPart}`;
};

// ===============================
// CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
  try {
    const { pickupLocation, pickupCoordinates, paymentMethod, notes } =
      req.body || {};

    // ===============================
    // PICKUP LOCATION VALIDATION
    // ===============================
    if (!pickupLocation || !String(pickupLocation).trim()) {
      return res.status(400).json({
        success: false,
        message: "Pickup location is required.",
      });
    }

    // ===============================
    // PAYMENT METHOD
    // ===============================
    const selectedPaymentMethod = paymentMethod || "Cash on Pickup";

    if (!["Cash on Pickup", "Online"].includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    // ===============================
    // GET USER CART
    // ===============================
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      populate: {
        path: "seller",
        select: "name email studentId college isVerified",
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // ===============================
    // VALIDATE CART PRODUCTS
    // ===============================
    const validItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        continue;
      }

      const product = await Product.findById(item.product._id);

      if (!product) {
        continue;
      }

      // ===============================
      // PRODUCT AVAILABILITY
      // ===============================
      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.title} is no longer available.`,
        });
      }

      // ===============================
      // PREVENT BUYING OWN PRODUCT
      // ===============================
      if (String(product.seller) === String(req.user._id)) {
        return res.status(400).json({
          success: false,
          message: "You cannot purchase your own product.",
        });
      }

      // ===============================
      // QUANTITY
      // ===============================
      const quantity = Number(item.quantity || 1);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.title}.`,
        });
      }

      // ===============================
      // STOCK CHECK
      // ===============================
      if (
        product.stock !== undefined &&
        product.stock !== null &&
        quantity > Number(product.stock)
      ) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of ${product.title} are available.`,
        });
      }

      validItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0] || "",
        price: Number(product.price || 0),
        quantity,
        seller: product.seller,
      });
    }

    // ===============================
    // VALID ITEM CHECK
    // ===============================
    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found in your cart.",
      });
    }

    // ===============================
    // SERVER-SIDE SUBTOTAL
    // ===============================
    const subtotal = validItems.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    // ===============================
    // PICKUP COORDINATES
    // ===============================
    let pickupLat = null;
    let pickupLng = null;

    if (
      pickupCoordinates &&
      pickupCoordinates.lat !== undefined &&
      pickupCoordinates.lat !== null &&
      pickupCoordinates.lat !== ""
    ) {
      const parsedLat = Number(pickupCoordinates.lat);

      if (Number.isFinite(parsedLat)) {
        pickupLat = parsedLat;
      }
    }

    if (
      pickupCoordinates &&
      pickupCoordinates.lng !== undefined &&
      pickupCoordinates.lng !== null &&
      pickupCoordinates.lng !== ""
    ) {
      const parsedLng = Number(pickupCoordinates.lng);

      if (Number.isFinite(parsedLng)) {
        pickupLng = parsedLng;
      }
    }

    // ===============================
    // CREATE CAMPUSMART ORDER
    // ===============================
    const order = await Order.create({
      buyer: req.user._id,

      items: validItems,

      subtotal,

      pickupLocation: String(pickupLocation).trim(),

      pickupCoordinates: {
        lat: pickupLat,
        lng: pickupLng,
      },

      paymentMethod: selectedPaymentMethod,

      paymentStatus: "Pending",

      orderStatus: "Placed",

      orderNumber: generateOrderNumber(),

      notes: String(notes || "").trim(),
    });

    // ===============================
    // CASH ORDER
    // ===============================
    if (selectedPaymentMethod === "Cash on Pickup") {
      cart.items = [];
      await cart.save();
    }

    // ===============================
    // COLLECT UNIQUE SELLERS
    // ===============================
    const sellerIds = [
      ...new Set(
        order.items
          .filter((item) => item.seller)
          .map((item) => String(item.seller)),
      ),
    ];

    // ===============================
    // BUYER NOTIFICATION
    // ===============================
    if (selectedPaymentMethod === "Online") {
      await createNotification({
        user: req.user._id,
        type: "order",
        title: "Order created",
        message: `Your order ${order.orderNumber} has been created. Complete the online payment to continue.`,
        link: `/orders/${order._id}`,
      });
    } else {
      await createNotification({
        user: req.user._id,
        type: "order",
        title: "Order placed successfully",
        message: `Your order ${order.orderNumber} has been placed successfully with Cash on Pickup.`,
        link: `/orders/${order._id}`,
      });
    }

    // ===============================
    // SELLER NOTIFICATIONS
    // ===============================
    for (const sellerId of sellerIds) {
      await createNotification({
        user: sellerId,
        type: "order",
        title: "New order received",
        message:
          selectedPaymentMethod === "Online" ?
            `A new order ${order.orderNumber} has been created. Payment is currently pending.`
          : `You have received a new Cash on Pickup order ${order.orderNumber}.`,
        link: `/seller/orders`,
      });
    }

    // ===============================
    // POPULATE ORDER
    // ===============================
    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email studentId college")
      .populate("items.seller", "name email studentId college isVerified")
      .populate("items.product", "title images category condition price");

    // ===============================
    // RESPONSE
    // ===============================
    return res.status(201).json({
      success: true,

      message:
        selectedPaymentMethod === "Online" ?
          "Order created. Complete online payment to continue."
        : "Order placed successfully.",

      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create order.",
    });
  }
};

// ===============================
// GET MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    })
      .populate("items.product", "title images category condition price")
      .populate("items.seller", "name email studentId college isVerified")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

// ===============================
// GET ORDER BY ID
// ===============================
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("buyer", "name email studentId college")
      .populate("items.product", "title images category condition price")
      .populate("items.seller", "name email studentId college isVerified");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ===============================
    // BUYER AUTHORIZATION
    // ===============================
    if (String(order.buyer._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order.",
    });
  }
};

// ===============================
// GET SELLER ORDERS
// ===============================
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      "items.seller": sellerId,
    })
      .populate("buyer", "name email studentId college")
      .populate("items.product", "title images price")
      .sort({
        createdAt: -1,
      });

    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) => item.seller && String(item.seller) === String(sellerId),
        );

        if (sellerItems.length === 0) {
          return null;
        }

        const sellerSubtotal = sellerItems.reduce(
          (total, item) =>
            total + Number(item.price || 0) * Number(item.quantity || 1),
          0,
        );

        return {
          _id: order._id,

          orderNumber: order.orderNumber,

          buyer: order.buyer,

          items: sellerItems,

          subtotal: sellerSubtotal,

          pickupLocation: order.pickupLocation,

          pickupCoordinates: order.pickupCoordinates,

          paymentMethod: order.paymentMethod,

          paymentStatus: order.paymentStatus,

          orderStatus: order.orderStatus,

          notes: order.notes,

          createdAt: order.createdAt,

          updatedAt: order.updatedAt,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error) {
    console.error("Get Seller Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch seller orders.",
    });
  }
};

// ===============================
// UPDATE SELLER ORDER STATUS
// ===============================
const updateSellerOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { orderStatus } = req.body || {};

    const allowedStatuses = [
      "Confirmed",
      "Ready for Pickup",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const sellerId = String(req.user._id);

    // ===============================
    // SELLER OWNERSHIP
    // ===============================
    const sellerOwnsProduct = order.items.some(
      (item) => item.seller && String(item.seller) === sellerId,
    );

    if (!sellerOwnsProduct) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order.",
      });
    }

    // ===============================
    // CANCELLED CHECK
    // ===============================
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated.",
      });
    }

    // ===============================
    // ONLINE PAYMENT CHECK
    // ===============================
    if (order.paymentMethod === "Online" && order.paymentStatus !== "Paid") {
      if (orderStatus !== "Cancelled") {
        return res.status(400).json({
          success: false,
          message:
            "Online payment must be completed before updating this order status.",
        });
      }

      // Do not allow seller to cancel
      // an online paid/unpaid order here.
      return res.status(400).json({
        success: false,
        message:
          "This online order cannot be cancelled by the seller while payment is pending.",
      });
    }

    // ===============================
    // PAID ONLINE ORDER CANCELLATION
    // ===============================
    if (
      orderStatus === "Cancelled" &&
      order.paymentMethod === "Online" &&
      order.paymentStatus === "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Paid online orders require refund processing before cancellation.",
      });
    }

    // ===============================
    // UPDATE STATUS
    // ===============================
    const previousStatus = order.orderStatus;

    order.orderStatus = orderStatus;

    await order.save();

    // ===============================
    // BUYER NOTIFICATION
    // ===============================
    if (previousStatus !== orderStatus) {
      await createNotification({
        user: order.buyer,
        type: "order",
        title:
          orderStatus === "Cancelled" ? "Order cancelled" : (
            "Order status updated"
          ),
        message:
          orderStatus === "Cancelled" ?
            `Your order ${order.orderNumber} has been cancelled by the seller.`
          : `Your order ${order.orderNumber} is now "${orderStatus}".`,
        link: `/orders/${order._id}`,
      });
    }

    await order.populate("buyer", "name email studentId college");

    await order.populate("items.product", "title images price");

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Seller Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};

// ===============================
// CANCEL ORDER
// ===============================
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ===============================
    // ONLY BUYER CAN CANCEL
    // ===============================
    if (String(order.buyer) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order.",
      });
    }

    // ===============================
    // CANNOT CANCEL
    // ===============================
    if (["Completed", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled.",
      });
    }

    // ===============================
    // PAID ONLINE ORDER
    // ===============================
    if (order.paymentMethod === "Online" && order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message:
          "Paid online orders require refund processing before cancellation.",
      });
    }

    // ===============================
    // CANCEL
    // ===============================
    order.orderStatus = "Cancelled";

    await order.save();

    // ===============================
    // SELLER NOTIFICATIONS
    // ===============================
    const sellerIds = [
      ...new Set(
        order.items
          .filter((item) => item.seller)
          .map((item) => String(item.seller)),
      ),
    ];

    for (const sellerId of sellerIds) {
      await createNotification({
        user: sellerId,
        type: "order",
        title: "Order cancelled",
        message: `Order ${order.orderNumber} has been cancelled by the buyer.`,
        link: `/seller/orders`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel order.",
    });
  }
};

// ===============================
// EXPORTS
// ===============================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateSellerOrderStatus,
};
