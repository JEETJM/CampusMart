const express = require("express");

const {
  createReview,
  getProductReviews,
  getMyReview,
  updateReview,
  deleteReview,
  checkReviewEligibility,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Get all reviews for a product
router.get("/product/:productId", getProductReviews);

/* =========================================================
   AUTHENTICATED
========================================================= */

// Check whether logged-in user can review the product
router.get(
  "/product/:productId/eligibility",
  authMiddleware,
  checkReviewEligibility,
);

// Get logged-in user's review for a product
router.get("/product/:productId/mine", authMiddleware, getMyReview);

// Create verified review
router.post("/", authMiddleware, createReview);

// Update own review
router.put("/:id", authMiddleware, updateReview);

// Delete own review
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
