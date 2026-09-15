const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================================
    // BASIC INFORMATION
    // ==========================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ==========================================================
    // COLLEGE
    // ==========================================================

    college: {
      type: String,
      default: "Narula Institute of Technology",
      trim: true,
    },

    // ==========================================================
    // ROLE & ACCOUNT STATUS
    // ==========================================================

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================================================
    // PROFILE
    // ==========================================================

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },

    // ==========================================================
    // LOCATION
    // ==========================================================

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

    // ==========================================================
    // WISHLIST
    // ==========================================================

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ==========================================================
    // PASSWORD RESET
    // ==========================================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "User",
  userSchema,
);