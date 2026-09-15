import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  User,
  X,
  XCircle,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import ProductReviews from "../components/ProductReviews";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =========================================================
     PRODUCT
  ========================================================= */

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  /* =========================================================
     WISHLIST
  ========================================================= */

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  /* =========================================================
     COMMON MESSAGE
  ========================================================= */

  const [cartMessage, setCartMessage] = useState("");

  /* =========================================================
     REPORT PRODUCT
  ========================================================= */

  const [showReportModal, setShowReportModal] = useState(false);

  const [reportReason, setReportReason] = useState("");

  const [reportDescription, setReportDescription] = useState("");

  const [reportLoading, setReportLoading] = useState(false);

  const [reportError, setReportError] = useState("");

  const [reportSuccess, setReportSuccess] = useState("");

  /* =========================================================
     EXCHANGE
  ========================================================= */

  const [showExchangeModal, setShowExchangeModal] = useState(false);

  const [myProducts, setMyProducts] = useState([]);

  const [selectedOfferProduct, setSelectedOfferProduct] = useState("");

  const [exchangeMessage, setExchangeMessage] = useState("");

  const [exchangeLoading, setExchangeLoading] = useState(false);

  const [exchangeError, setExchangeError] = useState("");

  const [exchangeSuccess, setExchangeSuccess] = useState("");

  /* =========================================================
     RENTAL
  ========================================================= */

  const [rentalStartDate, setRentalStartDate] = useState("");

  const [rentalEndDate, setRentalEndDate] = useState("");

  const [rentalMessage, setRentalMessage] = useState("");

  const [rentalLoading, setRentalLoading] = useState(false);

  const [rentalError, setRentalError] = useState("");

  const [rentalSuccess, setRentalSuccess] = useState("");

  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [rentalAvailability, setRentalAvailability] = useState(null);

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("campusmart_theme") || "light";

    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add(savedTheme);
  }, []);

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data?.product || null);

        setSelectedImage(0);
      } catch (error) {
        console.error("Product Details Error:", error);

        setError(error.response?.data?.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================================================
     CHECK WISHLIST
  ========================================================= */

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("campusmart_token");

      if (!token || !id) {
        return;
      }

      try {
        const response = await api.get(`/wishlist/check/${id}`);

        setIsWishlisted(response.data?.isWishlisted || false);
      } catch (error) {
        console.error("Wishlist Check Error:", error);
      }
    };

    checkWishlist();
  }, [id]);

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
        },
      });

      return;
    }

    try {
      setCartMessage("Adding to cart...");

      await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      setCartMessage("Added to cart successfully.");
    } catch (error) {
      console.error("Add To Cart Error:", error);

      setCartMessage(
        error.response?.data?.message || "Unable to add product to cart.",
      );
    }
  };

  /* =========================================================
     CHAT WITH SELLER
  ========================================================= */

  const handleChatWithSeller = async () => {
    if (!product) return;

    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
        },
      });

      return;
    }

    try {
      setCartMessage("Opening chat...");

      const response = await api.post("/chat/conversations", {
        productId: product._id,
      });

      const conversation = response.data?.conversation;

      if (conversation?._id) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Create Conversation Error:", error);

      setCartMessage(error.response?.data?.message || "Unable to start chat.");
    }
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const handleWishlist = async () => {
    if (!product) return;

    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
        },
      });

      return;
    }

    try {
      setWishlistLoading(true);
      setCartMessage("");

      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);

        setIsWishlisted(false);

        setCartMessage("Removed from wishlist.");
      } else {
        await api.post("/wishlist", {
          productId: product._id,
        });

        setIsWishlisted(true);

        setCartMessage("Added to wishlist.");
      }
    } catch (error) {
      console.error("Wishlist Error:", error);

      setCartMessage(
        error.response?.data?.message || "Unable to update wishlist.",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  /* =========================================================
     OPEN REPORT MODAL
  ========================================================= */

  const openReportModal = () => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
        },
      });

      return;
    }

    if (!product) {
      return;
    }

    setReportReason("");
    setReportDescription("");
    setReportError("");
    setReportSuccess("");
    setShowReportModal(true);
  };

  /* =========================================================
     SUBMIT REPORT
  ========================================================= */

  const handleReportProduct = async (event) => {
    event.preventDefault();

    if (!product?._id) {
      return;
    }

    if (!reportReason) {
      setReportError("Please select a reason for reporting this product.");

      return;
    }

    try {
      setReportLoading(true);
      setReportError("");
      setReportSuccess("");

      const response = await api.post("/reports", {
        type: "Product",
        productId: product._id,
        reason: reportReason,
        description: reportDescription.trim(),
      });

      setReportSuccess(
        response.data?.message || "Report submitted successfully.",
      );

      setReportReason("");
      setReportDescription("");

      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess("");
      }, 1400);
    } catch (error) {
      console.error("Report Product Error:", error);

      setReportError(
        error.response?.data?.message || "Unable to submit report.",
      );
    } finally {
      setReportLoading(false);
    }
  };

  /* =========================================================
     OPEN EXCHANGE MODAL
  ========================================================= */

  const openExchangeModal = async () => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
        },
      });

      return;
    }

    if (product?.listingType !== "Exchange") {
      return;
    }

    try {
      setShowExchangeModal(true);

      setExchangeError("");
      setExchangeSuccess("");
      setSelectedOfferProduct("");
      setExchangeMessage("");

      const response = await api.get("/products/my/listings");

      const products = response.data?.products || [];

      const availableProducts = products.filter(
        (item) => item._id !== product._id && item.isAvailable !== false,
      );

      setMyProducts(availableProducts);
    } catch (error) {
      console.error("My Products Error:", error);

      setExchangeError(
        error.response?.data?.message || "Unable to load your products.",
      );
    }
  };

  /* =========================================================
     SEND EXCHANGE OFFER
  ========================================================= */

  const handleSendExchangeOffer = async () => {
    if (!selectedOfferProduct) {
      setExchangeError("Please select a product to offer.");

      return;
    }

    try {
      setExchangeLoading(true);

      setExchangeError("");
      setExchangeSuccess("");

      await api.post("/exchange", {
        productId: product._id,
        offeredProductId: selectedOfferProduct,
        message: exchangeMessage.trim(),
      });

      setExchangeSuccess("Exchange offer sent successfully.");

      setExchangeMessage("");
      setSelectedOfferProduct("");

      setTimeout(() => {
        setShowExchangeModal(false);

        setExchangeSuccess("");
      }, 1200);
    } catch (error) {
      console.error("Send Exchange Offer Error:", error);

      setExchangeError(
        error.response?.data?.message || "Unable to send exchange offer.",
      );
    } finally {
      setExchangeLoading(false);
    }
  };

  /* =========================================================
     RENTAL DAYS
  ========================================================= */

  const rentalDays =
    rentalStartDate && rentalEndDate ?
      Math.ceil(
        (new Date(rentalEndDate) - new Date(rentalStartDate)) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const dailyRate = Number(product?.dailyRate || product?.rentalPrice || 0);

  const depositAmount = Number(
    product?.depositAmount || product?.rentalDeposit || 0,
  );

  const rentalAmount = rentalDays > 0 ? rentalDays * dailyRate : 0;

  const rentalTotal = rentalAmount + depositAmount;

  /* =========================================================
     CHECK RENTAL AVAILABILITY
  ========================================================= */

  const checkRentalAvailability = async () => {
    if (!rentalStartDate || !rentalEndDate) {
      setRentalError("Please select start and end dates.");

      return;
    }

    if (rentalDays <= 0) {
      setRentalError("End date must be after start date.");

      return;
    }

    try {
      setAvailabilityLoading(true);

      setRentalError("");

      const response = await api.get(`/rentals/availability/${product._id}`, {
        params: {
          startDate: rentalStartDate,
          endDate: rentalEndDate,
        },
      });

      const available =
        response.data?.available ?? response.data?.isAvailable ?? false;

      setRentalAvailability(available);

      if (!available) {
        setRentalError("This product is not available for the selected dates.");
      }
    } catch (error) {
      console.error("Rental Availability Error:", error);

      setRentalAvailability(false);

      setRentalError(
        error.response?.data?.message || "Unable to check rental availability.",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  /* =========================================================
     CREATE RENTAL REQUEST
  ========================================================= */

  const handleRentNow = async () => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
        },
      });

      return;
    }

    if (!rentalStartDate || !rentalEndDate) {
      setRentalError("Please select rental dates.");

      return;
    }

    if (rentalDays <= 0) {
      setRentalError("End date must be after start date.");

      return;
    }

    try {
      setRentalLoading(true);
      setRentalError("");
      setRentalSuccess("");

      const availability = await api.get(
        `/rentals/availability/${product._id}`,
        {
          params: {
            startDate: rentalStartDate,
            endDate: rentalEndDate,
          },
        },
      );

      const isAvailable =
        availability.data?.available ?? availability.data?.isAvailable ?? false;

      if (!isAvailable) {
        setRentalAvailability(false);

        setRentalError("This product is not available for the selected dates.");

        return;
      }

      setRentalAvailability(true);

      await api.post("/rentals", {
        productId: product._id,
        startDate: rentalStartDate,
        endDate: rentalEndDate,
        renterMessage: rentalMessage.trim(),
        pickupLocation: product.location || "",
      });

      setRentalSuccess("Rental request sent successfully.");

      setRentalMessage("");
    } catch (error) {
      console.error("Create Rental Error:", error);

      setRentalError(
        error.response?.data?.message || "Unable to create rental request.",
      );
    } finally {
      setRentalLoading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#070d18]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-5">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="h-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#070d18]">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
            <XCircle size={32} className="text-red-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
            Product not found
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {error || "This product may have been removed."}
          </p>

          <Link
            to="/marketplace"
            className="mt-7 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     IMAGES
  ========================================================= */

  const images =
    product.images?.length > 0 ?
      product.images
    : [
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80",
      ];

  const sellerName = product.seller?.name || "Campus Seller";

  const sellerInitial = sellerName.charAt(0).toUpperCase();

  const isRental =
    product.listingType === "Rent" || product.listingType === "Rental";

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* =================================================
            BREADCRUMB
        ================================================== */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/marketplace"
            className="transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            Marketplace
          </Link>

          <span>/</span>

          <span>{product.category}</span>

          <span>/</span>

          <span className="font-medium text-slate-700 dark:text-slate-300">
            {product.title}
          </span>
        </div>

        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* =================================================
            MAIN PRODUCT
        ================================================== */}

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* =================================================
              IMAGES
          ================================================== */}

          <div>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80";
                  }}
                />
              </div>

              {/* LISTING TYPE */}

              <div className="absolute left-5 top-5 rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-900/95 dark:text-slate-200">
                {product.listingType}
              </div>

              {/* WISHLIST */}

              <button
                type="button"
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900/95"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted ?
                      "fill-red-500 text-red-500"
                    : "text-slate-700 dark:text-slate-200"
                  }
                />
              </button>
            </div>

            {/* THUMBNAILS */}

            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                    selectedImage === index ? "border-blue-600" : (
                      "border-slate-200 dark:border-slate-700"
                    )
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              PRODUCT INFO
          ================================================== */}

          <div>
            {/* BADGES */}

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                {product.category}
              </span>

              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {product.condition}
              </span>

              {product.seller?.isVerified && (
                <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <BadgeCheck size={14} />
                  Verified Seller
                </span>
              )}
            </div>

            {/* TITLE */}

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {product.title}
            </h1>

            {/* =================================================
                PRODUCT RATING
            ================================================== */}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    strokeWidth={1.8}
                    className={
                      star <= Math.round(product.averageRating || 0) ?
                        "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                    }
                  />
                ))}
              </div>

              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {Number(product.averageRating || 0).toFixed(1)}
              </span>

              <span className="text-xs text-slate-400">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* PRICE */}

            <div className="mt-5 flex flex-wrap items-end gap-4">
              <span className="text-4xl font-bold text-slate-950 dark:text-white">
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </span>

              {isRental && dailyRate > 0 && (
                <span className="mb-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  ₹{dailyRate.toLocaleString("en-IN")} / day
                </span>
              )}

              {product.aiFairPrice && (
                <span className="mb-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  AI Fair Price ₹
                  {Number(product.aiFairPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* LOCATION */}

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={17} className="text-blue-600 dark:text-blue-400" />

              {product.location || "Campus Pickup"}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Description
              </h2>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {product.description}
              </p>
            </div>

            {/* AVAILABILITY */}

            <div className="mt-7 flex items-center gap-2">
              {product.isAvailable ?
                <>
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400"
                  />

                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Available for {product.listingType?.toLowerCase()}
                  </span>
                </>
              : <>
                  <XCircle size={18} className="text-red-500" />

                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Currently unavailable
                  </span>
                </>
              }
            </div>

            {/* =================================================
                RENTAL
            ================================================== */}

            {isRental && product.isAvailable && (
              <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={19}
                    className="text-indigo-600 dark:text-indigo-400"
                  />

                  <h2 className="font-bold text-slate-950 dark:text-white">
                    Rent this product
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Select your rental period and send a request to the seller.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {/* START */}

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={rentalStartDate}
                      onChange={(event) => {
                        setRentalStartDate(event.target.value);

                        setRentalAvailability(null);

                        setRentalError("");
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  {/* END */}

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={rentalEndDate}
                      onChange={(event) => {
                        setRentalEndDate(event.target.value);

                        setRentalAvailability(null);

                        setRentalError("");
                      }}
                      min={
                        rentalStartDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* AVAILABILITY */}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={checkRentalAvailability}
                    disabled={availabilityLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-500/30 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                  >
                    {availabilityLoading ?
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        Checking...
                      </>
                    : "Check Availability"}
                  </button>

                  {rentalAvailability === true && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <CheckCircle2 size={14} />
                      Available
                    </span>
                  )}

                  {rentalAvailability === false && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                      <XCircle size={14} />
                      Not Available
                    </span>
                  )}
                </div>

                {/* MESSAGE */}

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                    Message to Seller
                  </label>

                  <textarea
                    rows={3}
                    maxLength={500}
                    value={rentalMessage}
                    onChange={(event) => setRentalMessage(event.target.value)}
                    placeholder="Tell the seller anything important about your rental..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* SUMMARY */}

                {rentalDays > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Rental Days
                      </p>

                      <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                        {rentalDays}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Rental Amount
                      </p>

                      <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                        ₹{rentalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                        ₹{rentalTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}

                {/* ERROR */}

                {rentalError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {rentalError}
                  </div>
                )}

                {/* SUCCESS */}

                {rentalSuccess && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <CheckCircle2 size={17} />
                    {rentalSuccess}
                  </div>
                )}

                {/* RENT */}

                <button
                  type="button"
                  onClick={handleRentNow}
                  disabled={rentalLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {rentalLoading ?
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending Request...
                    </>
                  : <>
                      <CalendarDays size={18} />
                      Rent Now
                    </>
                  }
                </button>
              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {!isRental && (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                >
                  <ShoppingCart size={19} />
                  Add to Cart
                </button>
              )}

              <button
                type="button"
                onClick={handleChatWithSeller}
                disabled={!product.isAvailable}
                className={`flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400 ${
                  isRental ? "sm:col-span-2" : ""
                }`}
              >
                <MessageCircle size={19} />
                Chat with Seller
              </button>

              {product.listingType === "Exchange" && (
                <button
                  type="button"
                  onClick={openExchangeModal}
                  disabled={!product.isAvailable}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 sm:col-span-2"
                >
                  <ArrowRightLeft size={19} />
                  Make Exchange Offer
                </button>
              )}
            </div>

            {/* =================================================
                REPORT PRODUCT
            ================================================== */}

            <div className="mt-4">
              <button
                type="button"
                onClick={openReportModal}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <Flag size={16} />
                Report Product
              </button>
            </div>

            {/* COMMON MESSAGE */}

            {cartMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 size={17} />
                {cartMessage}
              </div>
            )}

            {/* =================================================
                SELLER
            ================================================== */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-lg font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {product.seller?.profileImage ?
                      <img
                        src={product.seller.profileImage}
                        alt={sellerName}
                        className="h-full w-full object-cover"
                      />
                    : sellerInitial}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {sellerName}
                    </p>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Student Seller
                    </p>
                  </div>
                </div>

                {product.seller?.isVerified && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={18} />
                    Verified
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <User size={16} />

                  {product.seller?.studentId || "Student ID available"}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={16} />

                  {product.seller?.college || product.college || "Campus"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            AI INSIGHT
        ================================================== */}

        <section className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-500/20 dark:bg-blue-500/10 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Sparkles size={20} />

                <span className="font-bold">AI Product Insight</span>
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">
                Smart analysis for your purchase
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                CampusMart AI will analyze product condition, pricing, seller
                history and marketplace trends to help students make safer
                buying decisions.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                AI Match
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                94%
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Strong recommendation
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            REVIEWS & RATINGS
        ================================================== */}

        <ProductReviews productId={product._id} />

        {/* =================================================
            SAFETY
        ================================================== */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <ShieldCheck
                size={22}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">
                Campus Safety
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Prefer campus pickup and verify the product before completing
                the transaction. Avoid sharing sensitive account or payment
                information with other users.
              </p>
            </div>
          </div>
        </section>

        {/* CONTINUE SHOPPING */}

        <div className="mt-10 flex justify-center">
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>

      {/* =====================================================
          REPORT PRODUCT MODAL
      ===================================================== */}

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Report Product
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    Help keep CampusMart safe for students.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (reportLoading) {
                    return;
                  }

                  setShowReportModal(false);

                  setReportError("");

                  setReportSuccess("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close report modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleReportProduct} className="space-y-5 p-6">
              {/* PRODUCT */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Reported Product
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white dark:bg-slate-900">
                    <img
                      src={images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {product.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Listed by {sellerName}
                    </p>
                  </div>
                </div>
              </div>

              {/* REASON */}

              <div>
                <label
                  htmlFor="report-reason"
                  className="mb-2 block text-sm font-bold text-slate-900 dark:text-white"
                >
                  Reason for reporting
                </label>

                <select
                  id="report-reason"
                  value={reportReason}
                  onChange={(event) => setReportReason(event.target.value)}
                  disabled={reportLoading}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">Select a reason</option>

                  <option value="Fraud or Scam">Fraud or Scam</option>

                  <option value="Fake Product">Fake Product</option>

                  <option value="Wrong Information">Wrong Information</option>

                  <option value="Prohibited Item">Prohibited Item</option>

                  <option value="Inappropriate Content">
                    Inappropriate Content
                  </option>

                  <option value="Harassment">Harassment</option>

                  <option value="Spam">Spam</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="report-description"
                  className="mb-2 block text-sm font-bold text-slate-900 dark:text-white"
                >
                  Additional details
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="report-description"
                  value={reportDescription}
                  onChange={(event) => setReportDescription(event.target.value)}
                  disabled={reportLoading}
                  rows={5}
                  maxLength={1000}
                  placeholder="Explain the problem clearly. Avoid sharing passwords, OTPs or other sensitive information."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {reportDescription.length}
                  /1000
                </p>
              </div>

              {/* SAFETY NOTE */}

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                  />

                  <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                    Submit a report only when you believe the listing violates
                    CampusMart rules or creates a safety concern.
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {reportError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {reportError}
                </div>
              )}

              {/* SUCCESS */}

              {reportSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 size={17} />

                  {reportSuccess}
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (reportLoading) {
                      return;
                    }

                    setShowReportModal(false);

                    setReportError("");

                    setReportSuccess("");
                  }}
                  disabled={reportLoading}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={reportLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reportLoading ?
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  : <>
                      <Flag size={16} />
                      Submit Report
                    </>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EXCHANGE MODAL
      ===================================================== */}

      {showExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <ArrowRightLeft
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Make Exchange Offer
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Offer one of your products
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowExchangeModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close exchange modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-6 px-6 py-6">
              {/* TARGET PRODUCT */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  You want
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-white dark:bg-slate-900">
                    <img
                      src={images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* PRODUCT SELECT */}

              <div>
                <label
                  htmlFor="exchange-product"
                  className="block text-sm font-bold text-slate-900 dark:text-white"
                >
                  Select your product
                </label>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose one of your available products to offer.
                </p>

                {myProducts.length === 0 ?
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
                    <div className="flex items-start gap-3">
                      <Package
                        size={20}
                        className="mt-0.5 text-amber-600 dark:text-amber-400"
                      />

                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-200">
                          No available products
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-300">
                          Add at least one available product before sending an
                          exchange offer.
                        </p>

                        <Link
                          to="/sell"
                          className="mt-3 inline-flex text-sm font-bold text-amber-800 underline dark:text-amber-300"
                        >
                          List a product
                        </Link>
                      </div>
                    </div>
                  </div>
                : <select
                    id="exchange-product"
                    value={selectedOfferProduct}
                    onChange={(event) =>
                      setSelectedOfferProduct(event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-500/10"
                  >
                    <option value="">Select a product</option>

                    {myProducts.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title} — ₹
                        {Number(item.price || 0).toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                }
              </div>

              {/* MESSAGE */}

              <div>
                <label
                  htmlFor="exchange-message"
                  className="block text-sm font-bold text-slate-900 dark:text-white"
                >
                  Message
                </label>

                <textarea
                  id="exchange-message"
                  value={exchangeMessage}
                  onChange={(event) => setExchangeMessage(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Write a message for the seller..."
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-500/10"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {exchangeMessage.length}
                  /1000
                </p>
              </div>

              {/* ERROR */}

              {exchangeError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {exchangeError}
                </div>
              )}

              {/* SUCCESS */}

              {exchangeSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 size={17} />

                  {exchangeSuccess}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-800 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowExchangeModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendExchangeOffer}
                disabled={exchangeLoading || myProducts.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                {exchangeLoading ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                : <>
                    <ArrowRightLeft size={17} />
                    Send Exchange Offer
                  </>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
