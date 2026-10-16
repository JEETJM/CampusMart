const Product = require("../models/Product");

const CONDITION_SCORE = {
  New: 4,
  "Like New": 3,
  Good: 2,
  Fair: 1,
};

const getPriceScore = (myPrice, otherPrice) => {
  if (myPrice <= 0 || otherPrice <= 0) return 0;

  const difference =
    Math.abs(myPrice - otherPrice) / Math.max(myPrice, otherPrice);

  return Math.max(0, 100 - difference * 100);
};

const getConditionScore = (myCondition, otherCondition) => {
  const myScore = CONDITION_SCORE[myCondition] || 1;
  const otherScore = CONDITION_SCORE[otherCondition] || 1;

  return Math.max(0, 100 - (Math.abs(myScore - otherScore) / 3) * 100);
};

const findExchangeMatches = async ({ productId, userId, limit = 10 }) => {
  if (!productId) {
    return {
      success: false,
      message: "Please select a product to exchange.",
    };
  }

  const myProduct = await Product.findOne({
    _id: productId,
    seller: userId,
    listingType: "Exchange",
    isAvailable: true,
  });

  if (!myProduct) {
    return {
      success: false,
      message:
        "Your available exchange listing was not found. Select one of your own exchange products.",
    };
  }

  const candidates = await Product.find({
    _id: { $ne: myProduct._id },
    seller: { $ne: userId },
    listingType: "Exchange",
    isAvailable: true,
    category: myProduct.category,
  })
    .populate("seller", "name")
    .limit(100)
    .lean();

  const matches = candidates
    .map((candidate) => {
      const priceScore = getPriceScore(
        Number(myProduct.price),
        Number(candidate.price),
      );

      const conditionScore = getConditionScore(
        myProduct.condition,
        candidate.condition,
      );

      const sameCollege =
        myProduct.college &&
        candidate.college &&
        myProduct.college === candidate.college;

      const score = Math.round(
        priceScore * 0.6 + conditionScore * 0.3 + (sameCollege ? 10 : 0),
      );

      const reasons = [
        "Both products are in the same category.",
        `Price similarity: ${Math.round(priceScore)}%.`,
        `Condition similarity: ${Math.round(conditionScore)}%.`,
      ];

      if (sameCollege) {
        reasons.push("Both students belong to the same college.");
      }

      return {
        product: candidate,
        matchScore: Math.min(100, score),
        reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, Math.max(1, Math.min(Number(limit) || 10, 20)));

  return {
    success: true,
    sourceProduct: {
      _id: myProduct._id,
      title: myProduct.title,
      category: myProduct.category,
      price: myProduct.price,
      condition: myProduct.condition,
    },
    totalMatches: matches.length,
    matches,
    note: "Match scores are rule-based estimates, not predictions from a trained machine-learning model.",
  };
};

module.exports = { findExchangeMatches };
