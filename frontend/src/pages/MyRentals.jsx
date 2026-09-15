import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  XCircle,
} from "lucide-react";

import api from "../services/api";

function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rentals/my");

      const data = response.data?.rentals || response.data?.data || [];

      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("My Rentals Error:", err);

      setError(err.response?.data?.message || "Unable to load your rentals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const statusStyle = useMemo(() => {
    return {
      Pending:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
      Approved:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
      Active:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
      Returned:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20",
      Completed:
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      Rejected:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
      Cancelled:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
    };
  }, []);

  const getProductName = (rental) => {
    return rental.product?.title || rental.product?.name || "Rental Product";
  };

  const getProductImage = (rental) => {
    return rental.product?.images?.[0] || rental.product?.image || "";
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-900 dark:bg-[#070d18] dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Rentals
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              My Rentals
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track the products you requested to rent.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRentals}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ?
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading rentals...
            </p>
          </div>
        : rentals.length === 0 ?
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <Package size={38} className="mx-auto text-slate-400" />

            <h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
              No rentals yet
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Products you request for rent will appear here.
            </p>
          </div>
        : <div className="grid gap-5">
            {rentals.map((rental) => {
              const productImage = getProductImage(rental);

              return (
                <article
                  key={rental._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col gap-5 p-5 md:flex-row">
                    <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 md:w-48">
                      {productImage ?
                        <img
                          src={productImage}
                          alt={getProductName(rental)}
                          className="h-full w-full object-cover"
                        />
                      : <div className="flex h-full items-center justify-center">
                          <Package size={34} className="text-slate-400" />
                        </div>
                      }
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-xl font-black text-slate-900 dark:text-white">
                            {getProductName(rental)}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Rental ID: {rental._id}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                            statusStyle[rental.status] ||
                            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {rental.status === "Approved" ?
                            <CheckCircle2 size={14} />
                          : rental.status === "Rejected" ?
                            <XCircle size={14} />
                          : <Clock3 size={14} />}

                          {rental.status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                          <p className="text-xs font-semibold text-slate-400">
                            Start Date
                          </p>

                          <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                            {rental.startDate ?
                              new Date(rental.startDate).toLocaleDateString()
                            : "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                          <p className="text-xs font-semibold text-slate-400">
                            End Date
                          </p>

                          <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                            {rental.endDate ?
                              new Date(rental.endDate).toLocaleDateString()
                            : "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                          <p className="text-xs font-semibold text-slate-400">
                            Rental Days
                          </p>

                          <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                            {rental.rentalDays || 0}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                          <p className="text-xs font-semibold text-slate-400">
                            Total
                          </p>

                          <p className="mt-1 font-black text-slate-900 dark:text-white">
                            ₹
                            {Number(rental.totalAmount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarDays size={14} />

                        <span>
                          Requested on{" "}
                          {rental.createdAt ?
                            new Date(rental.createdAt).toLocaleDateString()
                          : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        }
      </div>
    </main>
  );
}

export default MyRentals;
