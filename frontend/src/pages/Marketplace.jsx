import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  Package,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  RefreshCw,
  ArrowUpDown,
  Store,
} from "lucide-react";

import api from "../services/api";

// =====================================================
// CONSTANTS
// =====================================================

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

const conditions = ["All", "New", "Like New", "Good", "Fair"];

const listingTypes = ["All", "Sell", "Rent", "Exchange"];

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
    label: "Most Popular",
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=85";

// =====================================================
// HELPER
// =====================================================

const getProductImage = (product) => {
  if (
    Array.isArray(product?.images) &&
    product.images.length > 0 &&
    product.images[0]
  ) {
    return product.images[0];
  }

  return fallbackImage;
};

const getSellerInitial = (sellerName) => {
  if (!sellerName) {
    return "S";
  }

  return sellerName.charAt(0).toUpperCase();
};

// =====================================================
// COMPONENT
// =====================================================

function Marketplace() {
  // ===================================================
  // URL
  // ===================================================

  const [searchParams, setSearchParams] = useSearchParams();

  // ===================================================
  // PRODUCTS
  // ===================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // FILTERS
  // ===================================================

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );

  const [condition, setCondition] = useState(
    searchParams.get("condition") || "All",
  );

  const [listingType, setListingType] = useState(
    searchParams.get("listingType") || "All",
  );

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");

  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const [showFilters, setShowFilters] = useState(false);

  // ===================================================
  // WISHLIST - TEMP LOCAL UI
  // ===================================================

  const [wishlist, setWishlist] = useState([]);

  // ===================================================
  // PAGINATION
  // ===================================================

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  });

  // ===================================================
  // ACTIVE FILTERS
  // ===================================================

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
        category !== "All" ||
        condition !== "All" ||
        listingType !== "All" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        sort !== "newest",
      ),
    [search, category, condition, listingType, minPrice, maxPrice, sort],
  );

  // ===================================================
  // URL -> STATE
  // ===================================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    const urlCategory = searchParams.get("category") || "All";

    const urlCondition = searchParams.get("condition") || "All";

    const urlListingType = searchParams.get("listingType") || "All";

    const urlMinPrice = searchParams.get("minPrice") || "";

    const urlMaxPrice = searchParams.get("maxPrice") || "";

    const urlSort = searchParams.get("sort") || "newest";

    setSearch(urlSearch);

    setCategory(categories.includes(urlCategory) ? urlCategory : "All");

    setCondition(conditions.includes(urlCondition) ? urlCondition : "All");

    setListingType(
      listingTypes.includes(urlListingType) ? urlListingType : "All",
    );

    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);

    setSort(
      sortOptions.some((item) => item.value === urlSort) ? urlSort : "newest",
    );
  }, [searchParams]);

  // ===================================================
  // STATE -> URL
  // ===================================================

  useEffect(() => {
    const nextParams = {};

    if (search.trim()) {
      nextParams.search = search.trim();
    }

    if (category !== "All") {
      nextParams.category = category;
    }

    if (condition !== "All") {
      nextParams.condition = condition;
    }

    if (listingType !== "All") {
      nextParams.listingType = listingType;
    }

    if (minPrice !== "") {
      nextParams.minPrice = minPrice;
    }

    if (maxPrice !== "") {
      nextParams.maxPrice = maxPrice;
    }

    if (sort !== "newest") {
      nextParams.sort = sort;
    }

    const currentQuery = searchParams.toString();

    const nextQuery = new URLSearchParams(nextParams).toString();

    if (currentQuery !== nextQuery) {
      setSearchParams(nextParams, {
        replace: true,
      });

      setPage(1);
    }
  }, [
    search,
    category,
    condition,
    listingType,
    minPrice,
    maxPrice,
    sort,
    searchParams,
    setSearchParams,
  ]);

  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: 12,
          sort,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (category !== "All") {
          params.category = category;
        }

        if (condition !== "All") {
          params.condition = condition;
        }

        if (listingType !== "All") {
          params.listingType = listingType;
        }

        if (minPrice !== "") {
          params.minPrice = minPrice;
        }

        if (maxPrice !== "") {
          params.maxPrice = maxPrice;
        }

        const response = await api.get("/products", {
          params,
        });

        if (cancelled) {
          return;
        }

        setProducts(
          Array.isArray(response.data?.products) ? response.data.products : [],
        );

        setPagination(
          response.data?.pagination || {
            totalProducts: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 12,
          },
        );
      } catch (fetchError) {
        if (cancelled) {
          return;
        }

        console.error("Marketplace Error:", fetchError);

        setProducts([]);

        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Unable to load products. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    category,
    condition,
    listingType,
    minPrice,
    maxPrice,
    sort,
  ]);

  // ===================================================
  // WISHLIST
  // ===================================================

  const toggleWishlist = (productId) => {
    setWishlist((previous) =>
      previous.includes(productId) ?
        previous.filter((id) => id !== productId)
      : [...previous, productId],
    );
  };

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setCondition("All");
    setListingType("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  // ===================================================
  // PAGE NUMBERS
  // ===================================================

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages || 0;

    if (totalPages <= 0) {
      return [];
    }

    const start = Math.max(1, page - 2);

    const end = Math.min(totalPages, page + 2);

    const numbers = [];

    for (let current = start; current <= end; current += 1) {
      numbers.push(current);
    }

    return numbers;
  };

  const hasPreviousPage = page > 1;

  const hasNextPage = page < (pagination.totalPages || 0);

  // ===================================================
  // LISTING TYPE LABEL
  // ===================================================

  const getListingLabel = (listing) => {
    if (listing === "Sell") {
      return "For Sale";
    }

    if (listing === "Rent") {
      return "For Rent";
    }

    if (listing === "Exchange") {
      return "Exchange";
    }

    return listing || "Listing";
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-900 dark:bg-[#070b14] dark:text-slate-100">
      {/* =================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Glows */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-600/10" />

        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          {/* Header */}
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-blue-700 dark:border-blue-500/15 dark:bg-blue-500/10 dark:text-blue-300">
                <ShieldCheck size={14} />
                Verified Campus Marketplace
              </div>

              <h1 className="text-4xl font-black tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Find what you need.
                <span className="block text-blue-600 dark:text-blue-400">
                  Sell what you don't.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                Buy, sell, rent and exchange products with students from your
                campus community.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                    CampusMart AI
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                    Shop smarter
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_55px_rgba(37,99,235,0.09)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 dark:bg-slate-800">
                <Search
                  size={20}
                  className="shrink-0 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search books, electronics, cycles..."
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((previous) => !previous)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                  showFilters || hasActiveFilters ?
                    "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-950/30"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                <SlidersHorizontal size={18} />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-black text-blue-600">
                    Active
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ACTIVE FILTERS */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {category !== "All" && (
              <button
                type="button"
                onClick={() => setCategory("All")}
                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-500/15 dark:bg-blue-500/10 dark:text-blue-300"
              >
                {category}
                <X size={13} />
              </button>
            )}

            {condition !== "All" && (
              <button
                type="button"
                onClick={() => setCondition("All")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {condition}
                <X size={13} />
              </button>
            )}

            {listingType !== "All" && (
              <button
                type="button"
                onClick={() => setListingType("All")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {getListingLabel(listingType)}
                <X size={13} />
              </button>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <X size={13} />
                Clear all
              </button>
            )}
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Refine your search
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Choose the options that match your needs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close filters"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
                {/* CATEGORY */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* CONDITION */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Condition
                  </label>

                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(event) => setCondition(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {conditions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* LISTING TYPE */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Listing Type
                  </label>

                  <div className="relative">
                    <select
                      value={listingType}
                      onChange={(event) => setListingType(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {listingTypes.map((item) => (
                        <option key={item} value={item}>
                          {item === "Sell" ?
                            "For Sale"
                          : item === "Rent" ?
                            "For Rent"
                          : item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* MIN PRICE */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Minimum Price
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      placeholder="Minimum"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* MAX PRICE */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Maximum Price
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="Maximum"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* SORT */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Sort By
                  </label>

                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {sortOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <ArrowUpDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* RESULTS HEADER */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Store size={18} />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  Marketplace
                </h2>

                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {loading ?
                    "Finding products for you..."
                  : `${pagination.totalProducts || 0} product${
                      pagination.totalProducts !== 1 ? "s" : ""
                    } available`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 sm:inline-flex dark:bg-blue-500/10 dark:text-blue-400">
                Filters applied
              </span>
            )}

            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <ArrowUpDown size={14} />
              {sortOptions.find((item) => item.value === sort)?.label ||
                "Newest First"}
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-7 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-red-700 dark:text-red-400">
                  Unable to load marketplace
                </p>

                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPage(1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-60 animate-pulse bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-4 p-5">
                  <div className="flex justify-between gap-3">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>

                  <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-7 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const productId = product._id;

                const isWishlisted = wishlist.includes(productId);

                const image = getProductImage(product);

                const sellerName = product.seller?.name || "Campus Seller";

                return (
                  <article
                    key={productId}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 dark:hover:shadow-black/30"
                  >
                    {/* IMAGE */}
                    <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Link
                        to={`/product/${productId}`}
                        className="block h-full w-full"
                      >
                        <img
                          src={image}
                          alt={product.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          onError={(event) => {
                            if (event.currentTarget.src !== fallbackImage) {
                              event.currentTarget.src = fallbackImage;
                            }
                          }}
                        />
                      </Link>

                      {/* Image gradient */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

                      {/* Listing badge */}
                      <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                        {getListingLabel(product.listingType)}
                      </span>

                      {/* Wishlist */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(productId)}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-slate-600 shadow-lg backdrop-blur transition hover:scale-105 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
                        aria-label={
                          isWishlisted ?
                            "Remove from wishlist"
                          : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={17}
                          className={
                            isWishlisted ? "fill-red-500 text-red-500" : ""
                          }
                        />
                      </button>

                      {/* Verified */}
                      {product.seller?.isVerified && (
                        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-md backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
                          <BadgeCheck size={12} className="text-blue-500" />
                          Verified seller
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                          {product.category}
                        </span>

                        {product.condition && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {product.condition}
                          </span>
                        )}
                      </div>

                      <Link to={`/product/${productId}`} className="mt-2 block">
                        <h3 className="line-clamp-2 min-h-[48px] text-base font-black leading-6 text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {product.description ||
                          "A useful product listed by a campus student."}
                      </p>

                      {/* PRICE */}
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                            ₹
                            {Number(product.price || 0).toLocaleString("en-IN")}
                          </p>

                          {product.listingType === "Rent" &&
                            Number(product.rentalPricePerDay || 0) > 0 && (
                              <p className="mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                ₹
                                {Number(
                                  product.rentalPricePerDay,
                                ).toLocaleString("en-IN")}
                                /day
                              </p>
                            )}

                          {product.aiFairPrice &&
                            Number(product.aiFairPrice) > 0 && (
                              <p className="mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                AI fair price ₹
                                {Number(product.aiFairPrice).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            // Cart integration comes next.
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition hover:scale-105 hover:bg-blue-700 dark:bg-blue-500 dark:shadow-blue-950/30"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={17} />
                        </button>
                      </div>

                      {/* SELLER */}
                      <div className="mt-auto pt-5">
                        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white">
                                {getSellerInitial(sellerName)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                  {sellerName}
                                </p>

                                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                  {product.seller?.isVerified && (
                                    <ShieldCheck
                                      size={11}
                                      className="text-emerald-500"
                                    />
                                  )}
                                  Student seller
                                </p>
                              </div>
                            </div>

                            <div className="flex max-w-[100px] shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-400">
                              <MapPin size={12} />

                              <span className="truncate">
                                {product.location || "Campus"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-7 dark:border-slate-800 sm:flex-row">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    Page {pagination.currentPage || page}
                  </span>

                  <span>of {pagination.totalPages}</span>

                  <span className="hidden text-slate-300 sm:inline">|</span>

                  <span className="hidden sm:inline">
                    {pagination.totalProducts} products
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* PREVIOUS */}
                  <button
                    type="button"
                    disabled={!hasPreviousPage}
                    onClick={() =>
                      setPage((previous) => Math.max(previous - 1, 1))
                    }
                    className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <ChevronLeft size={16} />

                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* NUMBERS */}
                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-xs font-black transition ${
                        pageNumber === page ?
                          "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-950/30"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* NEXT */}
                  <button
                    type="button"
                    disabled={!hasNextPage}
                    onClick={() =>
                      setPage((previous) =>
                        Math.min(previous + 1, pagination.totalPages),
                      )
                    }
                    className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <span className="hidden sm:inline">Next</span>

                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* EMPTY */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              {hasActiveFilters ?
                <Search size={29} />
              : <Package size={29} />}
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
              {hasActiveFilters ?
                "No matching products"
              : "No products available"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {hasActiveFilters ?
                "Try changing your search or filters to discover more products."
              : "There are no active listings available right now."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:bg-blue-500 dark:shadow-blue-950/30"
              >
                <RefreshCw size={15} />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Marketplace;
