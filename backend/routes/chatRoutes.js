const express = require("express");

const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/conversations", protect, getConversations);

router.post("/conversations", protect, createConversation);

router.get("/conversations/:conversationId/messages", protect, getMessages);

router.post("/conversations/:conversationId/messages", protect, sendMessage);

module.exports = router;
