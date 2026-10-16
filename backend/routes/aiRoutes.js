const express = require("express");

const {
  aiSmartProductSearch,
  aiFairPricePrediction,
  aiBuyRentAdvisor,
  aiExchangeMatcher,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// AI Smart Product Finder
router.post("/search", protect, aiSmartProductSearch);

// AI Fair Price Predictor
router.post("/fair-price", protect, aiFairPricePrediction);
// AI Buy vs Rent Advisor
router.post("/buy-vs-rent", protect, aiBuyRentAdvisor);

// AI Exchange Matcher
router.post("/exchange-matches", protect, aiExchangeMatcher);
module.exports = router;
