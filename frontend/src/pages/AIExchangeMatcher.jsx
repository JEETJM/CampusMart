import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  Sparkles,
  Search,
  RefreshCw,
  Package,
  MapPin,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import api from "../services/api";

function AIExchangeMatcher() {
  const navigate = useNavigate();

  const [myProducts, setMyProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [matches, setMatches] = useState([]);
  const [sourceProduct, setSourceProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadMyExchangeProducts = async () => {
      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login", {
          state: { from: "/ai-exchange-matcher" },
        });
        return;
      }

      try {
        setLoadingProducts(true);
        setError("");

        const response = await api.get("/products/my/listings");
        const products = response.data?.products || [];

        const exchangeProducts = products.filter(
          (product) =>
            product.listingType === "Exchange" && product.isAvailable === true,
        );

        setMyProducts(exchangeProducts);

        if (exchangeProducts.length > 0) {
          setSelectedProductId(String(exchangeProducts[0]._id));
        }
      } catch (err) {
        console.error("Load exchange products error:", err);

        setError(
          err.response?.data?.message ||
            "Could not load your listings. Please sign in again if your session expired.",
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadMyExchangeProducts();
  }, [navigate]);

  const handleFindMatches = async (event) => {
    event.preventDefault();

    if (!selectedProductId) {
      setError("Please select one of your available Exchange listings.");
      return;
    }

    try {
      setMatching(true);
      setError("");
      setNotice("");
      setMatches([]);
      setSourceProduct(null);

      const response = await api.post("/ai/exchange-matches", {
        productId: selectedProductId,
        limit: 10,
      });

      const result = response.data;

      if (!result?.success) {
        setError(result?.message || "Unable to find exchange matches.");
        return;
      }

      setSourceProduct(result.sourceProduct || null);
      setMatches(result.matches || []);

      if ((result.matches || []).length === 0) {
        setNotice(
          "No suitable matches were found yet. Try again later when more students list exchange products.",
        );
      }
    } catch (err) {
      console.error("AI Exchange Matcher error:", err);

      setError(
        err.response?.data?.message ||
          "Could not find matches. Check your login and backend connection.",
      );
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 p-6 text-white shadow-lg sm:p-10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Sparkles size={30} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-100">
            CampusMart AI
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            AI Exchange Matcher
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            Find student exchange listings that match your product by category,
            estimated price similarity and condition.
          </p>

          <Link
            to="/my-exchange-offers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            My Exchange Offers <ArrowRightLeft size={18} />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Search size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold">Find a match</h2>
                <p className="text-sm text-slate-500">
                  Select your exchange product
                </p>
              </div>
            </div>

            {loadingProducts ?
              <div className="flex items-center gap-2 py-6 text-slate-500">
                <LoaderCircle className="animate-spin" size={20} />
                Loading your listings...
              </div>
            : myProducts.length === 0 ?
              <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
                <Package className="mx-auto mb-3 text-slate-400" size={32} />

                <p className="font-semibold">No available Exchange listings</p>

                <p className="mt-2 text-sm text-slate-500">
                  First list a product with listing type Exchange.
                </p>

                <Link
                  to="/sell"
                  className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  List a Product
                </Link>
              </div>
            : <form onSubmit={handleFindMatches} className="space-y-5">
                <label
                  htmlFor="exchange-product"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Your product
                </label>

                <select
                  id="exchange-product"
                  value={selectedProductId}
                  onChange={(event) => {
                    setSelectedProductId(event.target.value);
                    setMatches([]);
                    setSourceProduct(null);
                    setNotice("");
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {myProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title} — ₹{product.price}
                    </option>
                  ))}
                </select>

                {(() => {
                  const selectedProduct = myProducts.find(
                    (product) => String(product._id) === selectedProductId,
                  );

                  return selectedProduct ?
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="font-semibold">{selectedProduct.title}</p>

                        <p className="mt-1 text-sm text-slate-600">
                          {selectedProduct.category} ·{" "}
                          {selectedProduct.condition}
                        </p>

                        <p className="mt-2 text-lg font-bold text-indigo-700">
                          ₹
                          {Number(selectedProduct.price).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    : null;
                })()}

                <button
                  type="submit"
                  disabled={matching || !selectedProductId}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {matching ?
                    <>
                      <LoaderCircle className="animate-spin" size={19} />
                      Finding matches...
                    </>
                  : <>
                      <Sparkles size={19} />
                      Find AI Matches
                    </>
                  }
                </button>

                <p className="text-xs leading-5 text-slate-500">
                  Match scores are rule-based estimates. They are not generated
                  by a trained machine-learning model.
                </p>
              </form>
            }
          </section>

          <section className="min-w-0">
            {error && (
              <div
                role="alert"
                className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 shrink-0" size={20} />
                <p>{error}</p>
              </div>
            )}

            {notice && (
              <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 shrink-0" size={20} />
                <p>{notice}</p>
              </div>
            )}

            {sourceProduct && (
              <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Matching for your product
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {sourceProduct.title}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {sourceProduct.category} · {sourceProduct.condition} · ₹
                  {Number(sourceProduct.price).toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Recommended matches</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Best available matches appear first.
                </p>
              </div>

              {matches.length > 0 && (
                <button
                  type="button"
                  onClick={handleFindMatches}
                  disabled={matching}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              )}
            </div>

            {matches.length === 0 && !matching && !error && !notice && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <ArrowRightLeft size={30} />
                </div>

                <h3 className="text-lg font-bold">Ready to find a match?</h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Choose one of your available Exchange products and select Find
                  AI Matches to discover suitable listings.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {matches.map((match) => {
                const product = match.product;

                if (!product) return null;

                const image = product.images?.[0];

                return (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="h-48 shrink-0 bg-slate-100 sm:h-auto sm:w-48">
                        {image ?
                          <img
                            src={image}
                            alt={product.title}
                            className="h-full min-h-44 w-full object-cover"
                            loading="lazy"
                          />
                        : <div className="flex h-full min-h-44 items-center justify-center text-slate-400">
                            <Package size={42} />
                          </div>
                        }
                      </div>

                      <div className="min-w-0 flex-1 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                              Exchange match
                            </p>

                            <h3 className="mt-1 break-words text-lg font-bold">
                              {product.title}
                            </h3>
                          </div>

                          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right">
                            <p className="text-xs text-emerald-700">
                              Match score
                            </p>
                            <p className="text-xl font-bold text-emerald-700">
                              {match.matchScore}%
                            </p>
                          </div>
                        </div>

                        <p className="mt-2 text-lg font-bold text-slate-900">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {product.category} · {product.condition}
                        </p>

                        {product.college && (
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin size={15} />
                            {product.college}
                          </p>
                        )}

                        {Array.isArray(match.reasons) &&
                          match.reasons.length > 0 && (
                            <div className="mt-4 rounded-xl bg-slate-50 p-3">
                              <p className="mb-2 text-sm font-semibold">
                                Why this match?
                              </p>

                              <ul className="space-y-1.5">
                                {match.reasons.map((reason, index) => (
                                  <li
                                    key={`${product._id}-${index}`}
                                    className="flex gap-2 text-sm text-slate-600"
                                  >
                                    <CheckCircle2
                                      size={16}
                                      className="mt-0.5 shrink-0 text-emerald-600"
                                    />
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        <Link
                          to={`/product/${product._id}`}
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                          View Product & Exchange <ArrowRightLeft size={17} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AIExchangeMatcher;
