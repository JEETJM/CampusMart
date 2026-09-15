const express = require("express");

const {
  createReview,
  getProductReviews,
  getMyReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* Public */
router.get("/product/:productId", getProductReviews);

/* Authenticated */
router.get("/product/:productId/mine", authMiddleware, getMyReview);

router.post("/", authMiddleware, createReview);

router.put("/:id", authMiddleware, updateReview);

router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
