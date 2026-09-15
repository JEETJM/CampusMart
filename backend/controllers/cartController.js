const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==========================================
// GET CART
// ==========================================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      populate: {
        path: "seller",
        select: "name email studentId isVerified",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });

      cart = await Cart.findById(cart._id).populate({
        path: "items.product",
        populate: {
          path: "seller",
          select: "name email studentId isVerified",
        },
      });
    }

    const validItems = cart.items.filter(
      (item) => item.product && item.product.isAvailable,
    );

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    let subtotal = 0;

    cart.items.forEach((item) => {
      if (item.product) {
        subtotal +=
          Number(item.product.price || 0) * Number(item.quantity || 1);
      }
    });

    res.json({
      success: true,
      cart,
      subtotal,
      itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch cart.",
    });
  }
};

// ==========================================
// ADD TO CART
// ==========================================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

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

    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable.",
      });
    }

    // Prevent buying own listing
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot add your own product to cart.",
      });
    }

    const parsedQuantity = Math.max(1, Number(quantity) || 1);

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: parsedQuantity,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "title price images condition category listingType isAvailable seller location",
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart.",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add product to cart.",
    });
  }
};

// ==========================================
// UPDATE QUANTITY
// ==========================================
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart.",
      });
    }

    item.quantity = parsedQuantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "title price images condition category listingType isAvailable seller location",
    });

    res.json({
      success: true,
      message: "Cart updated.",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update cart.",
    });
  }
};

// ==========================================
// REMOVE FROM CART
// ==========================================
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart.",
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "title price images condition category listingType isAvailable seller location",
    });

    res.json({
      success: true,
      message: "Product removed from cart.",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove product from cart.",
    });
  }
};

// ==========================================
// CLEAR CART
// ==========================================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart is already empty.",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared.",
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to clear cart.",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
