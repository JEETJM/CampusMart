const { smartProductSearch } = require("../services/aiSearchService");
const { getFairPricePrediction } = require("../services/aiPriceService");
const { getBuyRentAdvice } = require("../services/aiBuyRentService");

// ============================================================
// AI SMART PRODUCT SEARCH
// ============================================================

const aiSmartProductSearch = async (req, res) => {
  try {
    const { query } = req.body || {};

    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a product search query.",
      });
    }

    const result = await smartProductSearch(query, req.user);

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI Smart Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI product search failed.",
    });
  }
};

// ============================================================
// AI FAIR PRICE PREDICTOR
// ============================================================

const aiFairPricePrediction = async (req, res) => {
  try {
    const { title, category, condition, price, description } = req.body || {};

    const result = await getFairPricePrediction({
      title,
      category,
      condition,
      price,
      description,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI Fair Price Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI fair price prediction failed.",
    });
  }
};

// ============================================================
// AI BUY VS RENT ADVISOR
// ============================================================

const aiBuyRentAdvisor = async (req, res) => {
  try {
    const {
      buyPrice,
      rentPerDay,
      durationDays,
      maintenanceCost = 0,
      rentalDeposit = 0,
    } = req.body || {};

    const result = getBuyRentAdvice({
      buyPrice,
      rentPerDay,
      durationDays,
      maintenanceCost,
      rentalDeposit,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI Buy vs Rent Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI Buy vs Rent Advisor failed.",
    });
  }
};

const { findExchangeMatches } = require("../services/aiExchangeService");

// ============================================================
// AI EXCHANGE MATCHER
// ============================================================

const aiExchangeMatcher = async (req, res) => {
  try {
    const { productId, limit } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a product ID.",
      });
    }

    const result = await findExchangeMatches({
      productId,
      userId: req.user._id,
      limit,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI Exchange Matcher Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI exchange matching failed.",
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  aiSmartProductSearch,
  aiFairPricePrediction,
  aiBuyRentAdvisor,
  aiExchangeMatcher,
};
