const express = require("express");

const {
  createExchangeOffer,
  getMyExchangeOffers,
  getReceivedExchangeOffers,
  acceptExchangeOffer,
  rejectExchangeOffer,
  cancelExchangeOffer,
} = require("../controllers/exchangeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createExchangeOffer);

router.get("/my", protect, getMyExchangeOffers);

router.get("/received", protect, getReceivedExchangeOffers);

router.put("/:id/accept", protect, acceptExchangeOffer);

router.put("/:id/reject", protect, rejectExchangeOffer);

router.put("/:id/cancel", protect, cancelExchangeOffer);

module.exports = router;
