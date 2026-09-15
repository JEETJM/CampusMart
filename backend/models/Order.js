const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    /* =====================================================
         BUYER
      ===================================================== */

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* =====================================================
         ITEMS
      ===================================================== */

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) => items.length > 0,

        message: "Order must contain at least one item.",
      },
    },

    /* =====================================================
         AMOUNT
      ===================================================== */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    /* =====================================================
         PICKUP LOCATION
      ===================================================== */

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    pickupCoordinates: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },
    },

    /* =====================================================
         PAYMENT METHOD
      ===================================================== */

    paymentMethod: {
      type: String,

      enum: ["Cash on Pickup", "Online"],

      default: "Cash on Pickup",
    },

    /* =====================================================
         PAYMENT STATUS
      ===================================================== */

    paymentStatus: {
      type: String,

      enum: ["Pending", "Paid", "Failed"],

      default: "Pending",
    },

    /* =====================================================
         RAZORPAY
      ===================================================== */

    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
         ORDER STATUS
      ===================================================== */

    orderStatus: {
      type: String,

      enum: [
        "Placed",
        "Confirmed",
        "Ready for Pickup",
        "Completed",
        "Cancelled",
      ],

      default: "Placed",
    },

    /* =====================================================
         ORDER NUMBER
      ===================================================== */

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    /* =====================================================
         NOTES
      ===================================================== */

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
