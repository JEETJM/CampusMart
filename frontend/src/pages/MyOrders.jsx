import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders/my");

      setOrders(response.data?.orders || []);
    } catch (err) {
      console.error("Orders Error:", err);

      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-700";
    }

    if (status === "Ready for Pickup") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-slate-200" />
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShoppingBag size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>

              <p className="text-sm text-slate-500">
                Track your CampusMart purchases.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ?
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Package size={38} className="mx-auto text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your completed and active orders will appear here.
            </p>

            <Link
              to="/marketplace"
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Marketplace
            </Link>
          </div>
        : <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Package size={21} className="text-slate-700" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.orderNumber}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={13} />

                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </span>

                        <span>
                          {order.items?.length || 0} item
                          {order.items?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <ChevronRight size={19} className="text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }
      </main>
    </div>
  );
};

export default MyOrders;
