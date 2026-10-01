const express = require("express");

const {
  aiSmartProductSearch,
  aiFairPricePrediction,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// AI Smart Product Finder
router.post("/search", protect, aiSmartProductSearch);

// AI Fair Price Predictor
router.post("/fair-price", protect, aiFairPricePrediction);

module.exports = router;