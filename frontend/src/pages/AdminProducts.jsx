import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Package,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";

// ============================================================
// CONSTANTS
// ============================================================

const categories = [
  "All",
  "Books",
  "Electronics",
  "Cycles",
  "Furniture",
  "Clothing",
  "Accessories",
  "Sports",
  "Notes",
  "Other",
];

const listingTypes = ["All", "Sell", "Rent", "Exchange"];

const statusOptions = [
  {
    value: "all",
    label: "All Products",
  },
  {
    value: "available",
    label: "Available",
  },
  {
    value: "unavailable",
    label: "Hidden",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "popular",
    label: "Most Viewed",
  },
  {
    value: "rating",
    label: "Highest Rated",
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80";

// ============================================================
// HELPERS
// ============================================================

const formatPrice = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const getImage = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }

  return fallbackImage;
};

const getInitial = (name) => {
  return name?.charAt(0)?.toUpperCase() || "S";
};

const getListingLabel = (type) => {
  if (type === "Sell") return "For Sale";
  if (type === "Rent") return "For Rent";
  if (type === "Exchange") return "Exchange";

  return type || "Listing";
};

// ============================================================
// COMPONENT
// ============================================================

function AdminProducts() {
  // ==========================================================
  // DATA
  // ==========================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [listingType, setListingType] = useState("All");

  const [status, setStatus] = useState("all");

  const [sort, setSort] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    limit: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ==========================================================
  // ACTION STATE
  // ==========================================================

  const [processingId, setProcessingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 20,
        sort,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category !== "All") {
        params.category = category;
      }

      if (listingType !== "All") {
        params.listingType = listingType;
      }

      if (status !== "all") {
        params.status = status;
      }

      const response = await api.get("/products/admin/all", {
        params,
      });

      setProducts(
        Array.isArray(response.data?.products) ? response.data.products : [],
      );

      setPagination(
        response.data?.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          limit: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (requestError) {
      console.error("Admin Products Error:", requestError);

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // EFFECT
  // ==========================================================

  useEffect(() => {
    fetchProducts();
  }, [page, category, listingType, status, sort]);

  // ==========================================================
  // SEARCH DEBOUNCE
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 450);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const availableCount = useMemo(
    () => products.filter((product) => product.isAvailable !== false).length,
    [products],
  );

  const hiddenCount = useMemo(
    () => products.filter((product) => product.isAvailable === false).length,
    [products],
  );

  const flaggedCount = useMemo(
    () =>
      products.filter((product) => Number(product.aiRiskScore ?? 0) >= 70)
        .length,
    [products],
  );

  // ==========================================================
  // RESET
  // ==========================================================

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setListingType("All");
    setStatus("all");
    setSort("newest");
    setPage(1);
  };

  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  const toggleAvailability = async (product) => {
    try {
      setProcessingId(product._id);

      await api.put(`/products/admin/${product._id}/availability`, {
        isAvailable: !product.isAvailable,
      });

      setProducts((previous) =>
        previous.map((item) =>
          item._id === product._id ?
            {
              ...item,
              isAvailable: !item.isAvailable,
            }
          : item,
        ),
      );
    } catch (requestError) {
      console.error("Update Product Status Error:", requestError);

      window.alert(
        requestError.response?.data?.message ||
          "Unable to update product status.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setProcessingId(deleteTarget._id);

      await api.delete(`/products/admin/${deleteTarget._id}`);

      setProducts((previous) =>
        previous.filter((item) => item._id !== deleteTarget._id),
      );

      setPagination((previous) => ({
        ...previous,
        totalProducts: Math.max(0, (previous.totalProducts || 0) - 1),
      }));

      setDeleteTarget(null);
    } catch (requestError) {
      console.error("Delete Product Error:", requestError);

      window.alert(
        requestError.response?.data?.message || "Unable to delete product.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages || 0;

    if (!total) {
      return [];
    }

    const start = Math.max(1, page - 2);

    const end = Math.min(total, page + 2);

    return Array.from(
      {
        length: end - start + 1,
      },
      (_, index) => start + index,
    );
  }, [pagination.totalPages, page]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 dark:bg-[#070b14] dark:text-slate-100">
      {/* ====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                <Package size={13} />
                Admin Management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Manage marketplace listings, availability, seller activity and
                AI product signals.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* =================================================
              SUMMARY
          ================================================== */}

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">
                  Total Products
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Package size={17} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black text-slate-950 dark:text-white">
                {pagination.totalProducts || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">Available</p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CheckCircle2 size={17} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black text-slate-950 dark:text-white">
                {availableCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">Hidden</p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <EyeOff size={17} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black text-slate-950 dark:text-white">
                {hiddenCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">
                  High Risk Signals
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <AlertTriangle size={17} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black text-slate-950 dark:text-white">
                {flaggedCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* SEARCH + FILTER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 dark:bg-slate-800">
              <Search size={18} className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product, description or college..."
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm font-medium outline-none placeholder:text-slate-400 dark:text-slate-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((previous) => !previous)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                showFilters ?
                  "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 md:grid-cols-2 xl:grid-cols-4">
              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* LISTING TYPE */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Listing Type
                </label>

                <select
                  value={listingType}
                  onChange={(event) => {
                    setListingType(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {listingTypes.map((item) => (
                    <option key={item} value={item}>
                      {getListingLabel(item)}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* SORT */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Sort
                </label>

                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {sortOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ACTIVE FILTERS */}
        {(search ||
          category !== "All" ||
          listingType !== "All" ||
          status !== "all" ||
          sort !== "newest") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Active:</span>

            {category !== "All" && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                {category}
              </span>
            )}

            {listingType !== "All" && (
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                {getListingLabel(listingType)}
              </span>
            )}

            {status !== "all" && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {statusOptions.find((item) => item.value === status)?.label}
              </span>
            )}

            {search && (
              <span className="max-w-[220px] truncate rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                “{search}”
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Clear
            </button>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center dark:border-red-500/20 dark:bg-red-500/5">
            <div>
              <p className="font-bold text-red-700 dark:text-red-400">
                Products could not be loaded
              </p>

              <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* ==================================================
            DESKTOP TABLE
        =================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Seller
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Performance
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      AI Signal
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const image = getImage(product);

                    const risk = Number(product.aiRiskScore ?? 0);

                    const quality = Number(product.aiQualityScore ?? 0);

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
                      >
                        {/* PRODUCT */}
                        <td className="px-5 py-4">
                          <div className="flex min-w-[280px] items-center gap-3">
                            <img
                              src={image}
                              alt={product.title}
                              className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                              onError={(event) => {
                                event.currentTarget.src = fallbackImage;
                              }}
                            />

                            <div className="min-w-0">
                              <Link
                                to={`/product/${product._id}`}
                                className="line-clamp-2 text-sm font-black text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                              >
                                {product.title}
                              </Link>

                              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                {getListingLabel(product.listingType)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* SELLER */}
                        <td className="px-5 py-4">
                          <div className="flex min-w-[160px] items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-black text-white">
                              {getInitial(product.seller?.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                {product.seller?.name || "Unknown"}
                              </p>

                              <div className="mt-0.5 flex items-center gap-1">
                                {product.seller?.isVerified && (
                                  <ShieldCheck
                                    size={11}
                                    className="text-emerald-500"
                                  />
                                )}

                                <span className="text-[10px] text-slate-400">
                                  {product.seller?.college || "Campus"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {product.category}
                          </span>
                        </td>

                        {/* PRICE */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {formatPrice(product.price)}
                          </p>

                          {product.rentalPricePerDay > 0 && (
                            <p className="mt-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                              {formatPrice(product.rentalPricePerDay)}
                              /day
                            </p>
                          )}
                        </td>

                        {/* PERFORMANCE */}
                        <td className="px-5 py-4">
                          <div className="space-y-1.5 text-[10px]">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Eye size={12} />
                              <span>
                                {Number(product.views || 0).toLocaleString(
                                  "en-IN",
                                )}{" "}
                                views
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Star
                                size={12}
                                className="fill-amber-400 text-amber-400"
                              />
                              <span>
                                {Number(product.averageRating || 0).toFixed(1)}
                              </span>

                              <span className="text-slate-300">
                                ({product.reviewCount || 0})
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* AI SIGNAL */}
                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${
                                risk >= 70 ?
                                  "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                : risk >= 40 ?
                                  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              }`}
                            >
                              Risk {risk}
                            </span>

                            {quality > 0 && (
                              <span className="block text-[10px] font-semibold text-slate-400">
                                Quality {quality}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          {product.isAvailable !== false ?
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Available
                            </span>
                          : <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Hidden
                            </span>
                          }
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/product/${product._id}`}
                              target="_blank"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700"
                              title="View product"
                            >
                              <ExternalLink size={15} />
                            </Link>

                            <button
                              type="button"
                              disabled={processingId === product._id}
                              onClick={() => toggleAvailability(product)}
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                product.isAvailable !== false ?
                                  "border-slate-200 text-slate-500 hover:border-amber-200 hover:text-amber-600 dark:border-slate-700"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/30"
                              }`}
                              title={
                                product.isAvailable !== false ?
                                  "Hide product"
                                : "Activate product"
                              }
                            >
                              {product.isAvailable !== false ?
                                <EyeOff size={15} />
                              : <Eye size={15} />}
                            </button>

                            <button
                              type="button"
                              disabled={processingId === product._id}
                              onClick={() => setDeleteTarget(product)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================
            MOBILE / TABLET CARDS
        =================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="mt-6 grid gap-5 xl:hidden sm:grid-cols-2">
            {products.map((product) => {
              const risk = Number(product.aiRiskScore ?? 0);

              return (
                <article
                  key={product._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative h-52 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={getImage(product)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white">
                      {getListingLabel(product.listingType)}
                    </span>

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-black ${
                        product.isAvailable !== false ?
                          "bg-emerald-500 text-white"
                        : "bg-slate-700 text-white"
                      }`}
                    >
                      {product.isAvailable !== false ? "Available" : "Hidden"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-wide text-blue-600 dark:text-blue-400">
                        {product.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Eye size={12} />
                        {product.views || 0}
                      </span>
                    </div>

                    <Link to={`/product/${product._id}`} className="mt-2 block">
                      <h3 className="line-clamp-2 text-lg font-black text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black text-slate-950 dark:text-white">
                          {formatPrice(product.price)}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <Star
                            size={13}
                            className="fill-amber-400 text-amber-400"
                          />
                          {Number(product.averageRating || 0).toFixed(1)}
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                          risk >= 70 ?
                            "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : risk >= 40 ?
                            "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}
                      >
                        AI Risk {risk}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white">
                            {getInitial(product.seller?.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                              {product.seller?.name || "Unknown Seller"}
                            </p>

                            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                              {product.seller?.isVerified && (
                                <ShieldCheck
                                  size={11}
                                  className="text-emerald-500"
                                />
                              )}
                              Student Seller
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          <ExternalLink size={13} />
                          View
                        </Link>

                        <button
                          type="button"
                          disabled={processingId === product._id}
                          onClick={() => toggleAvailability(product)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          {product.isAvailable !== false ?
                            <>
                              <EyeOff size={13} />
                              Hide
                            </>
                          : <>
                              <Eye size={13} />
                              Activate
                            </>
                          }
                        </button>

                        <button
                          type="button"
                          disabled={processingId === product._id}
                          onClick={() => setDeleteTarget(product)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:border-red-500/20"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ==================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-4 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-7 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================
            EMPTY
        =================================================== */}

        {!loading && !error && products.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-24 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Package size={30} />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              No listings match your current search and filter settings.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ==================================================
            PAGINATION
        =================================================== */}

        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <p className="text-xs font-medium text-slate-400">
              Page{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {pagination.currentPage || page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-black ${
                    pageNumber === page ?
                      "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setPage((previous) =>
                    Math.min(previous + 1, pagination.totalPages),
                  )
                }
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <Trash2 size={21} />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Delete product?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  This will permanently remove{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {deleteTarget.title}
                  </span>{" "}
                  from the marketplace.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processingId === deleteTarget._id}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
