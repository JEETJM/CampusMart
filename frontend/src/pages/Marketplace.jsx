import { useEffect, useState } from "react";
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
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80";

// =====================================================
// COMPONENT
// =====================================================

function Marketplace() {
  // ===================================================
  // URL SEARCH PARAMS
  // ===================================================

  const [searchParams, setSearchParams] = useSearchParams();

  // ===================================================
  // PRODUCT STATE
  // ===================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // FILTER STATE
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
  // WISHLIST
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
    productsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ===================================================
  // SYNC URL -> STATE
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
    setSort(urlSort);

    setPage(1);
  }, [searchParams]);

  // ===================================================
  // UPDATE URL WHEN FILTERS CHANGE
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

        setProducts(response.data?.products || []);

        setPagination(
          response.data?.pagination || {
            totalProducts: 0,
            totalPages: 0,
            currentPage: 1,
            productsPerPage: 12,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
      } catch (error) {
        console.error("Marketplace Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load products. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
  // ACTIVE FILTER CHECK
  // ===================================================

  const hasActiveFilters =
    search.trim() ||
    category !== "All" ||
    condition !== "All" ||
    listingType !== "All" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sort !== "newest";

  // ===================================================
  // PAGINATION NUMBERS
  // ===================================================

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;

    if (!totalPages) {
      return [];
    }

    const pages = [];

    const start = Math.max(1, page - 2);

    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <ShieldCheck size={16} />
              Verified Campus Marketplace
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Find what you need.
              <span className="block text-blue-600">Sell what you don't.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Buy, sell, rent and exchange products with students from your
              campus community.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mt-8 flex max-w-5xl items-center rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
            <Search size={21} className="ml-3 shrink-0 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books, electronics, cycles..."
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => setShowFilters((previous) => !previous)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* =================================================
              ACTIVE CATEGORY
          ================================================= */}

          {category !== "All" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-slate-500">Showing:</span>

              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {category}

                <button
                  type="button"
                  onClick={() => setCategory("All")}
                  className="rounded-full hover:bg-blue-100"
                  aria-label="Remove category filter"
                >
                  <X size={14} />
                </button>
              </span>
            </div>
          )}

          {/* =================================================
              FILTER PANEL
          ================================================= */}

          {showFilters && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none focus:border-blue-500"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* CONDITION */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Condition
                  </label>

                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(event) => setCondition(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none focus:border-blue-500"
                    >
                      {conditions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* LISTING TYPE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Listing Type
                  </label>

                  <div className="relative">
                    <select
                      value={listingType}
                      onChange={(event) => setListingType(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none focus:border-blue-500"
                    >
                      {listingTypes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* MIN PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Minimum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="₹ Minimum"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* MAX PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Maximum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="₹ Maximum"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* SORT */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Sort By
                  </label>

                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none focus:border-blue-500"
                    >
                      {sortOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* HEADER */}

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Marketplace</h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading ?
                "Loading products..."
              : `${pagination.totalProducts} product${
                  pagination.totalProducts !== 1 ? "s" : ""
                } available`
              }
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:self-auto"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Unable to load marketplace</p>

            <p className="mt-1 text-sm">{error}</p>

            <button
              type="button"
              onClick={() => setPage(1)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const isWishlisted = wishlist.includes(product._id);

                const image = product.images?.[0] || fallbackImage;

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* IMAGE */}

                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img
                        src={image}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />

                      {/* LISTING TYPE */}

                      <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                        {product.listingType}
                      </div>

                      {/* WISHLIST */}

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product._id)}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          size={18}
                          className={
                            isWishlisted ?
                              "fill-red-500 text-red-500"
                            : "text-slate-700"
                          }
                        />
                      </button>
                    </div>

                    {/* CONTENT */}

                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {product.category}
                        </span>

                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {product.condition}
                        </span>
                      </div>

                      <Link to={`/product/${product._id}`} className="block">
                        <h3 className="line-clamp-2 min-h-[48px] text-lg font-bold text-slate-950 transition hover:text-blue-600">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                        {product.description}
                      </p>

                      {/* PRICE */}

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-slate-950">
                            ₹
                            {Number(product.price || 0).toLocaleString("en-IN")}
                          </p>

                          {product.listingType === "Rent" &&
                            product.rentalPricePerDay > 0 && (
                              <p className="mt-1 text-xs font-semibold text-blue-600">
                                ₹
                                {Number(
                                  product.rentalPricePerDay,
                                ).toLocaleString("en-IN")}
                                /day
                              </p>
                            )}

                          {product.aiFairPrice && (
                            <p className="mt-1 text-xs font-medium text-green-600">
                              AI fair price: ₹
                              {Number(product.aiFairPrice).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>

                      {/* SELLER */}

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                              {product.seller?.name?.charAt(0)?.toUpperCase() ||
                                "S"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-700">
                                {product.seller?.name || "Campus Seller"}
                              </p>

                              <p className="flex items-center gap-1 text-xs text-slate-400">
                                {product.seller?.isVerified && (
                                  <ShieldCheck
                                    size={12}
                                    className="text-green-600"
                                  />
                                )}
                                Student Seller
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                            <MapPin size={13} />

                            <span className="max-w-[90px] truncate">
                              {product.location || "Campus"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* =================================================
                  PAGINATION
              ================================================= */}

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-7 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <span className="hidden text-slate-300 sm:inline">|</span>

                  <span className="hidden sm:inline">
                    {pagination.totalProducts} products
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() =>
                      setPage((previous) => Math.max(previous - 1, 1))
                    }
                    className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />

                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* PAGE NUMBERS */}

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                          pageNumber === page ?
                            "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() =>
                      setPage((previous) =>
                        Math.min(previous + 1, pagination.totalPages),
                      )
                    }
                    className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">Next</span>

                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Package size={30} className="text-slate-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or filters to find more products.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
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
