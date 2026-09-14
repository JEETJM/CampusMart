import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchOrder();
  }, [id, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data?.order || response.data?.data || null);
    } catch (err) {
      console.error("Order Details Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("campusmart_token");
        localStorage.removeItem("campusmart_user");

        navigate("/login", { replace: true });
        return;
      }

      setError(err.response?.data?.message || "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      const response = await api.put(`/orders/${id}/cancel`);

      setOrder(response.data?.order || response.data?.data || order);
    } catch (err) {
      console.error("Cancel Order Error:", err);

      setError(err.response?.data?.message || "Unable to cancel this order.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Placed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Confirmed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Ready for Pickup":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="h-40 rounded-2xl bg-white" />
            <div className="h-80 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <XCircle size={40} className="mx-auto text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const canCancel = !["Completed", "Cancelled"].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Order Header */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Order
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                #{order.orderNumber}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-bold ${getStatusClass(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>
        </section>

        {/* Status */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Order Status</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {["Placed", "Confirmed", "Ready for Pickup", "Completed"].map(
              (status, index) => {
                const statusOrder = [
                  "Placed",
                  "Confirmed",
                  "Ready for Pickup",
                  "Completed",
                ];

                const currentIndex = statusOrder.indexOf(order.orderStatus);

                const active = currentIndex >= index;

                return (
                  <div key={status} className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        active ?
                          "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {active ?
                        <CheckCircle2 size={17} />
                      : <Clock3 size={17} />}
                    </div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          active ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          {order.orderStatus === "Cancelled" && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <XCircle size={19} />
              This order has been cancelled.
            </div>
          )}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900">Order Items</h2>

            <div className="mt-5 divide-y divide-slate-100">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.product}-${index}`}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {item.image ?
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    : <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Package size={25} />
                      </div>
                    }
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    ₹
                    {(Number(item.price || 0) * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-semibold text-slate-900">
                  ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Pickup</span>

                <span className="font-semibold text-emerald-600">Free</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Total</span>

                  <span className="text-lg font-bold text-slate-900">
                    ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-slate-500" />

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Pickup Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {order.pickupLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-400">Payment</p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {order.paymentMethod}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Status: {order.paymentStatus}
              </p>
            </div>

            {order.notes && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400">Notes</p>

                <p className="mt-1 text-sm text-slate-700">{order.notes}</p>
              </div>
            )}

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XCircle size={17} />
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
