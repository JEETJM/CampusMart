const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// AUTH ROUTES
// ===============================

router.post("/register", registerUser);

router.post("/login", loginUser);

// Current logged-in user
router.get("/me", protect, getMe);

// Password reset
router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOTP);

router.post("/reset-password", resetPassword);

module.exports = router;
