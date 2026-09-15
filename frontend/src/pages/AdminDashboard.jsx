import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FileWarning,
  RefreshCw,
  ArrowRight,
  UserCheck,
} from "lucide-react";

import api from "../services/api";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (value.includes("completed") || value.includes("resolved")) {
    return "admin-status-success";
  }

  if (value.includes("cancelled") || value.includes("rejected")) {
    return "admin-status-danger";
  }

  if (
    value.includes("pending") ||
    value.includes("placed") ||
    value.includes("review")
  ) {
    return "admin-status-warning";
  }

  return "admin-status-neutral";
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/dashboard");

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to load dashboard.");
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load admin dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading && !dashboard) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-loading-card">
            <RefreshCw size={22} className="admin-spin" />
            <span>Loading admin dashboard...</span>
          </div>
        </div>
      </main>
    );
  }

  const stats = dashboard?.stats;

  return (
    <main className="admin-page">
      <div className="admin-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-page-header">
          <div>
            <div className="admin-eyebrow">
              <ShieldCheck size={17} />
              ADMINISTRATION
            </div>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor marketplace activity, orders, listings and CampusMart
              safety from one place.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "admin-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="admin-alert admin-alert-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Products</span>
              <div className="admin-stat-icon">
                <Package size={19} />
              </div>
            </div>

            <strong>{stats?.products?.total || 0}</strong>

            <small>{stats?.products?.active || 0} active listings</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Users</span>
              <div className="admin-stat-icon">
                <Users size={19} />
              </div>
            </div>

            <strong>{stats?.users?.total || 0}</strong>

            <small>{stats?.users?.verified || 0} verified</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Orders</span>
              <div className="admin-stat-icon">
                <ShoppingCart size={19} />
              </div>
            </div>

            <strong>{stats?.orders?.total || 0}</strong>

            <small>{stats?.orders?.completed || 0} completed</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Revenue</span>
              <div className="admin-stat-icon">
                <TrendingUp size={19} />
              </div>
            </div>

            <strong>{formatCurrency(stats?.revenue)}</strong>

            <small>Paid / completed pickup value</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-secondary">
              <div className="admin-small-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <span>Completed Orders</span>
                <strong>{stats?.orders?.completed || 0}</strong>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-secondary">
              <div className="admin-small-icon">
                <Clock3 size={17} />
              </div>

              <div>
                <span>Pending Orders</span>
                <strong>{stats?.orders?.pending || 0}</strong>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-secondary">
              <div className="admin-small-icon">
                <FileWarning size={17} />
              </div>

              <div>
                <span>Pending Reports</span>
                <strong>{stats?.reports?.pending || 0}</strong>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-secondary">
              <div className="admin-small-icon">
                <AlertTriangle size={17} />
              </div>

              <div>
                <span>Under Review</span>
                <strong>{stats?.reports?.underReview || 0}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Jump directly to important admin areas.</p>
            </div>
          </div>

          <div className="admin-actions-grid">
            <Link to="/admin/users" className="admin-action-card">
              <div className="admin-action-icon">
                <UserCheck size={21} />
              </div>

              <div>
                <h3>User Management</h3>
                <p>Manage students and admin accounts.</p>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link to="/admin/reports" className="admin-action-card">
              <div className="admin-action-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3>Reports & Safety</h3>
                <p>Review reported products and users.</p>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link to="/marketplace" className="admin-action-card">
              <div className="admin-action-icon">
                <Package size={21} />
              </div>

              <div>
                <h3>Marketplace</h3>
                <p>Inspect live marketplace listings.</p>
              </div>

              <ArrowRight size={18} />
            </Link>

            <Link to="/notifications" className="admin-action-card">
              <div className="admin-action-icon">
                <AlertTriangle size={21} />
              </div>

              <div>
                <h3>Notifications</h3>
                <p>Check recent platform notifications.</p>
              </div>

              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* =================================================
            RECENT DATA
        ================================================= */}

        <section className="admin-two-column">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest marketplace transactions</p>
              </div>

              <Link to="/admin/orders">
                View all <ArrowRight size={15} />
              </Link>
            </div>

            <div className="admin-table-wrapper">
              {dashboard?.recentOrders?.length ?
                dashboard.recentOrders.map((order) => (
                  <div className="admin-list-row" key={order._id}>
                    <div>
                      <strong>{order.orderNumber || "Order"}</strong>

                      <span>
                        {order.buyer?.name || order.buyer?.email || "Buyer"}
                      </span>
                    </div>

                    <div className="admin-list-right">
                      <strong>{formatCurrency(order.subtotal)}</strong>

                      <span
                        className={`admin-status ${statusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus || "Placed"}
                      </span>
                    </div>
                  </div>
                ))
              : <div className="admin-empty">
                  <ShoppingCart size={25} />
                  <p>No orders yet.</p>
                </div>
              }
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Recent Safety Reports</h2>
                <p>Latest moderation activity</p>
              </div>

              <Link to="/admin/reports">
                Manage <ArrowRight size={15} />
              </Link>
            </div>

            <div className="admin-table-wrapper">
              {dashboard?.recentReports?.length ?
                dashboard.recentReports.map((report) => (
                  <div className="admin-list-row" key={report._id}>
                    <div>
                      <strong>{report.reason || "Report"}</strong>

                      <span>
                        {report.reporter?.name ||
                          report.reporter?.email ||
                          "Reporter"}
                      </span>
                    </div>

                    <div className="admin-list-right">
                      <span
                        className={`admin-status ${statusClass(report.status)}`}
                      >
                        {report.status || "Pending"}
                      </span>

                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                ))
              : <div className="admin-empty">
                  <ShieldCheck size={25} />
                  <p>No safety reports yet.</p>
                </div>
              }
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
