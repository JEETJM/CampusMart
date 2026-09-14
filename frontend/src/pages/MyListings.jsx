import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  Eye,
  MapPin,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import api from "../services/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80";

function MyListings() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==============================
  // FETCH MY PRODUCTS
  // ==============================
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/products/my/listings");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("My Listings Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("campusmart_token");
        localStorage.removeItem("campusmart_user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load your listings. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // ==============================
  // DELETE PRODUCT
  // ==============================
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(productId);

      await api.delete(`/products/${productId}`);

      setProducts((previous) =>
        previous.filter((product) => product._id !== productId),
      );
    } catch (error) {
      console.error("Delete Listing Error:", error);

      alert(error.response?.data?.message || "Unable to delete this listing.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==============================
          HEADER
      ============================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            to="/profile"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingBag size={23} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    My Listings
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage the products you have listed on CampusMart.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/sell"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              List a Product
            </Link>
          </div>
        </div>
      </section>

      {/* ==============================
          CONTENT
      ============================== */}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* ==============================
            STATS
        ============================== */}
        {!loading && !error && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Listings</p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {products.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Package size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Available</p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {products.filter((product) => product.isAvailable).length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Views</p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {products.reduce(
                      (total, product) => total + Number(product.views || 0),
                      0,
                    )}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Eye size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================
            ERROR
        ============================== */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-800">
              Unable to load your listings
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchMyProducts}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* ==============================
            LOADING
        ============================== */}
        {loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="h-6 w-full animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==============================
            PRODUCTS
        ============================== */}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const image = product.images?.[0] || fallbackImage;

              return (
                <article
                  key={product._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={image}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />

                    <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      {product.listingType}
                    </div>

                    <div
                      className={`absolute right-3 top-3 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm ${
                        product.isAvailable ?
                          "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {product.category}
                      </span>

                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {product.condition}
                      </span>
                    </div>

                    <Link to={`/product/${product._id}`}>
                      <h2 className="line-clamp-2 min-h-[48px] text-lg font-bold text-slate-950 transition hover:text-blue-600">
                        {product.title}
                      </h2>
                    </Link>

                    <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                      {product.description}
                    </p>

                    {/* PRICE */}
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-slate-950">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </p>

                      {product.aiFairPrice && (
                        <p className="mt-1 text-xs font-medium text-green-600">
                          AI fair price: ₹
                          {Number(product.aiFairPrice).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    {/* LOCATION */}
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={14} />

                      <span className="truncate">
                        {product.location || "Campus"}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                      <Link
                        to={`/product/${product._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />

                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ==============================
            EMPTY STATE
        ============================== */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Package size={30} className="text-slate-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              You have no listings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start selling or renting products to students on your campus.
            </p>

            <Link
              to="/sell"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              List Your First Product
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyListings;
