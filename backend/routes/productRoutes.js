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

router.get("/", getProducts);

router.post("/", protect, createProduct);

router.get(
  "/my/listings",
  protect,
  getMyProducts,
);

router.get("/:id", getProductById);

router.delete(
  "/:id",
  protect,
  deleteProduct,
);

module.exports = router;