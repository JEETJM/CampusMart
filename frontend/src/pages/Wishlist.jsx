import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const Wishlist = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchWishlist();
  }, [navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");

      setItems(response.data?.wishlist?.items || []);
    } catch (err) {
      console.error("Wishlist Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("campusmart_token");
        localStorage.removeItem("campusmart_user");

        navigate("/login", { replace: true });
        return;
      }

      setError(err.response?.data?.message || "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      setItems((currentItems) =>
        currentItems.filter((item) => item.product?._id !== productId),
      );
    } catch (err) {
      console.error("Remove Wishlist Error:", err);

      setError(err.response?.data?.message || "Unable to remove product.");
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post("/cart", {
        productId,
        quantity: 1,
      });

      navigate("/cart");
    } catch (err) {
      console.error("Wishlist Cart Error:", err);

      setError(err.response?.data?.message || "Unable to add product to cart.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-48 rounded bg-slate-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-80 rounded-2xl bg-white" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Heart size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Wishlist
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Save products you may want to buy later.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {items.length === 0 ?
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Heart size={28} className="text-slate-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Save products here so you can easily find them later.
            </p>

            <Link
              to="/marketplace"
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Browse Marketplace
            </Link>
          </div>
        : <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {items.length} saved product
                {items.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => {
                const product = item.product;

                if (!product) return null;

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link to={`/product/${product._id}`} className="block">
                      <div className="relative h-52 overflow-hidden bg-slate-100">
                        {product.images?.[0] ?
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        : <div className="flex h-full items-center justify-center text-slate-400">
                            <ShoppingCart size={32} />
                          </div>
                        }

                        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
                          <Heart
                            size={17}
                            className="fill-current text-red-500"
                          />
                        </div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {product.category}
                      </p>

                      <Link to={`/product/${product._id}`}>
                        <h2 className="mt-1 line-clamp-2 min-h-12 text-sm font-bold text-slate-900 hover:text-blue-600">
                          {product.title}
                        </h2>
                      </Link>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-bold text-slate-900">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>

                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                          {product.condition}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addToCart(product._id)}
                          disabled={!product.isAvailable}
                          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          <ShoppingCart size={15} />
                          Add to Cart
                        </button>

                        <button
                          onClick={() => removeItem(product._id)}
                          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        }
      </main>
    </div>
  );
};

export default Wishlist;
