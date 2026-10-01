const Product = require("../models/Product");

const conditionMultiplier = {
  New: 1,
  "Like New": 0.9,
  Good: 0.78,
  Fair: 0.62,
};

const categoryMultiplier = {
  Books: 0.55,
  Electronics: 0.72,
  Cycles: 0.7,
  Furniture: 0.65,
  Clothing: 0.5,
  Accessories: 0.55,
  Sports: 0.6,
  Notes: 0.4,
  Other: 0.6,
};

const roundPrice = (price) => {
  if (price < 1000) {
    return Math.round(price / 50) * 50;
  }

  if (price < 10000) {
    return Math.round(price / 100) * 100;
  }

  return Math.round(price / 500) * 500;
};

const getFairPricePrediction = async ({
  title,
  category,
  condition,
  price,
  description = "",
}) => {
  const currentPrice = Number(price);

  if (!title || !category || !condition || !Number.isFinite(currentPrice)) {
    return {
      success: false,
      message: "Title, category, condition and price are required.",
    };
  }

  if (currentPrice <= 0) {
    return {
      success: false,
      message: "Price must be greater than 0.",
    };
  }

  /*
   * Base estimation
   * ----------------
   * The current listing price is adjusted according to:
   * 1. Product condition
   * 2. Product category
   * 3. Existing CampusMart listings
   */

  const conditionFactor = conditionMultiplier[condition] || 0.7;
  const categoryFactor = categoryMultiplier[category] || 0.6;

  let estimatedPrice =
    currentPrice * (0.55 + conditionFactor * 0.25 + categoryFactor * 0.2);

  /*
   * Find similar products from CampusMart.
   */
  const similarProducts = await Product.find({
    category,
    isAvailable: true,
    price: {
      $gt: currentPrice * 0.4,
      $lt: currentPrice * 1.6,
    },
  })
    .select("title price condition category")
    .limit(30)
    .lean();

  let marketAverage = null;

  if (similarProducts.length > 0) {
    const total = similarProducts.reduce(
      (sum, product) => sum + Number(product.price || 0),
      0,
    );

    marketAverage = total / similarProducts.length;

    /*
     * Combine our estimation with the current CampusMart
     * market average.
     */
    estimatedPrice = estimatedPrice * 0.6 + marketAverage * 0.4;
  }

  /*
   * Small description/title adjustment.
   * More detailed listings generally provide better information
   * for price estimation.
   */
  const informationScore =
    String(title).length >= 15 && String(description).length >= 80 ? 1.03 : 1;

  estimatedPrice *= informationScore;

  const fairPrice = roundPrice(estimatedPrice);

  /*
   * Generate a reasonable price range.
   */
  const lowerPrice = roundPrice(fairPrice * 0.92);
  const upperPrice = roundPrice(fairPrice * 1.08);

  let status = "Fair Price";
  let suggestion = "Your price is within a reasonable range for this product.";

  const difference = ((currentPrice - fairPrice) / fairPrice) * 100;

  if (difference >= 15) {
    status = "High";
    suggestion =
      "Consider reducing the price to make this listing more competitive.";
  } else if (difference >= 5) {
    status = "Slightly High";
    suggestion = "Your price is slightly above the estimated fair price.";
  } else if (difference <= -15) {
    status = "Very Competitive";
    suggestion =
      "Your price is below the estimated market value and may attract buyers quickly.";
  } else if (difference <= -5) {
    status = "Competitive";
    suggestion = "Your price is slightly below the estimated fair price.";
  }

  return {
    success: true,

    prediction: {
      fairPrice,
      priceRange: {
        min: lowerPrice,
        max: upperPrice,
      },

      currentPrice,

      status,

      differencePercentage: Number(Math.abs(difference).toFixed(1)),

      marketAverage: marketAverage ? roundPrice(marketAverage) : null,

      similarProductsCount: similarProducts.length,

      suggestion,
    },
  };
};

module.exports = {
  getFairPricePrediction,
};
