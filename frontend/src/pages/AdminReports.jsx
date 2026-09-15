import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FileWarning,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  X,
  XCircle,
} from "lucide-react";

import api from "../services/api";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedReport, setSelectedReport] = useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const [updating, setUpdating] = useState(false);

  const [updateStatus, setUpdateStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  /* =========================================================
     LOAD REPORTS
  ========================================================= */

  const loadReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = {};

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (typeFilter !== "All") {
        params.type = typeFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/reports/admin/all", {
        params,
      });

      setReports(response.data?.reports || []);

      setSummary(
        response.data?.summary || {
          total: 0,
          pending: 0,
          underReview: 0,
          resolved: 0,
          rejected: 0,
        },
      );
    } catch (error) {
      console.error("Admin Reports Error:", error);

      setError(error?.response?.data?.message || "Unable to load reports.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter, typeFilter]);

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReports();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================================================
     STATUS CONFIG
  ========================================================= */

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
        };

      case "Under Review":
        return {
          icon: FileWarning,
          className:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
        };

      case "Resolved":
        return {
          icon: CheckCircle2,
          className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
        };

      case "Rejected":
        return {
          icon: XCircle,
          className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
        };

      default:
        return {
          icon: Clock3,
          className:
            "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
        };
    }
  };

  /* =========================================================
     OPEN DETAILS
  ========================================================= */

  const openDetails = async (report) => {
    try {
      setShowDetails(true);
      setSelectedReport(report);

      setUpdateStatus(report.status || "Pending");

      setAdminNote(report.adminNote || "");

      const response = await api.get(`/reports/admin/${report._id}`);

      setSelectedReport(response.data?.report || report);

      setUpdateStatus(
        response.data?.report?.status || report.status || "Pending",
      );

      setAdminNote(response.data?.report?.adminNote || report.adminNote || "");
    } catch (error) {
      console.error("Report Details Error:", error);
    }
  };

  /* =========================================================
     UPDATE REPORT
  ========================================================= */

  const handleUpdateReport = async () => {
    if (!selectedReport?._id) {
      return;
    }

    try {
      setUpdating(true);

      const response = await api.put(`/reports/admin/${selectedReport._id}`, {
        status: updateStatus,
        adminNote: adminNote.trim(),
      });

      const updatedReport = response.data?.report;

      if (updatedReport) {
        setSelectedReport(updatedReport);

        setReports((previous) =>
          previous.map((report) =>
            report._id === updatedReport._id ? updatedReport : report,
          ),
        );
      }

      await loadReports();

      setSelectedReport(updatedReport || selectedReport);
    } catch (error) {
      console.error("Update Report Error:", error);

      setError(error?.response?.data?.message || "Unable to update report.");
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================================
     FILTERED DISPLAY
  ========================================================= */

  const displayedReports = useMemo(() => reports, [reports]);

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  Reports & Safety
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Review and manage CampusMart safety reports.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadReports(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            label="Total Reports"
            value={summary.total}
            icon={ShieldCheck}
          />

          <SummaryCard label="Pending" value={summary.pending} icon={Clock3} />

          <SummaryCard
            label="Under Review"
            value={summary.underReview}
            icon={FileWarning}
          />

          <SummaryCard
            label="Resolved"
            value={summary.resolved}
            icon={CheckCircle2}
          />

          <SummaryCard
            label="Rejected"
            value={summary.rejected}
            icon={XCircle}
          />
        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
            {/* Search */}

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product, user, report ID..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Status</option>

              <option value="Pending">Pending</option>

              <option value="Under Review">Under Review</option>

              <option value="Resolved">Resolved</option>

              <option value="Rejected">Rejected</option>
            </select>

            {/* Type */}

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Types</option>

              <option value="Product">Product</option>

              <option value="User">User</option>
            </select>

            {/* Filter icon */}

            <div className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <Filter size={17} />
            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* =====================================================
            REPORT LIST
        ===================================================== */}

        <div className="mt-6">
          {loading ?
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-900"
                />
              ))}
            </div>
          : displayedReports.length === 0 ?
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <ShieldCheck size={29} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                No reports found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try changing your filters or search query.
              </p>
            </div>
          : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Desktop heading */}

              <div className="hidden grid-cols-[minmax(0,1.5fr)_160px_150px_140px_90px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/60 md:grid">
                <span>Report</span>
                <span>Reporter</span>
                <span>Reason</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedReports.map((report) => {
                  const status = getStatusConfig(report.status);

                  const StatusIcon = status.icon;

                  const targetName =
                    report.type === "Product" ?
                      report.product?.title || "Product"
                    : report.reportedUser?.name || "User";

                  return (
                    <div
                      key={report._id}
                      className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1.5fr)_160px_150px_140px_90px] md:items-center"
                    >
                      {/* Report */}

                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {(
                            report.type === "Product" &&
                            report.product?.images?.[0]
                          ) ?
                            <img
                              src={report.product.images[0]}
                              alt={targetName}
                              className="h-full w-full object-cover"
                            />
                          : <AlertTriangle
                              size={19}
                              className="text-slate-400"
                            />
                          }
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {report.type}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {formatDate(report.createdAt)}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">
                            {targetName}
                          </p>

                          <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
                            {report._id}
                          </p>
                        </div>
                      </div>

                      {/* Reporter */}

                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          <User size={15} />
                        </div>

                        <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {report.reporter?.name || "Unknown"}
                        </span>
                      </div>

                      {/* Reason */}

                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {report.reason}
                      </div>

                      {/* Status */}

                      <div
                        className={`inline-flex w-fit items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold ${status.className}`}
                      >
                        <StatusIcon size={13} />
                        {report.status}
                      </div>

                      {/* Action */}

                      <button
                        type="button"
                        onClick={() => openDetails(report)}
                        className="inline-flex w-fit items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          }
        </div>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {showDetails && selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* Header */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Report Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Review this report and take moderation action.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Target */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Reported {selectedReport.type}
                </p>

                <div className="mt-3 flex gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white dark:bg-slate-900">
                    {(
                      selectedReport.type === "Product" &&
                      selectedReport.product?.images?.[0]
                    ) ?
                      <img
                        src={selectedReport.product.images[0]}
                        alt={selectedReport.product?.title}
                        className="h-full w-full object-cover"
                      />
                    : <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <User size={22} />
                      </div>
                    }
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white">
                      {selectedReport.type === "Product" ?
                        selectedReport.product?.title || "Product"
                      : selectedReport.reportedUser?.name || "User"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Report ID: {selectedReport._id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Information grid */}

              <div className="grid gap-4 sm:grid-cols-3">
                <InfoBox
                  label="Reporter"
                  value={selectedReport.reporter?.name || "Unknown"}
                />

                <InfoBox label="Reason" value={selectedReport.reason} />

                <InfoBox
                  label="Created"
                  value={formatDate(selectedReport.createdAt)}
                />
              </div>

              {/* Description */}

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Report Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {selectedReport.description ||
                    "No additional description provided."}
                </p>
              </div>

              {/* Product extra */}

              {selectedReport.type === "Product" && selectedReport.product && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <InfoBox
                    label="Category"
                    value={selectedReport.product.category || "-"}
                  />

                  <InfoBox
                    label="Price"
                    value={`₹${Number(
                      selectedReport.product.price || 0,
                    ).toLocaleString("en-IN")}`}
                  />

                  <InfoBox
                    label="Availability"
                    value={
                      selectedReport.product.isAvailable ?
                        "Available"
                      : "Unavailable"
                    }
                  />
                </div>
              )}

              {/* Moderation */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
                <div className="mb-4 flex items-center gap-2">
                  <FileWarning
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />

                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    Moderation Action
                  </h3>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                      Status
                    </label>

                    <select
                      value={updateStatus}
                      onChange={(event) => setUpdateStatus(event.target.value)}
                      disabled={updating}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="Pending">Pending</option>

                      <option value="Under Review">Under Review</option>

                      <option value="Resolved">Resolved</option>

                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                      Admin Note
                    </label>

                    <textarea
                      value={adminNote}
                      onChange={(event) => setAdminNote(event.target.value)}
                      disabled={updating}
                      maxLength={1000}
                      rows={4}
                      placeholder="Write a moderation note for the reporter..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <p className="mt-1 text-right text-[10px] text-slate-400">
                      {adminNote.length}
                      /1000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-800 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                disabled={updating}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleUpdateReport}
                disabled={updating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                : <>
                    <CheckCircle2 size={16} />
                    Save Moderation
                  </>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default AdminReports;
