const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({
  product: 1,
  createdAt: -1,
});

reviewSchema.index(
  {
    product: 1,
    reviewer: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      order: { $ne: null },
    },
  },
);

module.exports = mongoose.model("Review", reviewSchema);
