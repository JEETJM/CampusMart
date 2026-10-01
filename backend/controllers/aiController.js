const { smartProductSearch } = require("../services/aiSearchService");

const { getFairPricePrediction } = require("../services/aiPriceService");

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
// EXPORT
// ============================================================

module.exports = {
  aiSmartProductSearch,
  aiFairPricePrediction,
};
