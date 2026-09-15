const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateSellerOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);

// Seller routes FIRST
router.get("/seller/my", protect, getSellerOrders);

// Buyer routes
router.get("/my", protect, getMyOrders);

router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/seller-status", protect, updateSellerOrderStatus);

router.get("/:id", protect, getOrderById);

module.exports = router;