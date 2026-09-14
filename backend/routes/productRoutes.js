const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// PUBLIC ROUTES
// ==============================

router.get("/", getProducts);


// ==============================
// PROTECTED ROUTES
// ==============================

router.post("/", protect, createProduct);

router.get("/my/listings", protect, getMyProducts);

router.get("/:id", getProductById);

router.delete("/:id", protect, deleteProduct);


module.exports = router;