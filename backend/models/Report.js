const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: ["Product", "User", "Order", "Message"],
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "Fraud or Scam",
        "Fake Product",
        "Wrong Information",
        "Prohibited Item",
        "Inappropriate Content",
        "Harassment",
        "Spam",
        "Payment Issue",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Resolved", "Rejected"],
      default: "Pending",
      index: true,
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Report || mongoose.model("Report", reportSchema);
