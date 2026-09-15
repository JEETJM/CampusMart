const Rental = require("../models/Rental");
const Product = require("../models/Product");

// =====================================================
// HELPERS
// =====================================================

const getStartOfDay = (date) => {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  return value;
};

const getRentalDays = (startDate, endDate) => {
  const start = getStartOfDay(startDate);
  const end = getStartOfDay(endDate);

  const difference = end.getTime() - start.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1;
};

const hasDateConflict = async ({ productId, startDate, endDate }) => {
  const conflict = await Rental.findOne({
    product: productId,

    status: {
      $in: ["Pending", "Approved", "Active"],
    },

    startDate: {
      $lte: endDate,
    },

    endDate: {
      $gte: startDate,
    },
  });

  return Boolean(conflict);
};

const populateRental = (query) => {
  return query
    .populate(
      "product",
      "title images price condition listingType rentalPricePerDay rentalDeposit minimumRentalDays maximumRentalDays",
    )
    .populate("renter", "name email studentId college")
    .populate("owner", "name email studentId college");
};

// =====================================================
// CREATE RENTAL REQUEST
// =====================================================

const createRental = async (req, res) => {
  try {
    const renterId = req.user._id;

    const { productId, startDate, endDate, pickupLocation, renterMessage } =
      req.body;

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Product, start date and end date are required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Rental product not found.",
      });
    }

    if (product.listingType !== "Rent") {
      return res.status(400).json({
        success: false,
        message: "This product is not available for rent.",
      });
    }

    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable.",
      });
    }

    if (product.seller.toString() === renterId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot rent your own product.",
      });
    }

    if (!product.rentalPricePerDay || product.rentalPricePerDay <= 0) {
      return res.status(400).json({
        success: false,
        message: "Rental price has not been configured for this product.",
      });
    }

    const start = getStartOfDay(startDate);

    const end = getStartOfDay(endDate);

    const today = getStartOfDay(new Date());

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Rental start date cannot be in the past.",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after or equal to start date.",
      });
    }

    const rentalDays = getRentalDays(start, end);

    if (rentalDays < product.minimumRentalDays) {
      return res.status(400).json({
        success: false,
        message: `Minimum rental period is ${product.minimumRentalDays} day(s).`,
      });
    }

    if (rentalDays > product.maximumRentalDays) {
      return res.status(400).json({
        success: false,
        message: `Maximum rental period is ${product.maximumRentalDays} day(s).`,
      });
    }

    const conflict = await hasDateConflict({
      productId,
      startDate: start,
      endDate: end,
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message:
          "This product is already requested or rented during the selected dates.",
      });
    }

    // Prevent duplicate active request
    const duplicate = await Rental.findOne({
      product: productId,
      renter: renterId,
      status: {
        $in: ["Pending", "Approved", "Active"],
      },
      startDate: {
        $lte: end,
      },
      endDate: {
        $gte: start,
      },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "You already have an active rental request for these dates.",
      });
    }

    const dailyRate = product.rentalPricePerDay;

    const rentalAmount = dailyRate * rentalDays;

    const depositAmount = product.rentalDeposit || 0;

    const totalAmount = rentalAmount + depositAmount;

    const rental = await Rental.create({
      product: productId,
      renter: renterId,
      owner: product.seller,
      startDate: start,
      endDate: end,
      rentalDays,
      dailyRate,
      rentalAmount,
      depositAmount,
      totalAmount,
      pickupLocation: pickupLocation || product.location || "",
      renterMessage: renterMessage || "",
      status: "Pending",
      paymentStatus: "Pending",
    });

    const populatedRental = await populateRental(Rental.findById(rental._id));

    return res.status(201).json({
      success: true,
      message: "Rental request created successfully.",
      rental: populatedRental,
    });
  } catch (error) {
    console.error("Create Rental Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create rental request.",
    });
  }
};

// =====================================================
// BUYER / RENTER: MY RENTALS
// =====================================================

const getMyRentals = async (req, res) => {
  try {
    const rentals = await populateRental(
      Rental.find({
        renter: req.user._id,
      }).sort({
        createdAt: -1,
      }),
    );

    return res.status(200).json({
      success: true,
      rentals,
    });
  } catch (error) {
    console.error("Get My Rentals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your rentals.",
    });
  }
};

// =====================================================
// OWNER: RECEIVED RENTAL REQUESTS
// =====================================================

const getReceivedRentals = async (req, res) => {
  try {
    const rentals = await populateRental(
      Rental.find({
        owner: req.user._id,
      }).sort({
        createdAt: -1,
      }),
    );

    return res.status(200).json({
      success: true,
      rentals,
    });
  } catch (error) {
    console.error("Get Received Rentals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch rental requests.",
    });
  }
};

