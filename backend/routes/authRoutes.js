const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post("/register", registerUser);

// ===============================
// LOGIN
// ===============================
router.post("/login", loginUser);

// ===============================
// CURRENT USER
// ===============================
router.get("/me", protect, getMe);

// ===============================
// PASSWORD RESET
// ===============================
router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOTP);

router.post("/reset-password", resetPassword);

// ===============================
// UPDATE PROFILE
// ===============================
router.put("/profile", protect, upload.single("profileImage"), updateProfile);

module.exports = router;
