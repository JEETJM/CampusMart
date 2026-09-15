const mongoose = require("mongoose");

const exchangeOfferSchema = new mongoose.Schema(
  {
    // Product owned by seller that buyer wants
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Product originally offered by buyer
    offeredProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Original buyer message
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Seller's counter product
    counterProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Seller's counter message
    counterMessage: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Countered",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
    },

    counteredAt: {
      type: Date,
      default: null,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.ExchangeOffer ||
  mongoose.model("ExchangeOffer", exchangeOfferSchema);
