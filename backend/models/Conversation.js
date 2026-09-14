const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    lastMessage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({
  participants: 1,
  product: 1,
});

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);