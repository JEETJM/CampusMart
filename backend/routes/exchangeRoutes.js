const express = require("express");

const {
  getMyExchangeProducts,
  createExchangeOffer,
  getMyExchangeOffers,
  getReceivedExchangeOffers,
  acceptExchangeOffer,
  counterExchangeOffer,
  acceptCounterExchangeOffer,
  rejectCounterExchangeOffer,
  rejectExchangeOffer,
  cancelExchangeOffer,
} = require("../controllers/exchangeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Available products owned by current user
router.get("/my-products", protect, getMyExchangeProducts);

// Create exchange offer
router.post("/", protect, createExchangeOffer);

// Buyer offers
router.get("/my", protect, getMyExchangeOffers);

// Seller received offers
router.get("/received", protect, getReceivedExchangeOffers);

// Seller direct accept
router.put("/:id/accept", protect, acceptExchangeOffer);

// Seller counter
router.put("/:id/counter", protect, counterExchangeOffer);

// Buyer accepts counter
router.put("/:id/accept-counter", protect, acceptCounterExchangeOffer);

// Buyer rejects counter
router.put("/:id/reject-counter", protect, rejectCounterExchangeOffer);

// Seller rejects
router.put("/:id/reject", protect, rejectExchangeOffer);

// Buyer cancels
router.put("/:id/cancel", protect, cancelExchangeOffer);

module.exports = router;
