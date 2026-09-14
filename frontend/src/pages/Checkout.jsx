import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Pickup");

  const [notes, setNotes] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      const cartData = response.data?.cart;

      if (!cartData || cartData.items?.length === 0) {
        navigate("/cart", { replace: true });
        return;
      }

      setCart(cartData);
    } catch (err) {
      console.error("Checkout Cart Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("campusmart_token");
        localStorage.removeItem("campusmart_user");

        navigate("/login", { replace: true });
        return;
      }

      setError(err.response?.data?.message || "Unable to load checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!pickupLocation.trim()) {
      setError("Please enter a pickup location.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/orders", {
        pickupLocation: pickupLocation.trim(),
        paymentMethod,
        notes: notes.trim(),
      });

      const orderId = response.data?.order?._id;

      if (!orderId) {
        setError("Order was created but order ID was not returned.");
        return;
      }

      navigate(`/orders/${orderId}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Place Order Error:", err);

      setError(err.response?.data?.message || "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-52 rounded bg-slate-200" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Package size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>

              <p className="text-sm text-slate-500">
                Complete your campus order.
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

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* Left */}
          <div className="space-y-6">
            {/* Pickup */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Campus Pickup</h2>

                  <p className="text-xs text-slate-500">
                    Choose where you want to receive the order.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pickup Location
                </label>

                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Example: Main Gate, Library, Block A"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Payment Method</h2>

                  <p className="text-xs text-slate-500">
                    Select how you want to pay.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Pickup"
                    checked={paymentMethod === "Cash on Pickup"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Cash on Pickup
                    </p>

                    <p className="text-xs text-slate-500">
                      Pay directly when collecting the product.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Online Payment
                    </p>

                    <p className="text-xs text-slate-500">
                      Online payment integration can be connected next.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Notes */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">Order Notes</h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional note for the seller..."
                rows={4}
                maxLength={500}
                className="mt-4 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </section>
          </div>

          {/* Right */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

            <div className="mt-5 space-y-4">
              {cart.items.map((item) => {
                const product = item.product;

                return (
                  <div key={product._id} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product.images?.[0] ?
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      : <div className="flex h-full items-center justify-center">
                          <Package size={20} className="text-slate-400" />
                        </div>
                      }
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {product.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        ₹
                        {(product.price * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-5 border-t border-slate-200" />

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Items</span>
              <span>{cart.itemCount || 0}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900">Total</span>

              <span className="text-2xl font-bold text-slate-900">
                ₹{Number(cart.subtotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder ?
                "Placing Order..."
              : <>
                  <CheckCircle2 size={18} />
                  Place Order
                </>
              }
            </button>

            <div className="mt-5 flex gap-3 rounded-xl bg-slate-50 p-4">
              <ShieldCheck size={19} className="shrink-0 text-slate-600" />

              <p className="text-xs leading-5 text-slate-500">
                Your order is protected by CampusMart's secure checkout system.
              </p>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
