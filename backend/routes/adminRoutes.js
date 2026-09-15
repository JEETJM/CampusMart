const express = require("express");

const {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserVerification,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ======================================================
// ADMIN DASHBOARD
// ======================================================

router.get("/dashboard", authMiddleware, adminMiddleware, getAdminDashboard);

// ======================================================
// ADMIN USER MANAGEMENT
// ======================================================

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);

router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus,
);

router.put(
  "/users/:id/verification",
  authMiddleware,
  adminMiddleware,
  updateUserVerification,
);

module.exports = router;
