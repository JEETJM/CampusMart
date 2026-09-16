const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateSellerOrderStatus,

  // ADMIN
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ============================================================
// BUYER ROUTES
// ============================================================

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);

router.get("/seller", protect, getSellerOrders);

// ============================================================
// ADMIN ROUTES
// IMPORTANT: MUST COME BEFORE /:id
// ============================================================

router.get("/admin/all", protect, adminMiddleware, adminGetOrders);

router.get("/admin/:id", protect, adminMiddleware, adminGetOrderById);

router.put(
  "/admin/:id/status",
  protect,
  adminMiddleware,
  adminUpdateOrderStatus,
);

// ============================================================
// SELLER ORDER STATUS
// ============================================================

router.put("/seller/:id/status", protect, updateSellerOrderStatus);

// ============================================================
// BUYER CANCEL
// ============================================================

router.put("/:id/cancel", protect, cancelOrder);

// ============================================================
// SINGLE ORDER
// MUST COME AFTER SPECIFIC ROUTES
// ============================================================

router.get("/:id", protect, getOrderById);

module.exports = router;
