const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Product = require("../models/Product");

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email studentId college")
      .populate("product", "title price images condition")
      .sort({
        lastMessageAt: -1,
      });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load conversations.",
    });
  }
};

const createConversation = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const sellerId = product.seller;

    if (sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself.",
      });
    }

    let conversation = await Conversation.findOne({
      product: productId,
      participants: {
        $all: [req.user._id, sellerId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, sellerId],
        product: productId,
      });
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email studentId college")
      .populate("product", "title price images condition seller");

    res.status(201).json({
      success: true,
      conversation: populatedConversation,
    });
  } catch (error) {
    console.error("Create Conversation Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create conversation.",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation.",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email studentId")
      .sort({
        createdAt: 1,
      });

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load messages.",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation.",
      });
    }

    const receiver = conversation.participants.find(
      (participant) => participant.toString() !== req.user._id.toString(),
    );

    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver,
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();

    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email studentId",
    );

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
};
