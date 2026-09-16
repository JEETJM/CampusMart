const mongoose = require("mongoose");
const Product = require("../models/Product");

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      condition,
      listingType,
      images,
      location,
      locationCoordinates,
      college,
      rentalPricePerDay,
      rentalDeposit,
      minimumRentalDays,
      maximumRentalDays,
      rentalInstructions,
    } = req.body || {};

    // ----------------------------------------------------------
    // AUTHENTICATION
    // ----------------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------

    if (
      !title ||
      !description ||
      !category ||
      price === undefined ||
      price === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category and price are required.",
      });
    }

    // ----------------------------------------------------------
    // PRICE
    // ----------------------------------------------------------

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid product price.",
      });
    }

    // ----------------------------------------------------------
    // LOCATION COORDINATES
    // ----------------------------------------------------------

    let parsedCoordinates = null;

    if (locationCoordinates) {
      try {
        parsedCoordinates =
          typeof locationCoordinates === "string" ?
            JSON.parse(locationCoordinates)
          : locationCoordinates;

        if (
          parsedCoordinates &&
          parsedCoordinates.lat !== undefined &&
          parsedCoordinates.lng !== undefined
        ) {
          const lat = Number(parsedCoordinates.lat);

          const lng = Number(parsedCoordinates.lng);

          if (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
          ) {
            parsedCoordinates = {
              lat,
              lng,
            };
          } else {
            parsedCoordinates = null;
          }
        } else {
          parsedCoordinates = null;
        }
      } catch {
        parsedCoordinates = null;
      }
    }

    // ----------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------

    const product = await Product.create({
      title: String(title).trim(),

      description: String(description).trim(),

      category,

      price: numericPrice,

      condition: condition || "Good",

      listingType: listingType || "Sell",

      images: Array.isArray(images) ? images : [],

      location: location ? String(location).trim() : "",

      locationCoordinates: parsedCoordinates,

      seller: req.user._id,

      college: college || req.user.college || "Narula Institute of Technology",

      isAvailable: true,

      rentalPricePerDay: Number(rentalPricePerDay) || 0,

      rentalDeposit: Number(rentalDeposit) || 0,

      minimumRentalDays: Number(minimumRentalDays) || 1,

      maximumRentalDays: Number(maximumRentalDays) || 30,

      rentalInstructions:
        rentalInstructions ? String(rentalInstructions).trim() : "",
    });

    // ----------------------------------------------------------
    // POPULATE SELLER
    // ----------------------------------------------------------

    await product.populate(
      "seller",
      "name email studentId college isVerified isActive",
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create product.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category,
      condition,
      listingType,
      minPrice,
      maxPrice,
      sort = "newest",
    } = req.query || {};

    const currentPage = Math.max(Number(page) || 1, 1);

    const currentLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    // ----------------------------------------------------------
    // FILTER
    // ----------------------------------------------------------

    const filter = {
      isAvailable: true,
    };

    const cleanSearch = String(search || "").trim();

    if (cleanSearch) {
      filter.$or = [
        {
          title: {
            $regex: cleanSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: cleanSearch,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (listingType) {
      filter.listingType = listingType;
    }

    // ----------------------------------------------------------
    // PRICE FILTER
    // ----------------------------------------------------------

    const minimumPrice = Number(minPrice);

    const maximumPrice = Number(maxPrice);

    if (
      minPrice !== undefined &&
      minPrice !== "" &&
      Number.isFinite(minimumPrice)
    ) {
      filter.price = {
        ...(filter.price || {}),
        $gte: minimumPrice,
      };
    }

    if (
      maxPrice !== undefined &&
      maxPrice !== "" &&
      Number.isFinite(maximumPrice)
    ) {
      filter.price = {
        ...(filter.price || {}),
        $lte: maximumPrice,
      };
    }

    // ----------------------------------------------------------
    // SORT
    // ----------------------------------------------------------

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "price-low") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price-high") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "popular") {
      sortOption = {
        views: -1,
        wishlistCount: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        averageRating: -1,
      };
    }

    // ----------------------------------------------------------
    // FETCH
    // ----------------------------------------------------------

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("seller", "name email studentId college isVerified isActive")
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / currentLimit);

    return res.status(200).json({
      success: true,
      products,

      pagination: {
        currentPage,
        totalPages,
        totalProducts,
        limit: currentLimit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Product
|--------------------------------------------------------------------------
*/

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(id).populate(
      "seller",
      "name email studentId college isVerified isActive",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Increase views
    product.views = (product.views || 0) + 1;

    await product.save();

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch product.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get My Products
|--------------------------------------------------------------------------
*/

const getMyProducts = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const products = await Product.find({
      seller: req.user._id,
    })
      .populate("seller", "name email studentId college isVerified isActive")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get My Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your products.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Product - Seller
|--------------------------------------------------------------------------
*/

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product.",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

const adminGetProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      category = "",
      listingType = "",
      status = "",
      sort = "newest",
    } = req.query || {};

    const currentPage = Math.max(Number(page) || 1, 1);

    const currentLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const filter = {};

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    const cleanSearch = String(search || "").trim();

    if (cleanSearch) {
      filter.$or = [
        {
          title: {
            $regex: cleanSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: cleanSearch,
            $options: "i",
          },
        },
        {
          college: {
            $regex: cleanSearch,
            $options: "i",
          },
        },
      ];
    }

    // ----------------------------------------------------------
    // CATEGORY
    // ----------------------------------------------------------

    if (category) {
      filter.category = category;
    }

    // ----------------------------------------------------------
    // LISTING TYPE
    // ----------------------------------------------------------

    if (listingType) {
      filter.listingType = listingType;
    }

    // ----------------------------------------------------------
    // STATUS
    // ----------------------------------------------------------

    if (status === "available") {
      filter.isAvailable = true;
    }

    if (status === "unavailable") {
      filter.isAvailable = false;
    }

    // ----------------------------------------------------------
    // SORT
    // ----------------------------------------------------------

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "price-low") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price-high") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "popular") {
      sortOption = {
        views: -1,
        wishlistCount: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        averageRating: -1,
      };
    }

    // ----------------------------------------------------------
    // FETCH
    // ----------------------------------------------------------

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("seller", "name email studentId college isVerified isActive")
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / currentLimit);

    return res.status(200).json({
      success: true,
      products,

      pagination: {
        currentPage,
        totalPages,
        totalProducts,
        limit: currentLimit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Admin Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin products.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE PRODUCT AVAILABILITY
|--------------------------------------------------------------------------
*/

const adminUpdateProductAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const { isAvailable } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be true or false.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.isAvailable = isAvailable;

    await product.save();

    return res.status(200).json({
      success: true,
      message:
        isAvailable ?
          "Product activated successfully."
        : "Product hidden successfully.",

      product: {
        _id: product._id,
        title: product.title,
        isAvailable: product.isAvailable,
      },
    });
  } catch (error) {
    console.error("Admin Update Product Availability Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update product availability.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - DELETE PRODUCT
|--------------------------------------------------------------------------
*/

const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Admin Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  deleteProduct,

  // Admin
  adminGetProducts,
  adminUpdateProductAvailability,
  adminDeleteProduct,
};
