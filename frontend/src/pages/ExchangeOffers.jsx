import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";

import api from "../services/api";

const ExchangeOffers = () => {
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
      const response = await api.get("/exchange/received");

      setOffers(response.data?.offers || []);
    } catch (error) {
      console.error("Received Exchange Offers Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOffer = async (id, action) => {
    try {
      const response = await api.put(`/exchange/${id}/${action}`);

      const updatedOffer = response.data?.offer;

      setOffers((current) =>
        current.map((offer) =>
          offer._id === id ?
            {
              ...offer,
              status:
                updatedOffer?.status ||
                (action === "accept" ? "Accepted" : "Rejected"),
            }
          : offer,
        ),
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to update exchange offer.",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
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

        <div className="mt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <ArrowRightLeft className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Exchange Offers
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review exchange requests from students.
              </p>
            </div>
          </div>
        </div>

        {offers.length === 0 ?
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <ArrowRightLeft className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No exchange offers
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Offers for your exchange products will appear here.
            </p>
          </div>
        : <div className="mt-8 space-y-5">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {offer.buyer?.name || "Student"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      wants your product
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                    {offer.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Your Product
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {offer.product?.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      ₹{offer.product?.price?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Offered Product
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {offer.offeredProduct?.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      ₹{offer.offeredProduct?.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {offer.message && (
                  <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Message
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {offer.message}
                    </p>
                  </div>
                )}

                {offer.status === "Pending" && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => updateOffer(offer._id, "accept")}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Accept
                    </button>

                    <button
                      onClick={() => updateOffer(offer._id, "reject")}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
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

export default ExchangeOffers;
