const express = require("express");

const {
  createRental,
  getMyRentals,
  getReceivedRentals,
  checkRentalAvailability,
  approveRental,
  rejectRental,
  cancelRental,
  startRental,
  returnRental,
} = require("../controllers/rentalController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create rental request
router.post("/", protect, createRental);

// Renter's rentals
router.get("/my", protect, getMyRentals);

// Owner's received rental requests
router.get("/received", protect, getReceivedRentals);

// Check product availability
router.get("/availability/:id", protect, checkRentalAvailability);

// Owner approves
router.put("/:id/approve", protect, approveRental);

// Owner rejects
router.put("/:id/reject", protect, rejectRental);

// Renter cancels
router.put("/:id/cancel", protect, cancelRental);

// Owner starts rental
router.put("/:id/start", protect, startRental);

// Owner marks returned
router.put("/:id/return", protect, returnRental);

module.exports = router;
