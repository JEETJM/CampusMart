import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
} from "lucide-react";

import api from "../services/api";

const ExchangeOffers = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [counterOpen, setCounterOpen] = useState(null);

  const [counterProductId, setCounterProductId] = useState("");

  const [counterMessage, setCounterMessage] = useState("");

  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [offersResponse, productsResponse] = await Promise.all([
        api.get("/exchange/received"),
        api.get("/exchange/my-products"),
      ]);

      setOffers(offersResponse.data?.offers || []);

      setMyProducts(productsResponse.data?.products || []);
    } catch (error) {
      console.error("Exchange Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOffer = async (id, action) => {
    try {
      setActionLoading(id);

      const response = await api.put(`/exchange/${id}/${action}`);

      const updatedOffer = response.data?.offer;

      setOffers((current) =>
        current.map((offer) =>
          offer._id === id ?
            {
              ...offer,
              ...updatedOffer,
            }
          : offer,
        ),
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to update exchange offer.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const sendCounterOffer = async (id) => {
    if (!counterProductId) {
      alert("Please select a counter product.");
      return;
    }

    try {
      setActionLoading(id);

      const response = await api.put(`/exchange/${id}/counter`, {
        counterProductId,
        message: counterMessage,
      });

      const updatedOffer = response.data?.offer;

      setOffers((current) =>
        current.map((offer) =>
          offer._id === id ?
            {
              ...offer,
              ...updatedOffer,
            }
          : offer,
        ),
      );

      setCounterOpen(null);
      setCounterProductId("");
      setCounterMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send counter offer.");
    } finally {
      setActionLoading("");
    }
  };

  const openCounter = (offer) => {
    const availableProducts = myProducts.filter(
      (product) => product._id !== offer.product?._id,
    );

    if (availableProducts.length === 0) {
      alert("You need another available product to send a counter offer.");
      return;
    }

    setCounterOpen(offer._id);
    setCounterProductId("");
    setCounterMessage("");
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

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <ArrowRightLeft className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Exchange Offers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review and negotiate exchange requests from students.
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
                      sent you an exchange request
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
                      Student Offered
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
                      Student Message
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {offer.message}
                    </p>
                  </div>
                )}

                {offer.status === "Pending" && (
                  <>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateOffer(offer._id, "accept")}
                        disabled={actionLoading === offer._id}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </button>

                      <button
                        onClick={() => updateOffer(offer._id, "reject")}
                        disabled={actionLoading === offer._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>

                      <button
                        onClick={() => openCounter(offer)}
                        disabled={actionLoading === offer._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-5 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Counter Offer
                      </button>
                    </div>

                    {counterOpen === offer._id && (
                      <div className="mt-5 rounded-3xl border border-violet-200 bg-violet-50 p-5">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="h-5 w-5 text-violet-700" />

                          <h3 className="font-bold text-violet-900">
                            Send Counter Offer
                          </h3>
                        </div>

                        <div className="mt-5">
                          <label className="text-sm font-semibold text-slate-700">
                            Choose your product
                          </label>

                          <select
                            value={counterProductId}
                            onChange={(e) =>
                              setCounterProductId(e.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
                          >
                            <option value="">Select product</option>

                            {myProducts
                              .filter(
                                (product) => product._id !== offer.product?._id,
                              )
                              .map((product) => (
                                <option key={product._id} value={product._id}>
                                  {product.title}
                                  {" — ₹"}
                                  {product.price?.toLocaleString("en-IN")}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="mt-4">
                          <label className="text-sm font-semibold text-slate-700">
                            Message
                          </label>

                          <textarea
                            value={counterMessage}
                            onChange={(e) => setCounterMessage(e.target.value)}
                            rows={3}
                            maxLength={1000}
                            placeholder="Write your counter offer message..."
                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            onClick={() => sendCounterOffer(offer._id)}
                            disabled={actionLoading === offer._id}
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                            Send Counter
                          </button>

                          <button
                            onClick={() => {
                              setCounterOpen(null);
                              setCounterProductId("");
                              setCounterMessage("");
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {offer.status === "Countered" && offer.counterProduct && (
                  <div className="mt-5 rounded-3xl border border-violet-200 bg-violet-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                      Counter Offer Sent
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {offer.counterProduct?.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      ₹{offer.counterProduct?.price?.toLocaleString("en-IN")}
                    </p>

                    {offer.counterMessage && (
                      <p className="mt-3 text-sm text-slate-600">
                        {offer.counterMessage}
                      </p>
                    )}
                  </div>
                )}

                {offer.status === "Accepted" && (
                  <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Exchange accepted successfully.
                  </div>
                )}

                {offer.status === "Rejected" && (
                  <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                    This exchange offer was rejected.
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
