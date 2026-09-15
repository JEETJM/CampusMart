import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";

import api from "../services/api";

const statusSteps = ["Placed", "Confirmed", "Ready for Pickup", "Completed"];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/orders/${id}`);

        setOrder(response.data?.order || response.data);
      } catch (err) {
        console.error("Order Details Error:", err);

        setError(
          err.response?.data?.message || "Unable to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await api.put(`/orders/${id}/cancel`);

      setOrder(response.data?.order || response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel this order.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "We could not find this order."}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            My Orders
          </button>

          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Order Number
            </p>

            <p className="font-bold text-slate-900">{order.orderNumber}</p>
          </div>
        </div>

        {/* Order status */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Order Status</p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {order.orderStatus}
              </h1>
            </div>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {order.paymentStatus}
            </span>
          </div>

          {order.orderStatus !== "Cancelled" && (
            <div className="mt-8 grid grid-cols-4 gap-2">
              {statusSteps.map((step, index) => {
                const completed = currentStatusIndex >= index;

                return (
                  <div key={step} className="relative">
                    <div className="flex items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          completed ?
                            "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      {index < statusSteps.length - 1 && (
                        <div
                          className={`h-1 flex-1 ${
                            currentStatusIndex > index ? "bg-slate-900" : (
                              "bg-slate-100"
                            )
                          }`}
                        />
                      )}
                    </div>

                    <p className="mt-2 text-xs font-medium text-slate-600">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {order.orderStatus === "Cancelled" && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
              This order has been cancelled.
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-700" />

            <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {order.items?.map((item) => (
              <div key={item.product} className="flex gap-4 py-5">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                  }
                  alt={item.title}
                  className="h-20 w-20 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Total</p>

                  <p className="mt-1 font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup + payment */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-700" />

              <h2 className="font-bold text-slate-900">Pickup Location</h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {order.pickupLocation}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-slate-700" />

              <h2 className="font-bold text-slate-900">Order Information</h2>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Date</span>

                <span className="font-medium text-slate-900">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Payment</span>

                <span className="font-medium text-slate-900">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Items</span>

                <span className="font-medium text-slate-900">
                  {order.items?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Payment Summary</h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>

              <span className="font-medium text-slate-900">
                ₹{order.subtotal?.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">Total</span>

                <span className="text-xl font-bold text-slate-900">
                  ₹{order.subtotal?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {order.orderStatus === "Placed" && (
            <button
              onClick={handleCancel}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Cancel Order
            </button>
          )}

          {order.orderStatus === "Ready for Pickup" && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <Clock3 className="h-5 w-5" />
              Your order is ready for campus pickup.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
