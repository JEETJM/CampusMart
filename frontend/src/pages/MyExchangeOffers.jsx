import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";

import api from "../services/api";

const MyExchangeOffers = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchOffers();
  }, [navigate]);

  const fetchOffers = async () => {
    try {
      const response = await api.get("/exchange/my");

      setOffers(response.data?.offers || []);
    } catch (error) {
      console.error("Exchange Offers Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOffer = async (id) => {
    try {
      await api.put(`/exchange/${id}/cancel`);

      setOffers((current) =>
        current.map((offer) =>
          offer._id === id ?
            {
              ...offer,
              status: "Cancelled",
            }
          : offer,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Unable to cancel offer.");
    }
  };

  const statusClass = (status) => {
    if (status === "Accepted") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Rejected" || status === "Cancelled") {
      return "bg-red-50 text-red-700";
    }

    if (status === "Countered") {
      return "bg-violet-50 text-violet-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Profile
        </button>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <ArrowRightLeft className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Exchange Offers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track products you have offered for exchange.
            </p>
          </div>
        </div>

        {offers.length === 0 ?
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <ArrowRightLeft className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No exchange offers
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your exchange offers will appear here.
            </p>

            <Link
              to="/marketplace"
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Marketplace
            </Link>
          </div>
        : <div className="mt-8 space-y-5">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Exchange Offer
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Seller:{" "}
                      <span className="font-semibold text-slate-800">
                        {offer.seller?.name || "Student"}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${statusClass(
                      offer.status,
                    )}`}
                  >
                    {offer.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      You want
                    </p>

                    <div className="mt-3 flex gap-3">
                      <img
                        src={
                          offer.product?.images?.[0] ||
                          "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                        }
                        alt={offer.product?.title}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-semibold text-slate-900">
                          {offer.product?.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          ₹{offer.product?.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      You offered
                    </p>

                    <div className="mt-3 flex gap-3">
                      <img
                        src={
                          offer.offeredProduct?.images?.[0] ||
                          "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                        }
                        alt={offer.offeredProduct?.title}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-semibold text-slate-900">
                          {offer.offeredProduct?.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          ₹
                          {offer.offeredProduct?.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {offer.message && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Message
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {offer.message}
                    </p>
                  </div>
                )}

                {offer.status === "Pending" && (
                  <button
                    onClick={() => cancelOffer(offer._id)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Offer
                  </button>
                )}

                {offer.status === "Accepted" && (
                  <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Seller accepted your exchange offer.
                  </div>
                )}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default MyExchangeOffers;
