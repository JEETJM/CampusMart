const Product = require("../models/Product");

// ==============================
// CREATE PRODUCT
// ==============================
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
    } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required product fields.",
      });
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      category,
      price,
      condition,
      listingType,
      images: images || [],
      location: location || "",
      seller: req.user.userId,
      college: "Narula Institute of Technology",
    });

    return res.status(201).json({
      success: true,
      message: "Product listed successfully.",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating product.",
    });
  }
};

// ==============================
// GET ALL PRODUCTS
// SEARCH + FILTER + PAGINATION
// ==============================
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      condition = "",
      listingType = "",
      minPrice = "",
      maxPrice = "",
      sort = "newest",
    } = req.query;

    // ==============================
    // PAGINATION
    // ==============================
    const currentPage = Math.max(parseInt(page) || 1, 1);

    const productsPerPage = Math.min(Math.max(parseInt(limit) || 12, 1), 50);

    const skip = (currentPage - 1) * productsPerPage;

    // ==============================
    // BASE FILTER
    // ==============================
    const filter = {
      isAvailable: true,
    };

    // ==============================
    // SEARCH
    // ==============================
    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          category: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // ==============================
    // CATEGORY FILTER
    // ==============================
    if (category.trim()) {
      filter.category = category.trim();
    }

    // ==============================
    // CONDITION FILTER
    // ==============================
    if (condition.trim()) {
      filter.condition = condition.trim();
    }

    // ==============================
    // LISTING TYPE FILTER
    // ==============================
    if (listingType.trim()) {
      filter.listingType = listingType.trim();
    }

    // ==============================
    // PRICE FILTER
    // ==============================
    if (minPrice !== "" || maxPrice !== "") {
      filter.price = {};

      if (minPrice !== "") {
        const minimum = Number(minPrice);

        if (!Number.isNaN(minimum)) {
          filter.price.$gte = minimum;
        }
      }

      if (maxPrice !== "") {
        const maximum = Number(maxPrice);

        if (!Number.isNaN(maximum)) {
          filter.price.$lte = maximum;
        }
      }

      // Remove empty price object
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    // ==============================
    // SORTING
    // ==============================
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
      };
    }

    // ==============================
    // FETCH PRODUCTS
    // ==============================
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("seller", "name email studentId college isVerified")
        .sort(sortOption)
        .skip(skip)
        .limit(productsPerPage),

      Product.countDocuments(filter),
    ]);

    // ==============================
    // PAGINATION INFO
    // ==============================
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return res.status(200).json({
      success: true,

      count: products.length,

      products,

      pagination: {
        totalProducts,
        totalPages,
        currentPage,
        productsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching products.",
    });
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email studentId college isVerified",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.views += 1;
    await product.save();

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching product.",
    });
  }
};

// ==============================
// GET MY PRODUCTS
// ==============================
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get My Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching your products.",
    });
  }
};

// ==============================
// DELETE PRODUCT
// ==============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.seller.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products.",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting product.",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  deleteProduct,
};
