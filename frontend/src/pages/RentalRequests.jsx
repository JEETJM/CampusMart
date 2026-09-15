import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Package,
  Play,
  RefreshCw,
  RotateCcw,
  X,
} from "lucide-react";

import api from "../services/api";

function RentalRequests() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rentals/received");

      const data = response.data?.rentals || response.data?.data || [];

      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Rental Requests Error:", err);

      setError(
        err.response?.data?.message || "Unable to load rental requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const performAction = async (rentalId, action, successMessage) => {
    try {
      setProcessingId(rentalId);
      setError("");
      setMessage("");

      await api.put(`/rentals/${rentalId}/${action}`);

      setMessage(successMessage);

      await loadRequests();
    } catch (err) {
      console.error("Rental Action Error:", err);

      setError(err.response?.data?.message || "Unable to update rental.");
    } finally {
      setProcessingId("");
    }
  };

  const getProductName = (rental) => {
    return rental.product?.title || rental.product?.name || "Rental Product";
  };

  const getProductImage = (rental) => {
    return rental.product?.images?.[0] || rental.product?.image || "";
  };

  const buttonBase =
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-900 dark:bg-[#070d18] dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Seller Rentals
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Rental Requests
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage students requesting your products.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className={`${buttonBase} border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
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

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Loading requests...
            </p>
          </div>
        : rentals.length === 0 ?
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <Clock3 size={38} className="mx-auto text-slate-400" />

            <h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
              No rental requests
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Incoming rental requests will appear here.
            </p>
          </div>
        : <div className="grid gap-5">
            {rentals.map((rental) => {
              const image = getProductImage(rental);

              const busy = processingId === rental._id;

              return (
                <article
                  key={rental._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {image ?
                            <img
                              src={image}
                              alt={getProductName(rental)}
                              className="h-full w-full object-cover"
                            />
                          : <div className="flex h-full items-center justify-center">
                              <Package size={28} className="text-slate-400" />
                            </div>
                          }
                        </div>

                        <div>
                          <h2 className="text-lg font-black text-slate-900 dark:text-white">
                            {getProductName(rental)}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Request ID: {rental._id}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Renter:{" "}
                            {rental.renter?.name ||
                              rental.renter?.email ||
                              "Student"}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {rental.status}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <p className="text-xs text-slate-400">Start</p>

                        <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                          {rental.startDate ?
                            new Date(rental.startDate).toLocaleDateString()
                          : "-"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <p className="text-xs text-slate-400">End</p>

                        <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                          {rental.endDate ?
                            new Date(rental.endDate).toLocaleDateString()
                          : "-"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <p className="text-xs text-slate-400">Days</p>

                        <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                          {rental.rentalDays || 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <p className="text-xs text-slate-400">Total</p>

                        <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                          ₹
                          {Number(rental.totalAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>

                    {rental.renterMessage && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Renter Message
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {rental.renterMessage}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                      {rental.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              performAction(
                                rental._id,
                                "approve",
                                "Rental request approved.",
                              )
                            }
                            className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
                          >
                            <Check size={16} />
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              performAction(
                                rental._id,
                                "reject",
                                "Rental request rejected.",
                              )
                            }
                            className={`${buttonBase} bg-red-600 text-white hover:bg-red-700`}
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </>
                      )}

                      {rental.status === "Approved" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            performAction(
                              rental._id,
                              "start",
                              "Rental has been started.",
                            )
                          }
                          className={`${buttonBase} bg-blue-600 text-white hover:bg-blue-700`}
                        >
                          <Play size={16} />
                          Start Rental
                        </button>
                      )}

                      {rental.status === "Active" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            performAction(
                              rental._id,
                              "return",
                              "Rental marked as returned.",
                            )
                          }
                          className={`${buttonBase} bg-indigo-600 text-white hover:bg-indigo-700`}
                        >
                          <RotateCcw size={16} />
                          Mark Returned
                        </button>
                      )}
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

export default RentalRequests;
