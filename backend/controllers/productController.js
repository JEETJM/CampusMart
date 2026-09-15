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
      college,
    } = req.body || {};

    /*
    |--------------------------------------------------------------------------
    | Check authenticated user
    |--------------------------------------------------------------------------
    */

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Required fields
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Validate price
    |--------------------------------------------------------------------------
    */

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid product price.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Product
    |--------------------------------------------------------------------------
    */

    const product = await Product.create({
      title: String(title).trim(),

      description: String(description).trim(),

      category,

      price: numericPrice,

      condition: condition || "Good",

      listingType: listingType || "Sell",

      images: Array.isArray(images) ? images : [],

      location: location ? String(location).trim() : "",

      seller: req.user._id,

      college: college || req.user.college || "Narula Institute of Technology",

      isAvailable: true,
    });

    /*
    |--------------------------------------------------------------------------
    | Populate seller
    |--------------------------------------------------------------------------
    */

    await product.populate("seller", "name email studentId college isVerified");

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

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Price Filter
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Fetch Products
    |--------------------------------------------------------------------------
    */

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("seller", "name email studentId college isVerified")
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

    const product = await Product.findById(id).populate(
      "seller",
      "name email studentId college isVerified",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Increase views
    |--------------------------------------------------------------------------
    */

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
      .populate("seller", "name email studentId college isVerified")
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
| Delete Product
|--------------------------------------------------------------------------
*/

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find Product
    |--------------------------------------------------------------------------
    */

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Only Seller Can Delete
    |--------------------------------------------------------------------------
    */

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

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
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  deleteProduct,
};
