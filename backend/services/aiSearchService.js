const Product = require("../models/Product");

// ============================================================
// CAMPUSMART AI - SMART PRODUCT SEARCH
// ============================================================

const categoryKeywords = {
  Books: ["book", "books", "textbook", "reference", "novel", "study book"],

  Electronics: [
    "laptop",
    "computer",
    "pc",
    "phone",
    "mobile",
    "tablet",
    "calculator",
    "keyboard",
    "mouse",
    "monitor",
    "headphone",
    "earphone",
    "charger",
    "electronics",
    "smartwatch",
  ],

  Cycles: ["cycle", "bicycle", "bike"],

  Furniture: ["chair", "table", "desk", "bed", "furniture", "shelf", "almirah"],

  Clothing: [
    "shirt",
    "tshirt",
    "t-shirt",
    "pant",
    "jeans",
    "jacket",
    "dress",
    "clothing",
  ],

  Accessories: [
    "bag",
    "backpack",
    "watch",
    "wallet",
    "accessory",
    "accessories",
    "headphone",
    "earbuds",
  ],

  Sports: [
    "football",
    "cricket",
    "bat",
    "ball",
    "sports",
    "badminton",
    "racket",
    "gym",
  ],

  Notes: ["notes", "note", "handwritten", "study notes", "class notes"],
};

const listingKeywords = {
  Rent: ["rent", "rental", "renting", "borrow", "for rent"],

  Exchange: ["exchange", "swap", "trade"],

  Sell: ["buy", "purchase", "sale", "sell", "selling"],
};

// ============================================================
// EXTRACT CATEGORY
// ============================================================

function detectCategory(query) {
  const text = query.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return null;
}

// ============================================================
// EXTRACT LISTING TYPE
// ============================================================

function detectListingType(query) {
  const text = query.toLowerCase();

  if (listingKeywords.Exchange.some((keyword) => text.includes(keyword))) {
    return "Exchange";
  }

  if (listingKeywords.Rent.some((keyword) => text.includes(keyword))) {
    return "Rent";
  }

  if (listingKeywords.Sell.some((keyword) => text.includes(keyword))) {
    return "Sell";
  }

  return null;
}

// ============================================================
// EXTRACT MAXIMUM PRICE
// ============================================================

function detectMaxPrice(query) {
  const text = query.toLowerCase();

  const patterns = [
    /under\s*₹?\s*([\d,]+)/i,
    /below\s*₹?\s*([\d,]+)/i,
    /less than\s*₹?\s*([\d,]+)/i,
    /within\s*₹?\s*([\d,]+)/i,
    /upto\s*₹?\s*([\d,]+)/i,
    /up to\s*₹?\s*([\d,]+)/i,
    /budget\s*(?:of)?\s*₹?\s*([\d,]+)/i,
    /₹\s*([\d,]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const price = Number(match[1].replace(/,/g, ""));

      if (Number.isFinite(price)) {
        return price;
      }
    }
  }

  return null;
}

// ============================================================
// CLEAN SEARCH KEYWORDS
// ============================================================

function extractKeywords(query) {
  const stopWords = [
    "i",
    "need",
    "want",
    "looking",
    "for",
    "a",
    "an",
    "the",
    "under",
    "below",
    "less",
    "than",
    "within",
    "budget",
    "of",
    "up",
    "to",
    "buy",
    "purchase",
    "please",
    "me",
    "find",
    "show",
    "give",
    "some",
    "good",
    "best",
    "cheap",
    "available",
    "near",
    "campus",
  ];

  const words = query
    .toLowerCase()
    .replace(/[₹,]/g, " ")
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const keywords = words.filter(
    (word) => !stopWords.includes(word) && !/^\d+$/.test(word),
  );

  return keywords.slice(0, 8);
}

// ============================================================
// MAIN AI SEARCH FUNCTION
// ============================================================

const smartProductSearch = async (query, user) => {
  const cleanQuery = String(query || "").trim();

  if (!cleanQuery) {
    return {
      success: false,
      message: "Please enter what you are looking for.",
    };
  }

  const category = detectCategory(cleanQuery);

  const listingType = detectListingType(cleanQuery);

  const maxPrice = detectMaxPrice(cleanQuery);

  const keywords = extractKeywords(cleanQuery);

  // ========================================================
  // BUILD MONGODB FILTER
  // ========================================================

  const filter = {
    isAvailable: true,
  };

  if (category) {
    filter.category = category;
  }

  if (listingType) {
    filter.listingType = listingType;
  }

  if (maxPrice !== null) {
    filter.price = {
      $lte: maxPrice,
    };
  }

  // ========================================================
  // TEXT SEARCH
  // ========================================================

  if (keywords.length > 0) {
    const keywordRegex = keywords
      .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    filter.$or = [
      {
        title: {
          $regex: keywordRegex,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keywordRegex,
          $options: "i",
        },
      },
    ];
  }

  // ========================================================
  // FIND PRODUCTS
  // ========================================================

  let products = await Product.find(filter)
    .populate("seller", "name email studentId college isVerified")
    .sort({
      averageRating: -1,
      createdAt: -1,
    })
    .limit(20);

  // ========================================================
  // FALLBACK
  // ========================================================

  if (products.length === 0) {
    const fallbackFilter = {
      isAvailable: true,
    };

    if (category) {
      fallbackFilter.category = category;
    }

    if (listingType) {
      fallbackFilter.listingType = listingType;
    }

    if (maxPrice !== null) {
      fallbackFilter.price = {
        $lte: maxPrice,
      };
    }

    products = await Product.find(fallbackFilter)
      .populate("seller", "name email studentId college isVerified")
      .sort({
        averageRating: -1,
        createdAt: -1,
      })
      .limit(20);
  }

  // ========================================================
  // AI RESPONSE
  // ========================================================

  return {
    success: true,

    query: cleanQuery,

    interpretation: {
      category,
      listingType,
      maxPrice,
      keywords,
    },

    count: products.length,

    products,
  };
};

module.exports = {
  smartProductSearch,
};
