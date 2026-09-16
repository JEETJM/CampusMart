const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  deleteProduct,
  adminGetProducts,
  adminUpdateProductAvailability,
  adminDeleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ============================================================
// PUBLIC PRODUCT ROUTES
// ============================================================

// Get marketplace products
router.get("/", getProducts);

// ============================================================
// USER PRODUCT ROUTES
// ============================================================

// Create product
router.post("/", protect, createProduct);

// My listings
router.get("/my/listings", protect, getMyProducts);

// ============================================================
// ADMIN PRODUCT ROUTES
// IMPORTANT: এগুলো /:id এর আগে রাখতে হবে
// ============================================================

// Admin: get all products
router.get("/admin/all", protect, adminMiddleware, adminGetProducts);

// Admin: activate / deactivate product
router.put(
  "/admin/:id/availability",
  protect,
  adminMiddleware,
  adminUpdateProductAvailability,
);

// Admin: delete product
router.delete("/admin/:id", protect, adminMiddleware, adminDeleteProduct);

// ============================================================
// SINGLE PRODUCT
// ============================================================

// Get single product
router.get("/:id", getProductById);

// Seller: delete own product
router.delete("/:id", protect, deleteProduct);

module.exports = router;
