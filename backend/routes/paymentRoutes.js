const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */

router.post("/create-order", authMiddleware, createPaymentOrder);

/* =========================================================
   VERIFY PAYMENT
========================================================= */

router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
