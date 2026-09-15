import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  User,
  XCircle,
} from "lucide-react";

import api from "../services/api";

const SellerOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchSellerOrders();
  }, [navigate]);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/seller/my");

      setOrders(response.data?.orders || []);
    } catch (err) {
      console.error("Seller Orders Error:", err);

      setError(err.response?.data?.message || "Unable to load seller orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      const response = await api.put(`/orders/${orderId}/seller-status`, {
        orderStatus: status,
      });

      const updatedOrder = response.data?.order;

      if (updatedOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId ?
              {
                ...order,
                orderStatus: updatedOrder.orderStatus,
                updatedAt: updatedOrder.updatedAt,
              }
            : order,
          ),
        );
      }
    } catch (err) {
      console.error("Update Status Error:", err);

      alert(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-700";
    }

    if (status === "Ready for Pickup") {
      return "bg-blue-50 text-blue-700";
    }

    if (status === "Confirmed") {
      return "bg-violet-50 text-violet-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-52 animate-pulse rounded-3xl bg-slate-200" />
          <div className="mt-6 h-52 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/profile")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Profile
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Seller Orders
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage orders for products you have listed.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No sales yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Orders for your products will appear here.
            </p>

            <Link
              to="/sell"
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              List a Product
            </Link>
          </div>
        )}

        {/* Orders */}
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Top */}
              <div className="border-b border-slate-100 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Order
                    </p>

                    <h2 className="mt-1 font-bold text-slate-900">
                      {order.orderNumber}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Buyer */}
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <User className="h-4 w-4" />
                      Buyer
                    </div>

                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {order.buyer?.name || "Student"}
                    </p>

                    {order.buyer?.studentId && (
                      <p className="mt-1 text-xs text-slate-500">
                        ID: {order.buyer.studentId}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MapPin className="h-4 w-4" />
                      Pickup
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {order.pickupLocation}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Payment
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {order.paymentMethod}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Status: {order.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-900">
                    Your Products
                  </h3>

                  <div className="mt-4 space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={`${order._id}-${item.product}`}
                        className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3"
                      >
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                          }
                          alt={item.title}
                          className="h-16 w-16 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">
                            {item.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-bold text-slate-900">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-xs text-slate-400">Your Sale Total</p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      ₹{order.subtotal?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.orderStatus === "Placed" && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() => updateStatus(order._id, "Confirmed")}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm Order
                      </button>
                    )}

                    {order.orderStatus === "Confirmed" && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() =>
                          updateStatus(order._id, "Ready for Pickup")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Clock3 className="h-4 w-4" />
                        Ready for Pickup
                      </button>
                    )}

                    {order.orderStatus === "Ready for Pickup" && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() => updateStatus(order._id, "Completed")}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Completed
                      </button>
                    )}

                    {(order.orderStatus === "Placed" ||
                      order.orderStatus === "Confirmed") && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() => updateStatus(order._id, "Cancelled")}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
