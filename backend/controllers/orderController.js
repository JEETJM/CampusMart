const crypto = require("crypto");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/product");

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
    const { pickupLocation, paymentMethod, notes } = req.body || {};

    if (!pickupLocation?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pickup location is required.",
      });
    }

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

    if (!cart || cart.items.length === 0) {
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

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.title} is no longer available.`,
        });
      }

      // Prevent buying own product
      if (product.seller.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot purchase your own product.",
        });
      }

      validItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: item.quantity,
        seller: product.seller,
      });
    }

    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found in your cart.",
      });
    }

    // ===============================
    // CALCULATE SUBTOTAL
    // ===============================
    const subtotal = validItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // ===============================
    // CREATE ORDER
    // ===============================
    const order = await Order.create({
      buyer: req.user._id,

      items: validItems,

      subtotal,

      pickupLocation: pickupLocation.trim(),

      paymentMethod: selectedPaymentMethod,

      paymentStatus: selectedPaymentMethod === "Online" ? "Pending" : "Pending",

      orderStatus: "Placed",

      orderNumber: generateOrderNumber(),

      notes: notes?.trim() || "",
    });

    // ===============================
    // CLEAR CART
    // ===============================
    cart.items = [];

    await cart.save();

    // ===============================
    // POPULATE ORDER
    // ===============================
    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email studentId college")
      .populate("items.seller", "name email studentId college isVerified")
      .populate("items.product", "title images category condition");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
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
      .populate("items.product", "title images category condition")
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
      .populate("items.product", "title images category condition")
      .populate("items.seller", "name email studentId college isVerified");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Only buyer can view own order
    if (order.buyer._id.toString() !== req.user._id.toString()) {
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
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      "items.seller": sellerId,
    })
      .populate("buyer", "name email studentId college")
      .populate("items.product", "title images price")
      .sort({ createdAt: -1 });

    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.seller && item.seller.toString() === sellerId.toString(),
        );

        if (sellerItems.length === 0) {
          return null;
        }

        const sellerSubtotal = sellerItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );

        return {
          _id: order._id,
          orderNumber: order.orderNumber,
          buyer: order.buyer,
          items: sellerItems,
          subtotal: sellerSubtotal,
          pickupLocation: order.pickupLocation,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          notes: order.notes,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error) {
    console.error("Get Seller Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch seller orders.",
    });
  }
};

const updateSellerOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

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

    const sellerId = req.user._id.toString();

    const sellerOwnsProduct = order.items.some(
      (item) => item.seller && item.seller.toString() === sellerId,
    );

    if (!sellerOwnsProduct) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order.",
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated.",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    await order.populate("buyer", "name email studentId college");

    await order.populate("items.product", "title images price");

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Seller Order Status Error:", error);

    res.status(500).json({
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

    // Only buyer can cancel
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order.",
      });
    }

    // Cannot cancel completed/cancelled orders
    if (["Completed", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled.",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

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
