import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  Star,
  ShieldAlert,
  RefreshCw,
  ArrowRight,
  Inbox,
} from "lucide-react";
import api from "../services/api";

const getNotificationIcon = (type) => {
  switch (type) {
    case "order":
      return <ShoppingBag size={20} />;

    case "payment":
      return <CreditCard size={20} />;

    case "message":
      return <MessageCircle size={20} />;

    case "review":
      return <Star size={20} />;

    case "security":
      return <ShieldAlert size={20} />;

    case "exchange":
    case "rental":
      return <RefreshCw size={20} />;

    default:
      return <Bell size={20} />;
  }
};

const formatDate = (date) => {
  if (!date) return "";

  const notificationDate = new Date(date);
  const now = new Date();

  const diff = now - notificationDate;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return notificationDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data?.notifications || []);
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (err) {
      console.error("Load Notifications Error:", err);

      setError(err?.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ?
            { ...notification, isRead: true }
          : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark Notification Error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Mark All Notifications Error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id),
      );
    } catch (err) {
      console.error("Delete Notification Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Bell size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Notifications
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Stay updated with your CampusMart activity.
                </p>
              </div>
            </div>

            {!loading && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ?
                  `${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "You're all caught up."}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ?
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-900"
              />
            ))}
          </div>
        : notifications.length === 0 ?
          /* Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Inbox size={30} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              When you receive order updates, payment updates, messages,
              exchange requests or other activity, they will appear here.
            </p>

            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>
        : /* Notification List */
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`group relative rounded-2xl border p-4 transition ${
                  notification.isRead ?
                    "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  : "border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20"
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      notification.isRead ?
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      : "bg-blue-600 text-white"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3
                        className={`text-sm font-bold ${
                          notification.isRead ?
                            "text-slate-800 dark:text-slate-200"
                          : "text-slate-950 dark:text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>

                      <span className="shrink-0 text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {notification.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <CheckCheck size={14} />
                          Mark as read
                        </button>
                      )}

                      {notification.link && (
                        <Link
                          to={notification.link}
                          onClick={() => {
                            if (!notification.isRead) {
                              markAsRead(notification._id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          View details
                          <ArrowRight size={14} />
                        </Link>
                      )}

                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 opacity-0 transition group-hover:opacity-100 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!notification.isRead && (
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Notifications;
