const Review = require("../models/Review");
const Product = require("../models/Product");

/* =========================================================
   GET AVERAGE RATING
========================================================= */

const getAverageRating = async (productId) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  return {
    averageRating: result[0]?.averageRating || 0,
    reviewCount: result[0]?.reviewCount || 0,
  };
};

/* =========================================================
   SYNC PRODUCT RATING
========================================================= */

const syncProductRating = async (productId) => {
  const stats = await getAverageRating(productId);

  await Product.findByIdAndUpdate(productId, {
    $set: {
      averageRating: Number(stats.averageRating.toFixed(1)),
      reviewCount: stats.reviewCount,
    },
  });

  return stats;
};

/* =========================================================
   CHECK REVIEW ELIGIBILITY
========================================================= */

exports.checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    /* =====================================================
       CHECK PRODUCT
    ===================================================== */

    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /* =====================================================
       CHECK EXISTING REVIEW
    ===================================================== */

    const existingReview = await Review.findOne({
      product: productId,
      reviewer: req.user._id,
    }).lean();

    if (existingReview) {
      return res.status(200).json({
        success: true,
        eligible: false,
        alreadyReviewed: true,
        type: null,
        transactionId: null,
        message: "You have already reviewed this product.",
      });
    }

    /* =====================================================
       CHECK COMPLETED PURCHASE
    ===================================================== */

    let purchase = null;

    try {
      const Order = require("../models/Order");

      purchase = await Order.findOne({
        buyer: req.user._id,
        orderStatus: "Completed",
        "items.product": productId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();
    } catch (orderError) {
      console.error("Order eligibility check skipped:", orderError.message);
    }

    if (purchase) {
      return res.status(200).json({
        success: true,
        eligible: true,
        alreadyReviewed: false,
        type: "purchase",
        transactionId: purchase._id,
        message:
          "You are eligible to review this product from your completed purchase.",
      });
    }

    /* =====================================================
       CHECK COMPLETED RENTAL
    ===================================================== */

    let rental = null;

    try {
      const Rental = require("../models/Rental");

      rental = await Rental.findOne({
        renter: req.user._id,
        product: productId,
        status: "Completed",
      })
        .sort({
          createdAt: -1,
        })
        .lean();
    } catch (rentalError) {
      console.error("Rental eligibility check skipped:", rentalError.message);
    }

    if (rental) {
      return res.status(200).json({
        success: true,
        eligible: true,
        alreadyReviewed: false,
        type: "rental",
        transactionId: rental._id,
        message:
          "You are eligible to review this product from your completed rental.",
      });
    }

    /* =====================================================
       NOT ELIGIBLE
    ===================================================== */

    return res.status(200).json({
      success: true,
      eligible: false,
      alreadyReviewed: false,
      type: null,
      transactionId: null,
      message: "Complete a purchase or rental before reviewing this product.",
    });
  } catch (error) {
    console.error("Review Eligibility Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to check review eligibility.",
    });
  }
};

/* =========================================================
   CREATE VERIFIED REVIEW
========================================================= */