// =====================================================
// CHECK AVAILABILITY
// =====================================================

const checkRentalAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.listingType !== "Rent") {
      return res.status(400).json({
        success: false,
        message: "This product is not a rental listing.",
      });
    }

    const start = getStartOfDay(startDate);

    const end = getStartOfDay(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "Invalid rental date range.",
      });
    }

    const conflict = await hasDateConflict({
      productId: id,
      startDate: start,
      endDate: end,
    });

    const rentalDays = getRentalDays(start, end);

    return res.status(200).json({
      success: true,
      available: !conflict,
      rentalDays,
      dailyRate: product.rentalPricePerDay,
      rentalAmount: product.rentalPricePerDay * rentalDays,
      depositAmount: product.rentalDeposit || 0,
      totalAmount:
        product.rentalPricePerDay * rentalDays + (product.rentalDeposit || 0),
    });
  } catch (error) {
    console.error("Check Rental Availability Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to check rental availability.",
    });
  }
};

// =====================================================
// OWNER APPROVES
// =====================================================

const approveRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental request not found.",
      });
    }

    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (rental.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending rental requests can be approved.",
      });
    }

    const conflict = await hasDateConflict({
      productId: rental.product,
      startDate: rental.startDate,
      endDate: rental.endDate,
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "The selected rental dates are no longer available.",
      });
    }

    rental.status = "Approved";
    rental.approvedAt = new Date();

    await rental.save();

    // Reject overlapping pending requests
    await Rental.updateMany(
      {
        _id: {
          $ne: rental._id,
        },

        product: rental.product,

        status: "Pending",

        startDate: {
          $lte: rental.endDate,
        },

        endDate: {
          $gte: rental.startDate,
        },
      },
      {
        $set: {
          status: "Rejected",
          rejectedAt: new Date(),
          ownerMessage: "Rental dates are no longer available.",
        },
      },
    );

    const populatedRental = await populateRental(Rental.findById(rental._id));

    return res.status(200).json({
      success: true,
      message: "Rental request approved.",
      rental: populatedRental,
    });
  } catch (error) {
    console.error("Approve Rental Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to approve rental request.",
    });
  }
};

// =====================================================
// OWNER REJECTS
// =====================================================

const rejectRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental request not found.",
      });
    }

    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (rental.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending rental requests can be rejected.",
      });
    }

    rental.status = "Rejected";
    rental.rejectedAt = new Date();
    rental.ownerMessage = req.body?.message || "";

    await rental.save();

    return res.status(200).json({
      success: true,
      message: "Rental request rejected.",
      rental,
    });
  } catch (error) {
    console.error("Reject Rental Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject rental request.",
    });
  }
};

// =====================================================
// RENTER CANCELS
// =====================================================

const cancelRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found.",
      });
    }

    if (rental.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (!["Pending", "Approved"].includes(rental.status)) {
      return res.status(400).json({
        success: false,
        message: "This rental cannot be cancelled now.",
      });
    }

    rental.status = "Cancelled";
    rental.cancelledAt = new Date();

    await rental.save();

    return res.status(200).json({
      success: true,
      message: "Rental cancelled successfully.",
      rental,
    });
  } catch (error) {
    console.error("Cancel Rental Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel rental.",
    });
  }
};

// =====================================================
// OWNER MARKS RENTAL ACTIVE
// =====================================================

const startRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found.",
      });
    }

    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (rental.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved rentals can be started.",
      });
    }

    rental.status = "Active";

    await rental.save();

    return res.status(200).json({
      success: true,
      message: "Rental marked as active.",
      rental,
    });
  } catch (error) {
    console.error("Start Rental Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start rental.",
    });
  }
};

// =====================================================
// OWNER MARKS RETURNED
// =====================================================

const returnRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found.",
      });
    }

    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (!["Active", "Approved"].includes(rental.status)) {
      return res.status(400).json({
        success: false,
        message: "This rental cannot be marked as returned.",
      });
    }

    rental.status = "Returned";
    rental.returnedAt = new Date();

    rental.completedAt = new Date();

    rental.paymentStatus = "Refunded";

    await rental.save();

    return res.status(200).json({
      success: true,
      message: "Rental marked as returned and completed.",
      rental,
    });
  } catch (error) {
    console.error("Return Rental Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to complete rental return.",
    });
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getReceivedRentals,
  checkRentalAvailability,
  approveRental,
  rejectRental,
  cancelRental,
  startRental,
  returnRental,
};
