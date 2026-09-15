const express = require("express");

const {
  registerUser,
  loginUser,
  adminLoginUser,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Student authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin authentication
router.post("/admin-login", adminLoginUser);

// Current logged-in user
router.get("/me", protect, getMe);

// Forgot password
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// Profile
router.put("/profile", protect, upload.single("profileImage"), updateProfile);

module.exports = router;
