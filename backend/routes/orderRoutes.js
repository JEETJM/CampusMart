const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my", protect, getMyOrders);

// Get single order
router.get("/:id", protect, getOrderById);

// Cancel order
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;