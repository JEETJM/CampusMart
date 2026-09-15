const Review = require("../models/Review");
const Product = require("../models/Product");

const getAverageRating = async (
  productId,
) => {
  const result =
    await Review.aggregate([
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
    averageRating:
      result[0]?.averageRating || 0,

    reviewCount:
      result[0]?.reviewCount || 0,
  };
};

const syncProductRating = async (
  productId,
) => {
  const stats =
    await getAverageRating(productId);

  await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        averageRating:
          Number(
            stats.averageRating.toFixed(
              1,
            ),
          ),

        reviewCount:
          stats.reviewCount,
      },
    },
  );

  return stats;
};

/* =========================================================
   CREATE REVIEW
========================================================= */

exports.createReview = async (
  req,
  res,
) => {
  try {
    const {
      productId,
      orderId,
      rentalId,
      rating,
      title,
      comment,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

    const numericRating =
      Number(rating);

    if (
      !Number.isFinite(
        numericRating,
      ) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    if (
      !String(comment || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Review comment is required.",
      });
    }

    const product =
      await Product.findById(
        productId,
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    const existing =
      await Review.findOne({
        product: productId,
        reviewer: req.user._id,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this product.",
      });
    }

    const review =
      await Review.create({
        product: productId,
        reviewer: req.user._id,
        order: orderId || null,
        rental: rentalId || null,
        rating: numericRating,
        title:
          String(title || "").trim(),
        comment:
          String(comment).trim(),
        isVerifiedPurchase:
          Boolean(orderId || rentalId),
      });

    await syncProductRating(
      productId,
    );

    const populatedReview =
      await Review.findById(
        review._id,
      ).populate(
        "reviewer",
        "name profileImage",
      );

    return res.status(201).json({
      success: true,
      message:
        "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Create Review Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create review.",
    });
  }
};

/* =========================================================
   GET PRODUCT REVIEWS
========================================================= */

exports.getProductReviews = async (
  req,
  res,
) => {
  try {
    const { productId } =
      req.params;

    const reviews =
      await Review.find({
        product: productId,
      })
        .populate(
          "reviewer",
          "name profileImage",
        )
        .sort({
          createdAt: -1,
        });

    const stats =
      await getAverageRating(
        productId,
      );

    return res.status(200).json({
      success: true,
      reviews,
      averageRating:
        Number(
          stats.averageRating.toFixed(
            1,
          ),
        ),

      reviewCount:
        stats.reviewCount,
    });
  } catch (error) {
    console.error(
      "Get Reviews Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load reviews.",
    });
  }
};

/* =========================================================
   MY REVIEW
========================================================= */

exports.getMyReview = async (
  req,
  res,
) => {
  try {
    const { productId } =
      req.params;

    const review =
      await Review.findOne({
        product: productId,
        reviewer: req.user._id,
      }).populate(
        "reviewer",
        "name profileImage",
      );

    return res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.error(
      "Get My Review Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load your review.",
    });
  }
};

/* =========================================================
   UPDATE REVIEW
========================================================= */

exports.updateReview = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;

    const {
      rating,
      title,
      comment,
    } = req.body;

    const review =
      await Review.findOne({
        _id: id,
        reviewer: req.user._id,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    if (rating !== undefined) {
      const numericRating =
        Number(rating);

      if (
        !Number.isFinite(
          numericRating,
        ) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 1 and 5.",
        });
      }

      review.rating =
        numericRating;
    }

    if (title !== undefined) {
      review.title =
        String(title).trim();
    }

    if (comment !== undefined) {
      if (
        !String(comment).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Review comment is required.",
        });
      }

      review.comment =
        String(comment).trim();
    }

    await review.save();

    const stats =
      await syncProductRating(
        review.product,
      );

    const populatedReview =
      await Review.findById(
        review._id,
      ).populate(
        "reviewer",
        "name profileImage",
      );

    return res.status(200).json({
      success: true,
      message:
        "Review updated successfully.",
      review: populatedReview,
      averageRating:
        Number(
          stats.averageRating.toFixed(
            1,
          ),
        ),
      reviewCount:
        stats.reviewCount,
    });
  } catch (error) {
    console.error(
      "Update Review Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update review.",
    });
  }
};

/* =========================================================
   DELETE REVIEW
========================================================= */

exports.deleteReview = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;

    const review =
      await Review.findOneAndDelete({
        _id: id,
        reviewer: req.user._id,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    const stats =
      await syncProductRating(
        review.product,
      );

    return res.status(200).json({
      success: true,
      message:
        "Review deleted successfully.",
      averageRating:
        Number(
          stats.averageRating.toFixed(
            1,
          ),
        ),
      reviewCount:
        stats.reviewCount,
    });
  } catch (error) {
    console.error(
      "Delete Review Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete review.",
    });
  }
};