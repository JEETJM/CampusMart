import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import LocationPicker from "../components/LocationPicker";

/* =========================================================
   LOAD RAZORPAY CHECKOUT
========================================================= */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const scriptUrl = "https://checkout.razorpay.com/v1/checkout.js";

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = scriptUrl;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/* =========================================================
   CHECKOUT
========================================================= */

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  const [paymentError, setPaymentError] = useState("");

  /* =========================================================
     PICKUP LOCATION
  ========================================================= */

  const [pickupLocation, setPickupLocation] = useState("");

  const [pickupCoordinates, setPickupCoordinates] = useState({
    lat: null,
    lng: null,
  });

  /* =========================================================
     PAYMENT
  ========================================================= */

  const [paymentMethod, setPaymentMethod] = useState("Cash on Pickup");

  const [notes, setNotes] = useState("");

  /* =========================================================
     AUTH + INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    fetchCart();
  }, [navigate]);

  /* =========================================================
     FETCH CART
  ========================================================= */

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await api.get("/cart");

      const cartData = response.data?.cart;

      if (
        !cartData ||
        !Array.isArray(cartData.items) ||
        cartData.items.length === 0
      ) {
        navigate("/cart", {
          replace: true,
        });

        return;
      }

      setCart(cartData);
    } catch (err) {
      console.error("Checkout Cart Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("campusmart_token");

        localStorage.removeItem("campusmart_user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setError(err.response?.data?.message || "Unable to load checkout.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     TOTAL FROM CART ITEMS

     Never depend on cart.subtotal because your cart response
     may not contain it.
  ========================================================= */

  const totalAmount = useMemo(() => {
    if (!cart?.items || !Array.isArray(cart.items)) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      if (!item?.product) {
        return total;
      }

      const price = Number(item.product.price || 0);

      const quantity = Number(item.quantity || 1);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  /* =========================================================
     TOTAL ITEMS
  ========================================================= */

  const totalItems = useMemo(() => {
    if (!cart?.items || !Array.isArray(cart.items)) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => total + Number(item?.quantity || 0),
      0,
    );
  }, [cart]);

  /* =========================================================
     LOCATION CHANGE
  ========================================================= */

  const handleLocationChange = (value) => {
    setPickupLocation(value);

    setError("");
    setPaymentError("");
  };

  /* =========================================================
     LOCATION SELECTED
  ========================================================= */

  const handleLocationSelect = (location) => {
    if (!location) {
      return;
    }

    const address =
      location.address || location.formattedAddress || location.placeName || "";

    setPickupLocation(address);

    setPickupCoordinates({
      lat: location.lat ?? location.latitude ?? null,

      lng: location.lng ?? location.longitude ?? null,
    });

    setError("");
    setPaymentError("");
  };

  /* =========================================================
     LOCATION VALIDATION
  ========================================================= */

  const validatePickupLocation = () => {
    if (!pickupLocation.trim()) {
      setError("Please select a pickup location.");

      return false;
    }

    return true;
  };

  /* =========================================================
     CASH ON PICKUP
  ========================================================= */

  const handleCashOrder = async () => {
    const response = await api.post("/orders", {
      pickupLocation: pickupLocation.trim(),

      pickupCoordinates,

      paymentMethod: "Cash on Pickup",

      notes: notes.trim(),
    });

    const orderId = response.data?.order?._id;

    if (!orderId) {
      throw new Error("Order ID was not returned.");
    }

    navigate(`/orders/${orderId}`, {
      replace: true,
    });
  };

  /* =========================================================
     ONLINE PAYMENT
  ========================================================= */

  const handleOnlinePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error("Razorpay Checkout could not be loaded.");
    }

    /* =====================================================
         STEP 1 — CREATE CAMPUSMART ORDER
      ===================================================== */

    const orderResponse = await api.post("/orders", {
      pickupLocation: pickupLocation.trim(),

      pickupCoordinates,

      paymentMethod: "Online",

      notes: notes.trim(),
    });

    const campusMartOrder = orderResponse.data?.order;

    const campusMartOrderId = campusMartOrder?._id;

    if (!campusMartOrderId) {
      throw new Error("CampusMart order ID was not returned.");
    }

    /* =====================================================
         STEP 2 — CREATE RAZORPAY ORDER
      ===================================================== */

    const paymentOrderResponse = await api.post("/payments/create-order", {
      orderId: campusMartOrderId,
    });

    const paymentData = paymentOrderResponse.data;

    if (!paymentData?.success || !paymentData?.orderId) {
      throw new Error(
        paymentData?.message || "Unable to create Razorpay order.",
      );
    }

    /* =====================================================
         STEP 3 — USER DATA
      ===================================================== */

    let userData = {};

    try {
      userData = JSON.parse(localStorage.getItem("campusmart_user") || "{}");
    } catch {
      userData = {};
    }

    /* =====================================================
         STEP 4 — RAZORPAY OPTIONS
      ===================================================== */

    const options = {
      key: paymentData.keyId,

      amount: paymentData.amount,

      currency: paymentData.currency || "INR",

      name: "CampusMart",

      description: `CampusMart Order ${campusMartOrder?.orderNumber || ""}`,

      order_id: paymentData.orderId,

      prefill: {
        name: userData?.name || "",

        email: userData?.email || "",

        contact: userData?.phone || userData?.phoneNumber || "",
      },

      notes: {
        campusmart_order_id: String(campusMartOrderId),
      },

      theme: {
        color: "#2563eb",
      },

      modal: {
        escape: true,

        ondismiss: () => {
          setPlacingOrder(false);

          setPaymentError(
            "Payment window was closed. Your order is still pending. You can retry the payment.",
          );
        },
      },

      /* ===================================================
           PAYMENT SUCCESS
        =================================================== */

      handler: async (razorpayResponse) => {
        try {
          setPaymentError("");

          const verifyResponse = await api.post("/payments/verify", {
            campusMartOrderId,

            razorpay_order_id: razorpayResponse.razorpay_order_id,

            razorpay_payment_id: razorpayResponse.razorpay_payment_id,

            razorpay_signature: razorpayResponse.razorpay_signature,
          });

          if (!verifyResponse.data?.success) {
            throw new Error(
              verifyResponse.data?.message || "Payment verification failed.",
            );
          }

          const paidOrderId =
            verifyResponse.data?.order?._id || campusMartOrderId;

          navigate(`/orders/${paidOrderId}`, {
            replace: true,
          });
        } catch (verificationError) {
          console.error("Payment Verification Error:", verificationError);

          setPlacingOrder(false);

          setPaymentError(
            verificationError.response?.data?.message ||
              verificationError.message ||
              "Payment verification failed.",
          );
        }
      },
    };

    /* =====================================================
         STEP 5 — OPEN RAZORPAY
      ===================================================== */

    if (typeof window.Razorpay !== "function") {
      throw new Error(
        "Razorpay is not available. Please refresh the page and try again.",
      );
    }

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.error("Razorpay Payment Failed:", response);

      setPlacingOrder(false);

      setPaymentError(
        response?.error?.description || "Payment failed. Please try again.",
      );
    });

    razorpay.open();
  };

  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");
    setPaymentError("");

    if (!validatePickupLocation()) {
      return;
    }

    if (!cart?.items?.length) {
      setError("Your cart is empty.");

      return;
    }

    if (totalAmount <= 0) {
      setError("Order total must be greater than ₹0.");

      return;
    }

    try {
      setPlacingOrder(true);

      if (paymentMethod === "Cash on Pickup") {
        await handleCashOrder();
      } else {
        await handleOnlinePayment();
      }
    } catch (err) {
      console.error("Checkout Error:", err);

      setPlacingOrder(false);

      setError(
        err.response?.data?.message || err.message || "Unable to place order.",
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-52 rounded bg-slate-200 dark:bg-slate-800" />

            <div className="h-96 rounded-2xl bg-white dark:bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Package size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
                Checkout
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complete your campus order.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ERROR */}

        {error && (
          <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <XCircle size={18} className="shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* PAYMENT ERROR */}

        {paymentError && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            {paymentError}
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* =================================================
                PICKUP LOCATION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <MapPin
                    size={19}
                    className="text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Campus Pickup
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Use your current location or search for a pickup point.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Pickup Location
                </label>

                <LocationPicker
                  value={pickupLocation}
                  onChange={handleLocationChange}
                  onLocationSelect={handleLocationSelect}
                  showMap={true}
                  placeholder="Search campus pickup location"
                />

                {pickupCoordinates.lat !== null &&
                  pickupCoordinates.lng !== null && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={15}
                          className="text-emerald-600 dark:text-emerald-400"
                        />

                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Pickup location selected successfully.
                        </p>
                      </div>

                      <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                        Coordinates: {pickupCoordinates.lat.toFixed(6)},{" "}
                        {pickupCoordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
              </div>
            </section>

            {/* =================================================
                PAYMENT METHOD
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <CreditCard
                    size={19}
                    className="text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Payment Method
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select how you want to pay.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {/* CASH */}

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "Cash on Pickup" ?
                      "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Pickup"
                    checked={paymentMethod === "Cash on Pickup"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Cash on Pickup
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pay directly when collecting the product.
                    </p>
                  </div>
                </label>

                {/* ONLINE */}

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "Online" ?
                      "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Online Payment
                      </p>

                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                        Razorpay
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Secure payment through Razorpay.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* =================================================
                NOTES
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Order Notes
              </h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional note for the seller..."
                rows={4}
                maxLength={500}
                className="mt-4 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />

              <p className="mt-1 text-right text-[10px] text-slate-400">
                {notes.length}/500
              </p>
            </section>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Order Summary
            </h2>

            {/* ITEMS */}

            <div className="mt-5 space-y-4">
              {cart.items.map((item) => {
                if (!item?.product) {
                  return null;
                }

                const product = item.product;

                const quantity = Number(item.quantity || 1);

                const itemTotal = Number(product.price || 0) * quantity;

                return (
                  <div key={product._id} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
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
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {product.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Qty: {quantity}
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

            {/* ITEMS */}

            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Items</span>

              <span className="font-semibold text-slate-900 dark:text-white">
                {totalItems}
              </span>
            </div>

            {/* SUBTOTAL */}

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Subtotal
              </span>

              <span className="font-semibold text-slate-900 dark:text-white">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* PICKUP */}

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Campus Pickup
              </span>

              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Free
              </span>
            </div>

            <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

            {/* TOTAL */}

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                Total
              </span>

              <span className="text-2xl font-bold text-slate-950 dark:text-white">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* ONLINE INFO */}

            {paymentMethod === "Online" && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/10">
                <div className="flex gap-2">
                  <CreditCard
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  />

                  <p className="text-xs leading-5 font-semibold text-blue-700 dark:text-blue-300">
                    Razorpay Test Mode will open for this payment.
                  </p>
                </div>
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={placingOrder || totalAmount <= 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder ?
                <>
                  <Loader2 size={18} className="animate-spin" />

                  {paymentMethod === "Online" ?
                    "Opening Payment..."
                  : "Placing Order..."}
                </>
              : <>
                  {paymentMethod === "Online" ?
                    <>
                      <CreditCard size={18} />
                      Pay ₹{totalAmount.toLocaleString("en-IN")}
                    </>
                  : <>
                      <CheckCircle2 size={18} />
                      Place Order
                    </>
                  }
                </>
              }
            </button>

            {/* SECURITY */}

            <div className="mt-5 flex gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <ShieldCheck
                size={19}
                className="shrink-0 text-slate-600 dark:text-slate-300"
              />

              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Payment verification is handled securely on the CampusMart
                server.
              </p>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