exports.createReview = async (req, res) => {
  try {
    const { productId, orderId, rentalId, rating, title, comment } =
      req.body || {};

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const cleanTitle = String(title || "").trim();

    const cleanComment = String(comment || "").trim();

    if (!cleanComment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    /* =====================================================
       CHECK PRODUCT
    ===================================================== */

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /* =====================================================
       CHECK EXISTING REVIEW
    ===================================================== */

    const existingReview = await Review.findOne({
      product: productId,
      reviewer: req.user._id,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    let verifiedTransaction = null;
    let verifiedOrderId = null;
    let verifiedRentalId = null;

    /* =====================================================
       VERIFY COMPLETED ORDER
    ===================================================== */

    if (orderId) {
      const Order = require("../models/Order");

      const order = await Order.findOne({
        _id: orderId,
        buyer: req.user._id,
      }).lean();

      if (!order) {
        return res.status(403).json({
          success: false,
          message: "Order could not be verified.",
        });
      }

      /* ---------------------------------------------------
         ORDER STATUS
      --------------------------------------------------- */

      if (order.orderStatus !== "Completed") {
        return res.status(403).json({
          success: false,
          message:
            "You can review this product only after the order is completed.",
        });
      }

      /* ---------------------------------------------------
         OPTIONAL PAYMENT CHECK
         Online order should be Paid.
         Cash on Pickup can be completed
         without Razorpay payment.
      --------------------------------------------------- */

      if (order.paymentMethod === "Online" && order.paymentStatus !== "Paid") {
        return res.status(403).json({
          success: false,
          message: "Online payment for this order has not been completed.",
        });
      }

      /* ---------------------------------------------------
         CHECK PRODUCT EXISTS IN ORDER
      --------------------------------------------------- */

      const items = Array.isArray(order.items) ? order.items : [];

      const purchasedProduct = items.some((item) => {
        const itemProduct = item.product?._id || item.product || item.productId;

        return String(itemProduct) === String(productId);
      });

      if (!purchasedProduct) {
        return res.status(403).json({
          success: false,
          message: "This product was not found in the verified order.",
        });
      }

      verifiedTransaction = "purchase";

      verifiedOrderId = order._id;
    }

    /* =====================================================
       VERIFY COMPLETED RENTAL
    ===================================================== */

    if (rentalId) {
      const Rental = require("../models/Rental");

      const rental = await Rental.findOne({
        _id: rentalId,
        renter: req.user._id,
      }).lean();

      if (!rental) {
        return res.status(403).json({
          success: false,
          message: "Rental could not be verified.",
        });
      }

      /* ---------------------------------------------------
         PRODUCT CHECK
      --------------------------------------------------- */

      if (String(rental.product) !== String(productId)) {
        return res.status(403).json({
          success: false,
          message: "This product was not found in the verified rental.",
        });
      }

      /* ---------------------------------------------------
         RENTAL STATUS
      --------------------------------------------------- */

      const rentalStatus = String(rental.status || "").toLowerCase();

      if (rentalStatus !== "completed") {
        return res.status(403).json({
          success: false,
          message:
            "You can review this product only after the rental is completed.",
        });
      }

      verifiedTransaction = "rental";

      verifiedRentalId = rental._id;
    }

    /* =====================================================
       TRANSACTION REQUIRED
    ===================================================== */

    if (!verifiedTransaction) {
      return res.status(403).json({
        success: false,
        message:
          "You can review a product only after completing a purchase or rental.",
      });
    }

    /* =====================================================
       CREATE REVIEW
    ===================================================== */

    const review = await Review.create({
      product: productId,

      reviewer: req.user._id,

      order: verifiedOrderId || null,

      rental: verifiedRentalId || null,

      rating: numericRating,

      title: cleanTitle,

      comment: cleanComment,

      isVerifiedPurchase: true,
    });

    /* =====================================================
       UPDATE PRODUCT RATING
    ===================================================== */

    const stats = await syncProductRating(productId);

    /* =====================================================
       POPULATE REVIEW
    ===================================================== */

    const populatedReview = await Review.findById(review._id).populate(
      "reviewer",
      "name profileImage",
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,
      message: "Verified review submitted successfully.",
      review: populatedReview,
      averageRating: Number(stats.averageRating.toFixed(1)),
      reviewCount: stats.reviewCount,
    });
  } catch (error) {
    console.error("Create Verified Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create review.",
    });
  }
};

/* =========================================================
   GET PRODUCT REVIEWS
========================================================= */

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const reviews = await Review.find({
      product: productId,
    })
      .populate("reviewer", "name profileImage")
      .sort({
        createdAt: -1,
      });

    const stats = await getAverageRating(productId);

    return res.status(200).json({
      success: true,
      reviews,

      averageRating: Number(stats.averageRating.toFixed(1)),

      reviewCount: stats.reviewCount,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

/* =========================================================
   GET MY REVIEW
========================================================= */

exports.getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const review = await Review.findOne({
      product: productId,
      reviewer: req.user._id,
    }).populate("reviewer", "name profileImage");

    return res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.error("Get My Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your review.",
    });
  }
};

/* =========================================================
   UPDATE REVIEW
========================================================= */

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const { rating, title, comment } = req.body || {};

    const review = await Review.findOne({
      _id: id,
      reviewer: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    /* =====================================================
       UPDATE RATING
    ===================================================== */

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        !Number.isFinite(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5.",
        });
      }

      review.rating = numericRating;
    }

    /* =====================================================
       UPDATE TITLE
    ===================================================== */

    if (title !== undefined) {
      review.title = String(title).trim();
    }

    /* =====================================================
       UPDATE COMMENT
    ===================================================== */

    if (comment !== undefined) {
      const cleanComment = String(comment).trim();

      if (!cleanComment) {
        return res.status(400).json({
          success: false,
          message: "Review comment is required.",
        });
      }

      review.comment = cleanComment;
    }

    await review.save();

    /* =====================================================
       SYNC PRODUCT RATING
    ===================================================== */

    const stats = await syncProductRating(review.product);

    /* =====================================================
       POPULATE
    ===================================================== */

    const populatedReview = await Review.findById(review._id).populate(
      "reviewer",
      "name profileImage",
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",

      review: populatedReview,

      averageRating: Number(stats.averageRating.toFixed(1)),

      reviewCount: stats.reviewCount,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update review.",
    });
  }
};

/* =========================================================
   DELETE REVIEW
========================================================= */

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOneAndDelete({
      _id: id,
      reviewer: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    /* =====================================================
       SYNC PRODUCT RATING
    ===================================================== */

    const stats = await syncProductRating(review.product);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",

      averageRating: Number(stats.averageRating.toFixed(1)),

      reviewCount: stats.reviewCount,
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete review.",
    });
  }
};
