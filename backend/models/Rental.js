const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    dailyRate: {
      type: Number,
      required: true,
      min: 0,
    },

    rentalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    pickupLocation: {
      type: String,
      trim: true,
      default: "",
    },

    renterMessage: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    ownerMessage: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Active",
        "Returned",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    returnedAt: {
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

rentalSchema.index({
  product: 1,
  startDate: 1,
  endDate: 1,
});

rentalSchema.index({
  renter: 1,
  status: 1,
});

rentalSchema.index({
  owner: 1,
  status: 1,
});

module.exports =
  mongoose.models.Rental || mongoose.model("Rental", rentalSchema);
