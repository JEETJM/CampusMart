const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Cycles",
        "Furniture",
        "Clothing",
        "Accessories",
        "Sports",
        "Notes",
        "Other",
      ],
    },

    // Selling price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair"],
      default: "Good",
    },

    listingType: {
      type: String,
      enum: ["Sell", "Rent", "Exchange"],
      default: "Sell",
    },

    images: [
      {
        type: String,
      },
    ],

    location: {
      type: String,
      default: "",
      trim: true,
    },
    locationCoordinates: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    college: {
      type: String,
      default: "Narula Institute of Technology",
      trim: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // RENTAL FIELDS
    // =====================================================

    rentalPricePerDay: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    rentalDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumRentalDays: {
      type: Number,
      default: 1,
      min: 1,
    },

    maximumRentalDays: {
      type: Number,
      default: 30,
      min: 1,
    },

    rentalInstructions: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // =====================================================
    // PRODUCT ANALYTICS
    // =====================================================

    views: {
      type: Number,
      default: 0,
    },

    wishlistCount: {
      type: Number,
      default: 0,
    },

    // =====================================================
    // AI FIELDS
    // =====================================================

    aiFairPrice: {
      type: Number,
      default: null,
    },

    aiRiskScore: {
      type: Number,
      default: null,
    },

    aiQualityScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
