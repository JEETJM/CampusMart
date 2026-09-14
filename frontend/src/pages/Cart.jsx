import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/cart");

      setCart(response.data.cart);
    } catch (error) {
      console.error("Cart Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("campusmart_token");

        localStorage.removeItem("campusmart_user");

        navigate("/login");
        return;
      }

      setError(error.response?.data?.message || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdatingId(productId);

      const response = await api.put(`/cart/item/${productId}`, {
        quantity,
      });

      setCart(response.data.cart);
    } catch (error) {
      console.error("Quantity Update Error:", error);

      alert(error.response?.data?.message || "Unable to update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingId(productId);

      const response = await api.delete(`/cart/item/${productId}`);

      setCart(response.data.cart);
    } catch (error) {
      console.error("Remove Cart Item Error:", error);

      alert(error.response?.data?.message || "Unable to remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = useMemo(() => {
    if (!cart?.items) return 0;

    return cart.items.reduce((total, item) => {
      if (!item.product) return total;

      return (
        total + Number(item.product.price || 0) * Number(item.quantity || 1)
      );
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
  }, [cart]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <ShoppingBag size={28} className="text-blue-600" />

                <h1 className="text-3xl font-bold text-slate-950">
                  Shopping Cart
                </h1>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-800">
              Cart could not be loaded
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>

            <button
              onClick={fetchCart}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!error && (!cart?.items || cart.items.length === 0) && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <ShoppingBag size={30} className="text-slate-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Explore products from students on your campus and add something to
              your cart.
            </p>

            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Marketplace
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {/* CART */}
        {!error && cart?.items?.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* ITEMS */}
            <section className="space-y-4">
              {cart.items.map((item) => {
                if (!item.product) return null;

                const product = item.product;

                const image = product.images?.[0] || fallbackImage;

                const itemTotal =
                  Number(product.price || 0) * Number(item.quantity || 1);

                const isUpdating = updatingId === product._id;

                return (
                  <div
                    key={product._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {/* IMAGE */}
                      <Link
                        to={`/product/${product._id}`}
                        className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36"
                      >
                        <img
                          src={image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                      </Link>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                              {product.category}
                            </p>

                            <Link to={`/product/${product._id}`}>
                              <h2 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900 hover:text-blue-600">
                                {product.title}
                              </h2>
                            </Link>
                          </div>

                          <button
                            onClick={() => removeItem(product._id)}
                            disabled={isUpdating}
                            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {product.condition} · {product.listingType}
                        </p>

                        <p className="mt-3 text-lg font-bold text-slate-950">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>

                        {/* QUANTITY */}
                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="inline-flex items-center rounded-xl border border-slate-200">
                            <button
                              onClick={() =>
                                updateQuantity(product._id, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                              className="p-2.5 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(product._id, item.quantity + 1)
                              }
                              disabled={isUpdating}
                              className="p-2.5 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <p className="text-right font-bold text-slate-900">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* SUMMARY */}
            <aside>
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Items</span>

                    <span className="font-semibold text-slate-900">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>

                    <span className="font-semibold text-slate-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Campus Pickup</span>

                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Total</span>

                      <span className="text-2xl font-bold text-slate-950">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Proceed to Checkout
                  <ArrowRight size={17} />
                </button>

                <div className="mt-5 flex gap-3 rounded-xl bg-green-50 p-4">
                  <ShieldCheck size={20} className="shrink-0 text-green-600" />

                  <p className="text-xs leading-5 text-green-700">
                    CampusMart keeps your transactions within the verified
                    student marketplace.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
