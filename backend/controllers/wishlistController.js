const Wishlist = require("../models/Wishlist");
const Product = require("../models/product");

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      populate: {
        path: "seller",
        select: "name email studentId college",
      },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [],
      });
    }

    const validItems = wishlist.items.filter((item) => item.product);

    if (validItems.length !== wishlist.items.length) {
      wishlist.items = validItems;
      await wishlist.save();
    }

    res.json({
      success: true,
      wishlist,
      itemCount: validItems.length,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load wishlist.",
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [],
      });
    }

    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId.toString(),
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your wishlist.",
      });
    }

    wishlist.items.push({
      product: productId,
    });

    await wishlist.save();

    await Product.findByIdAndUpdate(productId, {
      $inc: {
        wishlistCount: 1,
      },
    });

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "items.product",
    );

    res.status(201).json({
      success: true,
      message: "Product added to wishlist.",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add product to wishlist.",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found.",
      });
    }

    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === productId.toString(),
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your wishlist.",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId.toString(),
    );

    await wishlist.save();

    await Product.findByIdAndUpdate(productId, {
      $inc: {
        wishlistCount: -1,
      },
    });

    res.json({
      success: true,
      message: "Product removed from wishlist.",
      wishlist,
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove product from wishlist.",
    });
  }
};

const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.json({
        success: true,
        isWishlisted: false,
      });
    }

    const isWishlisted = wishlist.items.some(
      (item) => item.product.toString() === productId.toString(),
    );

    res.json({
      success: true,
      isWishlisted,
    });
  } catch (error) {
    console.error("Check Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to check wishlist.",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};
