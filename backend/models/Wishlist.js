const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    _id: false,
  }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);