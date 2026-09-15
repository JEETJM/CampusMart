const express = require("express");

const {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  updateReport,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/* =========================================================
   STUDENT ROUTES
========================================================= */

router.post("/", authMiddleware, createReport);

router.get("/my", authMiddleware, getMyReports);

/* =========================================================
   ADMIN ROUTES
========================================================= */

router.get("/admin/all", authMiddleware, adminMiddleware, getAllReports);

router.get("/admin/:id", authMiddleware, adminMiddleware, getReportById);

router.put("/admin/:id", authMiddleware, adminMiddleware, updateReport);

module.exports = router;
