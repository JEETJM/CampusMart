const ExchangeOffer = require("../models/ExchangeOffer");
const Product = require("../models/Product");

// Send exchange offer
const createExchangeOffer = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const { productId, offeredProductId, message } = req.body;

    if (!productId || !offeredProductId) {
      return res.status(400).json({
        success: false,
        message: "Product and offered product are required.",
      });
    }

    const targetProduct = await Product.findById(productId);

    if (!targetProduct) {
      return res.status(404).json({
        success: false,
        message: "Exchange product not found.",
      });
    }

    if (!targetProduct.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This product is no longer available.",
      });
    }

    if (targetProduct.listingType !== "Exchange") {
      return res.status(400).json({
        success: false,
        message: "This product is not available for exchange.",
      });
    }

    const offeredProduct = await Product.findById(offeredProductId);

    if (!offeredProduct) {
      return res.status(404).json({
        success: false,
        message: "Your offered product was not found.",
      });
    }

    if (offeredProduct.seller.toString() !== buyerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only offer your own product.",
      });
    }

    if (targetProduct.seller.toString() === buyerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot exchange with your own product.",
      });
    }

    if (!offeredProduct.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Your offered product is not available.",
      });
    }

    // Prevent duplicate pending offers
    const existingOffer = await ExchangeOffer.findOne({
      product: productId,
      offeredProduct: offeredProductId,
      buyer: buyerId,
      status: "Pending",
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending offer for this product.",
      });
    }

    const offer = await ExchangeOffer.create({
      product: productId,
      offeredProduct: offeredProductId,
      buyer: buyerId,
      seller: targetProduct.seller,
      message: message || "",
    });

    const populatedOffer = await ExchangeOffer.findById(offer._id)
      .populate("product", "title images price condition")
      .populate("offeredProduct", "title images price condition")
      .populate("buyer", "name email studentId college")
      .populate("seller", "name email studentId college");

    res.status(201).json({
      success: true,
      message: "Exchange offer sent successfully.",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Create Exchange Offer Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create exchange offer.",
    });
  }
};

// Buyer offers
const getMyExchangeOffers = async (req, res) => {
  try {
    const offers = await ExchangeOffer.find({
      buyer: req.user._id,
    })
      .populate("product", "title images price condition listingType")
      .populate("offeredProduct", "title images price condition")
      .populate("seller", "name email studentId college")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Get My Exchange Offers Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch exchange offers.",
    });
  }
};

// Seller received offers
const getReceivedExchangeOffers = async (req, res) => {
  try {
    const offers = await ExchangeOffer.find({
      seller: req.user._id,
    })
      .populate("product", "title images price condition listingType")
      .populate("offeredProduct", "title images price condition")
      .populate("buyer", "name email studentId college")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Get Received Exchange Offers Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch received exchange offers.",
    });
  }
};

// Seller accepts offer
const acceptExchangeOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await ExchangeOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Exchange offer not found.",
      });
    }

    if (offer.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (offer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending offers can be accepted.",
      });
    }

    offer.status = "Accepted";

    await offer.save();

    res.status(200).json({
      success: true,
      message: "Exchange offer accepted.",
      offer,
    });
  } catch (error) {
    console.error("Accept Exchange Offer Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to accept offer.",
    });
  }
};

// Seller rejects offer
const rejectExchangeOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await ExchangeOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Exchange offer not found.",
      });
    }

    if (offer.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (offer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending offers can be rejected.",
      });
    }

    offer.status = "Rejected";

    await offer.save();

    res.status(200).json({
      success: true,
      message: "Exchange offer rejected.",
      offer,
    });
  } catch (error) {
    console.error("Reject Exchange Offer Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reject offer.",
    });
  }
};

// Buyer cancels own offer
const cancelExchangeOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await ExchangeOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Exchange offer not found.",
      });
    }

    if (offer.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (offer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending offers can be cancelled.",
      });
    }

    offer.status = "Cancelled";

    await offer.save();

    res.status(200).json({
      success: true,
      message: "Exchange offer cancelled.",
      offer,
    });
  } catch (error) {
    console.error("Cancel Exchange Offer Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to cancel offer.",
    });
  }
};

module.exports = {
  createExchangeOffer,
  getMyExchangeOffers,
  getReceivedExchangeOffers,
  acceptExchangeOffer,
  rejectExchangeOffer,
  cancelExchangeOffer,
};
