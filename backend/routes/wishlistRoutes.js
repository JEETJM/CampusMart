const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getWishlist);

router.post("/", protect, addToWishlist);

router.get("/check/:productId", protect, checkWishlist);

router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;
