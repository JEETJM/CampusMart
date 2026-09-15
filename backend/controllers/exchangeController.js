const ExchangeOffer = require("../models/ExchangeOffer");
const Product = require("../models/Product");

// =====================================================
// COMMON POPULATE
// =====================================================

const populateOffer = (query) => {
  return query
    .populate(
      "product",
      "title images price condition listingType isAvailable seller",
    )
    .populate(
      "offeredProduct",
      "title images price condition listingType isAvailable seller",
    )
    .populate(
      "counterProduct",
      "title images price condition listingType isAvailable seller",
    )
    .populate("buyer", "name email studentId college")
    .populate("seller", "name email studentId college");
};

// =====================================================
// GET SELLER'S AVAILABLE PRODUCTS FOR COUNTER OFFER
// =====================================================

const getMyExchangeProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
      isAvailable: true,
    })
      .select("title images price condition listingType isAvailable seller")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Exchange Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your available products.",
    });
  }
};

// =====================================================
// CREATE EXCHANGE OFFER
// =====================================================

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

    // Prevent same pending offer
    const existingOffer = await ExchangeOffer.findOne({
      product: productId,
      offeredProduct: offeredProductId,
      buyer: buyerId,
      status: {
        $in: ["Pending", "Countered"],
      },
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "You already have an active offer for this exchange.",
      });
    }

    const offer = await ExchangeOffer.create({
      product: productId,
      offeredProduct: offeredProductId,
      buyer: buyerId,
      seller: targetProduct.seller,
      message: message || "",
      status: "Pending",
    });

    const populatedOffer = await populateOffer(
      ExchangeOffer.findById(offer._id),
    );

    return res.status(201).json({
      success: true,
      message: "Exchange offer sent successfully.",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Create Exchange Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create exchange offer.",
    });
  }
};

// =====================================================
// BUYER: MY OFFERS
// =====================================================

const getMyExchangeOffers = async (req, res) => {
  try {
    const offers = await populateOffer(
      ExchangeOffer.find({
        buyer: req.user._id,
      }).sort({ createdAt: -1 }),
    );

    return res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Get My Exchange Offers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch exchange offers.",
    });
  }
};

// =====================================================
// SELLER: RECEIVED OFFERS
// =====================================================

const getReceivedExchangeOffers = async (req, res) => {
  try {
    const offers = await populateOffer(
      ExchangeOffer.find({
        seller: req.user._id,
      }).sort({ createdAt: -1 }),
    );

    return res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Get Received Exchange Offers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch received exchange offers.",
    });
  }
};

// =====================================================
// ACCEPT DIRECT OFFER
// =====================================================

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

    const targetProduct = await Product.findById(offer.product);

    const offeredProduct = await Product.findById(offer.offeredProduct);

    if (!targetProduct || !offeredProduct) {
      return res.status(404).json({
        success: false,
        message: "Exchange products not found.",
      });
    }

    if (!targetProduct.isAvailable || !offeredProduct.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "One or more products are no longer available.",
      });
    }

    // Lock both products
    targetProduct.isAvailable = false;
    offeredProduct.isAvailable = false;

    await targetProduct.save();
    await offeredProduct.save();

    // Accept selected offer
    offer.status = "Accepted";
    offer.respondedAt = new Date();

    await offer.save();

    // Reject competing active offers
    await ExchangeOffer.updateMany(
      {
        _id: { $ne: offer._id },
        status: {
          $in: ["Pending", "Countered"],
        },
        $or: [
          {
            product: offer.product,
          },
          {
            offeredProduct: offer.offeredProduct,
          },
          {
            counterProduct: offer.product,
          },
          {
            counterProduct: offer.offeredProduct,
          },
        ],
      },
      {
        $set: {
          status: "Rejected",
          respondedAt: new Date(),
        },
      },
    );

    const populatedOffer = await populateOffer(
      ExchangeOffer.findById(offer._id),
    );

    return res.status(200).json({
      success: true,
      message: "Exchange accepted. Both products are now reserved.",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Accept Exchange Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to accept exchange offer.",
    });
  }
};

// =====================================================
// SELLER COUNTER OFFER
// =====================================================

const counterExchangeOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const { counterProductId, message } = req.body;

    if (!counterProductId) {
      return res.status(400).json({
        success: false,
        message: "Please select a product for the counter offer.",
      });
    }

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
        message: "Only pending offers can be countered.",
      });
    }

    const counterProduct = await Product.findById(counterProductId);

    if (!counterProduct) {
      return res.status(404).json({
        success: false,
        message: "Counter product was not found.",
      });
    }

    if (counterProduct.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Counter product must belong to you.",
      });
    }

    if (!counterProduct.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Counter product is no longer available.",
      });
    }

    if (counterProduct._id.toString() === offer.product.toString()) {
      return res.status(400).json({
        success: false,
        message: "Counter product cannot be the same product.",
      });
    }

    offer.counterProduct = counterProduct._id;
    offer.counterMessage = message || "";
    offer.status = "Countered";
    offer.counteredAt = new Date();

    await offer.save();

    const populatedOffer = await populateOffer(
      ExchangeOffer.findById(offer._id),
    );

    return res.status(200).json({
      success: true,
      message: "Counter offer sent successfully.",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Counter Exchange Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send counter offer.",
    });
  }
};

// =====================================================
// BUYER ACCEPTS COUNTER OFFER
// =====================================================

const acceptCounterExchangeOffer = async (req, res) => {
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

    if (offer.status !== "Countered") {
      return res.status(400).json({
        success: false,
        message: "Only countered offers can be accepted.",
      });
    }

    if (!offer.counterProduct) {
      return res.status(400).json({
        success: false,
        message: "Counter product is missing.",
      });
    }

    const targetProduct = await Product.findById(offer.product);

    const offeredProduct = await Product.findById(offer.offeredProduct);

    const counterProduct = await Product.findById(offer.counterProduct);

    if (!targetProduct || !offeredProduct || !counterProduct) {
      return res.status(404).json({
        success: false,
        message: "One or more exchange products were not found.",
      });
    }

    if (
      !targetProduct.isAvailable ||
      !offeredProduct.isAvailable ||
      !counterProduct.isAvailable
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more products are no longer available.",
      });
    }

    targetProduct.isAvailable = false;
    counterProduct.isAvailable = false;

    await targetProduct.save();
    await counterProduct.save();

    // Original offered product is not used after counter acceptance
    // so it remains available.

    offer.status = "Accepted";
    offer.respondedAt = new Date();

    await offer.save();

    // Reject other competing offers
    await ExchangeOffer.updateMany(
      {
        _id: { $ne: offer._id },
        status: {
          $in: ["Pending", "Countered"],
        },
        $or: [
          {
            product: offer.product,
          },
          {
            counterProduct: offer.product,
          },
          {
            product: offer.counterProduct,
          },
          {
            counterProduct: offer.counterProduct,
          },
        ],
      },
      {
        $set: {
          status: "Rejected",
          respondedAt: new Date(),
        },
      },
    );

    const populatedOffer = await populateOffer(
      ExchangeOffer.findById(offer._id),
    );

    return res.status(200).json({
      success: true,
      message: "Counter offer accepted. Exchange products are now reserved.",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Accept Counter Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to accept counter offer.",
    });
  }
};

// =====================================================
// BUYER REJECTS COUNTER OFFER
// =====================================================

const rejectCounterExchangeOffer = async (req, res) => {
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

    if (offer.status !== "Countered") {
      return res.status(400).json({
        success: false,
        message: "Only countered offers can be rejected.",
      });
    }

    offer.status = "Rejected";
    offer.respondedAt = new Date();

    await offer.save();

    const populatedOffer = await populateOffer(
      ExchangeOffer.findById(offer._id),
    );

    return res.status(200).json({
      success: true,
      message: "Counter offer rejected.",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Reject Counter Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject counter offer.",
    });
  }
};

// =====================================================
// SELLER REJECTS ORIGINAL OFFER
// =====================================================

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
    offer.respondedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Exchange offer rejected.",
      offer,
    });
  } catch (error) {
    console.error("Reject Exchange Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject offer.",
    });
  }
};

// =====================================================
// BUYER CANCELS OFFER
// =====================================================

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

    if (!["Pending", "Countered"].includes(offer.status)) {
      return res.status(400).json({
        success: false,
        message: "Only active offers can be cancelled.",
      });
    }

    offer.status = "Cancelled";
    offer.respondedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Exchange offer cancelled.",
      offer,
    });
  } catch (error) {
    console.error("Cancel Exchange Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel offer.",
    });
  }
};

module.exports = {
  getMyExchangeProducts,
  createExchangeOffer,
  getMyExchangeOffers,
  getReceivedExchangeOffers,
  acceptExchangeOffer,
  counterExchangeOffer,
  acceptCounterExchangeOffer,
  rejectCounterExchangeOffer,
  rejectExchangeOffer,
  cancelExchangeOffer,
};
