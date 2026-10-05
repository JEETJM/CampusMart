const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,

  // Seller
  updateProduct,
  deleteProduct,

  // Admin
  adminGetProducts,
  adminUpdateProduct,
  adminUpdateProductAvailability,
  adminDeleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ============================================================
// PUBLIC PRODUCT ROUTES
// ============================================================

// Get all marketplace products
router.get("/", getProducts);

// ============================================================
// USER / SELLER PRODUCT ROUTES
// ============================================================

// Create a new product
router.post("/", protect, createProduct);

// Get products created by logged-in seller
router.get("/my/listings", protect, getMyProducts);

// Update own product
// Only the seller who created the product can update it
router.put("/:id", protect, updateProduct);

// Delete own product
// Only the seller who created the product can delete it
router.delete("/:id", protect, deleteProduct);

// ============================================================
// ADMIN PRODUCT ROUTES
// IMPORTANT:
// Admin routes MUST come before /:id routes
// ============================================================

// Admin: get all products
router.get("/admin/all", protect, adminMiddleware, adminGetProducts);

// Admin: update ANY product
router.put("/admin/:id", protect, adminMiddleware, adminUpdateProduct);

// Admin: activate / deactivate ANY product
router.put(
  "/admin/:id/availability",
  protect,
  adminMiddleware,
  adminUpdateProductAvailability,
);

// Admin: delete ANY product
router.delete("/admin/:id", protect, adminMiddleware, adminDeleteProduct);

// ============================================================
// SINGLE PRODUCT
// ============================================================

// Get single product
router.get("/:id", getProductById);

module.exports = router;
