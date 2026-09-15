import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Loader2,
  MessageSquare,
  Star,
  Trash2,
  X,
} from "lucide-react";

import api from "../services/api";

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  /* =========================================================
     AUTH
  ========================================================= */

  const token = localStorage.getItem("campusmart_token");

  /* =========================================================
     REVIEW DATA
  ========================================================= */

  const [myReview, setMyReview] = useState(null);

  const [reviewEligibility, setReviewEligibility] = useState(null);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  /* =========================================================
     STAR HOVER
  ========================================================= */

  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  /* =========================================================
     LOAD REVIEWS
  ========================================================= */

  const loadReviews = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/reviews/product/${productId}`);

      const data = response.data || {};

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);

      setAverageRating(Number(data.averageRating || 0));

      setReviewCount(Number(data.reviewCount || 0));
    } catch (err) {
      console.error("Reviews Load Error:", err);

      setError(err.response?.data?.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD MY REVIEW
  ========================================================= */

  const loadMyReview = async () => {
    if (!productId || !token) {
      setMyReview(null);
      return;
    }

    try {
      const response = await api.get(`/reviews/product/${productId}/mine`);

      setMyReview(response.data?.review || null);
    } catch (err) {
      console.error("My Review Error:", err);

      setMyReview(null);
    }
  };

  /* =========================================================
     CHECK REVIEW ELIGIBILITY
  ========================================================= */

  const checkEligibility = async () => {
    if (!productId || !token) {
      setReviewEligibility({
        eligible: false,
        alreadyReviewed: false,
        type: null,
        transactionId: null,
        message: "Login required to review this product.",
      });

      return;
    }

    try {
      setEligibilityLoading(true);

      const response = await api.get(
        `/reviews/product/${productId}/eligibility`,
      );

      setReviewEligibility(
        response.data || {
          eligible: false,
          alreadyReviewed: false,
        },
      );
    } catch (err) {
      console.error("Review Eligibility Error:", err);

      setReviewEligibility({
        eligible: false,
        alreadyReviewed: false,
        type: null,
        transactionId: null,
        message:
          err.response?.data?.message || "Unable to check review eligibility.",
      });
    } finally {
      setEligibilityLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadReviews();
    loadMyReview();
    checkEligibility();
  }, [productId, token]);

  /* =========================================================
     CREATE FORM
  ========================================================= */

  const openCreateForm = () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!reviewEligibility?.eligible || reviewEligibility?.alreadyReviewed) {
      setError(
        reviewEligibility?.message ||
          "You are not eligible to review this product.",
      );

      return;
    }

    setEditingReview(null);

    setFormData({
      rating: 5,
      title: "",
      comment: "",
    });

    setHoverRating(0);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* =========================================================
     EDIT FORM
  ========================================================= */

  const openEditForm = () => {
    if (!myReview) return;

    setEditingReview(myReview);

    setFormData({
      rating: myReview.rating || 5,
      title: myReview.title || "",
      comment: myReview.comment || "",
    });

    setHoverRating(0);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {
    if (submitting) return;

    setShowForm(false);
    setEditingReview(null);
    setHoverRating(0);

    setFormData({
      rating: 5,
      title: "",
      comment: "",
    });
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================================================
     RATING
  ========================================================= */

  const handleRating = (value) => {
    setFormData((previous) => ({
      ...previous,
      rating: value,
    }));

    setHoverRating(0);
    setError("");
  };

  /* =========================================================
     SUBMIT REVIEW
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const comment = formData.comment.trim();

    if (!comment) {
      setError("Please write a review.");
      return;
    }

    const rating = Number(formData.rating);

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);

      /* =====================================================
         UPDATE EXISTING REVIEW
      ===================================================== */

      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, {
          rating,
          title: formData.title.trim(),
          comment,
        });

        setSuccess("Review updated successfully.");
      } else {

      /* =====================================================
         CREATE VERIFIED REVIEW
      ===================================================== */
        if (
          !reviewEligibility?.eligible ||
          reviewEligibility?.alreadyReviewed
        ) {
          setError(
            reviewEligibility?.message ||
              "You are not eligible to review this product.",
          );

          return;
        }

        const payload = {
          productId,
          rating,
          title: formData.title.trim(),
          comment,
        };

        /* ---------------------------------------------------
           PURCHASE
        --------------------------------------------------- */

        if (reviewEligibility.type === "purchase") {
          payload.orderId = reviewEligibility.transactionId;
        }

        /* ---------------------------------------------------
           RENTAL
        --------------------------------------------------- */

        if (reviewEligibility.type === "rental") {
          payload.rentalId = reviewEligibility.transactionId;
        }

        await api.post("/reviews", payload);

        setSuccess("Verified review submitted successfully.");
      }

      /* =====================================================
         REFRESH EVERYTHING
      ===================================================== */

      await loadReviews();
      await loadMyReview();
      await checkEligibility();

      setShowForm(false);
      setEditingReview(null);
      setHoverRating(0);

      setFormData({
        rating: 5,
        title: "",
        comment: "",
      });
    } catch (err) {
      console.error("Review Submit Error:", err);

      setError(err.response?.data?.message || "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE REVIEW
  ========================================================= */

  const handleDelete = async () => {
    if (!myReview || deleting) {
      return;
    }

    const confirmed = window.confirm("Delete your review?");

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await api.delete(`/reviews/${myReview._id}`);

      setMyReview(null);

      setSuccess("Review deleted successfully.");

      await loadReviews();
      await loadMyReview();
      await checkEligibility();
    } catch (err) {
      console.error("Delete Review Error:", err);

      setError(err.response?.data?.message || "Unable to delete review.");
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     RATING LABEL
  ========================================================= */

  const selectedRating = Number(hoverRating || formData.rating);

  const ratingLabel =
    selectedRating === 1 ? "Poor"
    : selectedRating === 2 ? "Fair"
    : selectedRating === 3 ? "Good"
    : selectedRating === 4 ? "Very Good"
    : "Excellent";

  return (
    <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Community Feedback
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Ratings & Reviews
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            See what students think about this product.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
              <Star size={16} className="fill-amber-400 text-amber-400" />

              <span className="text-sm font-black text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* =================================================
              WRITE REVIEW BUTTON
          ================================================= */}

          {token &&
            !myReview &&
            !eligibilityLoading &&
            reviewEligibility?.eligible &&
            !reviewEligibility?.alreadyReviewed && (
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <MessageSquare size={16} />
                Write Review
              </button>
            )}
        </div>
      </div>

      {/* =====================================================
          ELIGIBILITY INFO
      ===================================================== */}

      {token &&
        !myReview &&
        !eligibilityLoading &&
        reviewEligibility &&
        !reviewEligibility.eligible &&
        !reviewEligibility.alreadyReviewed && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            {reviewEligibility.message ||
              "Complete a purchase or rental before reviewing this product."}
          </div>
        )}

      {!token && (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
          Login to review this product.
        </div>
      )}

      {eligibilityLoading && token && (
        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-400">
          <Loader2 size={15} className="animate-spin" />
          Checking review eligibility...
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !showForm && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* =====================================================
          MY REVIEW
      ===================================================== */}

      {myReview && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                Your Review
              </p>

              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={17}
                    className={`transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 ${
                      star <= myReview.rating ?
                        "fill-amber-400 text-amber-400 drop-shadow-[0_2px_5px_rgba(245,158,11,0.3)]"
                      : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openEditForm}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <Edit3 size={14} />
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                {deleting ?
                  <Loader2 size={14} className="animate-spin" />
                : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>

          {myReview.isVerifiedPurchase && (
            <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 size={12} />
              Verified Transaction
            </div>
          )}

          {myReview.title && (
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
              {myReview.title}
            </h3>
          )}

          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {myReview.comment}
          </p>

          <p className="mt-3 text-[11px] text-slate-400">
            {formatDate(myReview.createdAt)}
          </p>
        </div>
      )}

      {/* =====================================================
          REVIEW FORM
      ===================================================== */}

      {showForm && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingReview ? "Edit your review" : "Write a review"}
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Share your experience with other students.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {!editingReview && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={15} />

                {reviewEligibility?.type === "purchase" ?
                  "Verified purchase review"
                : "Verified rental review"}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* RATING */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                Your Rating
              </label>

              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeRating = hoverRating || Number(formData.rating);

                  const isActive = star <= activeRating;

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => handleRating(star)}
                      className="group rounded-xl p-1.5 outline-none transition-all duration-200 hover:-translate-y-1 hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-400 dark:hover:bg-amber-500/10"
                      aria-label={`${star} star`}
                    >
                      <Star
                        size={30}
                        strokeWidth={1.8}
                        className={`transition-all duration-200 ease-out ${
                          isActive ?
                            "scale-110 fill-amber-400 text-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.35)]"
                          : "text-slate-300 group-hover:scale-105 group-hover:text-amber-300 dark:text-slate-600 dark:group-hover:text-amber-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 h-5">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {ratingLabel}
                </p>
              </div>
            </div>

            {/* TITLE */}

            <div>
              <label
                htmlFor="review-title"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Review Title
              </label>

              <input
                id="review-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="Great product, useful for college..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* COMMENT */}

            <div>
              <label
                htmlFor="review-comment"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Your Review
              </label>

              <textarea
                id="review-comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                placeholder="Tell other students about your experience..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />

              <p className="mt-1 text-right text-[10px] text-slate-400">
                {formData.comment.length}
                /1000
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ?
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                : <>
                    <CheckCircle2 size={16} />
                    {editingReview ? "Update Review" : "Submit Verified Review"}
                  </>
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          REVIEWS LIST
      ===================================================== */}

      <div className="mt-7">
        {loading ?
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={27}
              className="animate-spin text-blue-600 dark:text-blue-400"
            />
          </div>
        : reviews.length === 0 ?
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <MessageSquare size={34} className="mx-auto text-slate-400" />

            <h3 className="mt-4 font-black text-slate-900 dark:text-white">
              No reviews yet
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Be the first student to review this product.
            </p>
          </div>
        : <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.map((review) => {
              const reviewer = review.reviewer;

              const reviewerName = reviewer?.name || "Student";

              const initial = reviewerName.charAt(0).toUpperCase();

              return (
                <article key={review._id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    {/* AVATAR */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-sm font-black text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {reviewer?.profileImage ?
                        <img
                          src={reviewer.profileImage}
                          alt={reviewerName}
                          className="h-full w-full object-cover"
                        />
                      : initial}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {reviewerName}
                            </p>

                            {review.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                <CheckCircle2 size={11} />
                                Verified Transaction
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                strokeWidth={1.8}
                                className={`transition-all duration-200 hover:scale-125 ${
                                  star <= review.rating ?
                                    "fill-amber-400 text-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-[11px] font-medium text-slate-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>

                      {review.title && (
                        <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                          {review.title}
                        </h4>
                      )}

                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        }
      </div>
    </section>
  );
}

export default ProductReviews;
