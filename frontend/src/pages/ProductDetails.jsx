import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        console.error("Product Details Error:", error);

        setError(error.response?.data?.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCartMessage("Adding to cart...");

      await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      setCartMessage("Added to cart.");
    } catch (error) {
      console.error("Add To Cart Error:", error);

      setCartMessage(
        error.response?.data?.message || "Unable to add product to cart.",
      );
    }
  };

  const handleChatWithSeller = async () => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
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

  const handleWishlist = () => {
    setIsWishlisted((previous) => !previous);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200" />

            <div className="space-y-5">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <XCircle size={32} className="text-red-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Product not found
          </h1>

          <p className="mt-2 text-slate-500">
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

  const images =
    product.images?.length > 0 ?
      product.images
    : [
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80",
      ];

  const sellerName = product.seller?.name || "Campus Seller";

  const sellerInitial = sellerName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/marketplace" className="transition hover:text-blue-600">
            Marketplace
          </Link>

          <span>/</span>

          <span>{product.category}</span>

          <span>/</span>

          <span className="font-medium text-slate-700">{product.title}</span>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Main */}
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="aspect-square bg-slate-100">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80";
                  }}
                />
              </div>

              <div className="absolute left-5 top-5 rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                {product.listingType}
              </div>

              <button
                type="button"
                onClick={handleWishlist}
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted ?
                      "fill-red-500 text-red-500"
                    : "text-slate-700"
                  }
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                    selectedImage === index ? "border-blue-600" : (
                      "border-slate-200"
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

          {/* Information */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                {product.category}
              </span>

              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {product.condition}
              </span>

              {product.seller?.isVerified && (
                <span className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <BadgeCheck size={14} />
                  Verified Seller
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-end gap-4">
              <span className="text-4xl font-bold text-slate-950">
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </span>

              {product.aiFairPrice && (
                <span className="mb-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                  AI Fair Price ₹
                  {Number(product.aiFairPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={17} className="text-blue-600" />
              {product.location || "Campus Pickup"}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-950">Description</h2>

              <p className="mt-3 leading-7 text-slate-600">
                {product.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mt-7 flex items-center gap-2">
              {product.isAvailable ?
                <>
                  <CheckCircle2 size={18} className="text-green-600" />

                  <span className="text-sm font-semibold text-green-700">
                    Available for {product.listingType.toLowerCase()}
                  </span>
                </>
              : <>
                  <XCircle size={18} className="text-red-500" />

                  <span className="text-sm font-semibold text-red-600">
                    Currently unavailable
                  </span>
                </>
              }
            </div>

            {/* Actions */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                <MessageCircle size={19} />
                Chat with Seller
              </button>
            </div>

            {cartMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <CheckCircle2 size={17} />
                {cartMessage}
              </div>
            )}

            {/* Seller */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                    {sellerInitial}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">{sellerName}</p>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Student Seller
                    </p>
                  </div>
                </div>

                {product.seller?.isVerified && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                    <ShieldCheck size={18} />
                    Verified
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User size={16} />
                  {product.seller?.studentId || "Student ID available"}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />
                  {product.seller?.college || product.college}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <section className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-700">
                <Sparkles size={20} />
                <span className="font-bold">AI Product Insight</span>
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-950">
                Smart analysis for your purchase
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                CampusMart AI will analyze product condition, pricing, seller
                history and marketplace trends to help students make safer
                buying decisions.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                AI Match
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-600">94%</p>

              <p className="text-xs text-slate-500">Strong recommendation</p>
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck size={22} className="text-green-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">Campus Safety</h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Prefer campus pickup and verify the product before completing
                the transaction. Avoid sharing sensitive account or payment
                information with other users.
              </p>
            </div>
          </div>
        </section>

        {/* Continue Shopping */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
