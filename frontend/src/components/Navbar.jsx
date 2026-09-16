import { useEffect, useRef, useState } from "react";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [notifications, setNotifications] = useState([]);

  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("campusmart_theme") || "light";
  });

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  /* =========================================================
     SESSION
  ========================================================= */

  const studentToken = localStorage.getItem("campusmart_token");

  const adminToken = localStorage.getItem("campusmart_admin_token");

  const studentUserRaw = localStorage.getItem("campusmart_user");

  const adminUserRaw = localStorage.getItem("campusmart_admin_user");

  let studentUser = null;
  let adminUser = null;

  try {
    studentUser = studentUserRaw ? JSON.parse(studentUserRaw) : null;
  } catch {
    studentUser = null;
  }

  try {
    adminUser = adminUserRaw ? JSON.parse(adminUserRaw) : null;
  } catch {
    adminUser = null;
  }

  const isAdmin =
    Boolean(adminToken) &&
    String(adminUser?.role || "").toLowerCase() === "admin";

  const token = isAdmin ? adminToken : studentToken;

  const user = isAdmin ? adminUser : studentUser;

  const isLoggedIn = Boolean(token);

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    root.classList.add(theme);

    localStorage.setItem("campusmart_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  };

  /* =========================================================
     CLOSE MENUS ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
  }, [location.pathname]);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =========================================================
     LOAD NOTIFICATIONS
  ========================================================= */

  const loadNotifications = async () => {
    try {
      const currentAdminToken = localStorage.getItem("campusmart_admin_token");

      const currentStudentToken = localStorage.getItem("campusmart_token");

      const currentAdminUserRaw = localStorage.getItem("campusmart_admin_user");

      let currentAdminUser = null;

      try {
        currentAdminUser =
          currentAdminUserRaw ? JSON.parse(currentAdminUserRaw) : null;
      } catch {
        currentAdminUser = null;
      }

      const currentIsAdmin =
        Boolean(currentAdminToken) &&
        String(currentAdminUser?.role || "").toLowerCase() === "admin";

      const currentToken =
        currentIsAdmin ? currentAdminToken : currentStudentToken;

      if (!currentToken) {
        setNotifications([]);
        setUnreadNotifications(0);
        return;
      }

      const response = await api.get("/notifications");

      setNotifications(response.data?.notifications || []);

      setUnreadNotifications(response.data?.unreadCount || 0);
    } catch (error) {
      console.error("Navbar Notification Error:", error);
    }
  };

  /* =========================================================
     INITIAL + AUTO REFRESH
  ========================================================= */

  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadNotifications(0);
      return;
    }

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn, isAdmin, adminToken, studentToken]);

  /* =========================================================
     MARK SINGLE NOTIFICATION
  ========================================================= */

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.put(`/notifications/${notification._id}/read`);

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id ?
              {
                ...item,
                isRead: true,
              }
            : item,
          ),
        );

        setUnreadNotifications((previous) => Math.max(0, previous - 1));
      }

      setIsNotificationOpen(false);

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error("Notification Read Error:", error);
    }
  };

  /* =========================================================
     MARK ALL AS READ
  ========================================================= */

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      setUnreadNotifications(0);
    } catch (error) {
      console.error("Mark All Notifications Error:", error);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      navigate("/marketplace");
      return;
    }

    navigate(`/marketplace?search=${encodeURIComponent(query)}`);

    setSearchValue("");
    setIsMenuOpen(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("campusmart_token");

    localStorage.removeItem("campusmart_user");

    localStorage.removeItem("campusmart_admin_token");

    localStorage.removeItem("campusmart_admin_user");

    setNotifications([]);
    setUnreadNotifications(0);

    setIsProfileOpen(false);
    setIsNotificationOpen(false);
    setIsMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================================================
     CLASSES
  ========================================================= */

  const navLinkClass = ({ isActive }) =>
    `relative whitespace-nowrap px-1 py-2 text-sm font-semibold transition-colors ${
      isActive ?
        "text-blue-600 dark:text-blue-400"
      : "text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive ?
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  const displayName =
    user?.name || user?.fullName || (isAdmin ? "Admin" : "Student");

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            MAIN BAR
        =================================================== */}

        <div className="flex min-h-[76px] items-center gap-4 lg:gap-6">
          {/* BRAND */}

          <Link
            to="/"
            className="group flex shrink-0 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/image1.png"
              alt="CampusMart Logo"
              className="h-[60px] w-auto max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================== */}

          <nav className="hidden shrink-0 items-center gap-5 xl:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/marketplace" className={navLinkClass}>
              Marketplace
            </NavLink>

            {/* =================================================
                ADMIN
            ================================================= */}

            {isAdmin ?
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  Admin Dashboard
                </NavLink>

                <NavLink to="/admin/products" className={navLinkClass}>
                  Products
                </NavLink>

                <NavLink to="/admin/users" className={navLinkClass}>
                  Users
                </NavLink>

                <NavLink to="/admin/reports" className={navLinkClass}>
                  Reports
                </NavLink>
              </>
            : <>
                <NavLink to="/sell" className={navLinkClass}>
                  Sell
                </NavLink>

                {isLoggedIn && (
                  <NavLink to="/chat" className={navLinkClass}>
                    Messages
                  </NavLink>
                )}

                {isLoggedIn && (
                  <NavLink to="/my-rentals" className={navLinkClass}>
                    My Rentals
                  </NavLink>
                )}

                {isLoggedIn && (
                  <NavLink to="/rental-requests" className={navLinkClass}>
                    Rental Requests
                  </NavLink>
                )}
              </>
            }
          </nav>

          {/* =================================================
              DESKTOP SEARCH
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="hidden min-w-[260px] flex-1 md:block"
          >
            <div className="relative mx-auto w-full max-w-[650px]">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search books, electronics, cycles, notes..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-900"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </form>

          {/* =================================================
              RIGHT
          ================================================== */}

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {/* MOBILE SEARCH */}

            <button
              type="button"
              onClick={() => navigate("/marketplace")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              title="Search"
            >
              <Search size={19} />
            </button>

            {/* THEME */}

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              title={
                theme === "dark" ?
                  "Switch to light mode"
                : "Switch to dark mode"
              }
            >
              {theme === "dark" ?
                <Sun size={19} />
              : <Moon size={19} />}
            </button>

            {/* =================================================
                LOGGED IN
            ================================================== */}

            {isLoggedIn && (
              <>
                {/* STUDENT WISHLIST + CART */}

                {!isAdmin && (
                  <>
                    <Link
                      to="/wishlist"
                      className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 sm:flex dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                      title="Wishlist"
                    >
                      <Heart size={19} />
                    </Link>

                    <Link
                      to="/cart"
                      className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 sm:flex dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                      title="Cart"
                    >
                      <ShoppingCart size={19} />
                    </Link>
                  </>
                )}

                {/* NOTIFICATIONS */}

                <div ref={notificationRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() =>
                      setIsNotificationOpen((previous) => !previous)
                    }
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                    title="Notifications"
                  >
                    <Bell size={19} />

                    {unreadNotifications > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-950">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATION DROPDOWN */}

                  {isNotificationOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Notifications
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {unreadNotifications > 0 ?
                              `${unreadNotifications} unread`
                            : "You're all caught up"}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {unreadNotifications > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllAsRead}
                              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                            >
                              <CheckCheck size={14} />
                              Read all
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setIsNotificationOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-[420px] overflow-y-auto">
                        {notifications.length === 0 ?
                          <div className="px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                              <Bell size={24} />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
                              No notifications yet
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              Your CampusMart updates will appear here.
                            </p>
                          </div>
                        : notifications.slice(0, 6).map((notification) => (
                            <button
                              key={notification._id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition dark:border-slate-800 ${
                                notification.isRead ?
                                  "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70"
                                : "bg-blue-50/70 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"
                              }`}
                            >
                              <div className="flex gap-3">
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                    notification.isRead ?
                                      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                    : "bg-blue-600 text-white"
                                  }`}
                                >
                                  <Bell size={17} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                      {notification.title}
                                    </p>

                                    {!notification.isRead && (
                                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                    )}
                                  </div>

                                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {notification.message}
                                  </p>

                                  <p className="mt-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                    {formatNotificationDate(
                                      notification.createdAt,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        }
                      </div>

                      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                        <Link
                          to="/notifications"
                          onClick={() => setIsNotificationOpen(false)}
                          className="flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* =================================================
                LOGGED OUT
            ================================================== */}

            {!isLoggedIn && (
              <div className="ml-1 hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <LogIn size={17} />
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 dark:shadow-blue-950/30"
                >
                  Create account
                </Link>

                <Link
                  to="/admin/login"
                  className="admin-login-nav-link"
                  title="Admin Login"
                >
                  <ShieldCheck size={16} />
                  Admin Login
                </Link>
              </div>
            )}

            {/* =================================================
                PROFILE
            ================================================== */}

            {isLoggedIn && (
              <div ref={profileRef} className="relative ml-1 hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((previous) => !previous)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-blue-600 text-sm font-bold text-white">
                    {user?.profileImage ?
                      <img
                        src={user.profileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    : initial}
                  </div>

                  <div className="hidden max-w-[130px] text-left xl:block">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {displayName}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {isAdmin ? "Admin" : "Student"}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`transition-transform ${
                      isProfileOpen ?
                        "rotate-180 text-blue-600"
                      : "text-slate-400"
                    }`}
                  />
                </button>

                {/* PROFILE DROPDOWN */}

                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-2 rounded-xl bg-blue-50 p-3 dark:bg-blue-500/10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-blue-600 font-bold text-white">
                          {user?.profileImage ?
                            <img
                              src={user.profileImage}
                              alt={displayName}
                              className="h-full w-full object-cover"
                            />
                          : initial}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {displayName}
                          </p>

                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user?.email || "CampusMart account"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* COMMON */}
                    {/* =================================================
    MY PROFILE
================================================= */}

                    <ProfileMenuLink
                      to={isAdmin ? "/admin/profile" : "/profile"}
                      icon={User}
                      label="My Profile"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    {/* STUDENT */}

                    {!isAdmin && (
                      <>
                        <ProfileMenuLink
                          to="/orders"
                          icon={ShoppingCart}
                          label="My Orders"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/wishlist"
                          icon={Heart}
                          label="Wishlist"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/chat"
                          icon={MessageCircle}
                          label="Messages"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/notifications"
                          icon={Bell}
                          label="Notifications"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/my-rentals"
                          icon={CalendarDays}
                          label="My Rentals"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/rental-requests"
                          icon={Package}
                          label="Rental Requests"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/seller-orders"
                          icon={ShoppingCart}
                          label="Seller Orders"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/my-reports"
                          icon={ShieldCheck}
                          label="My Reports"
                          onClick={() => setIsProfileOpen(false)}
                        />
                      </>
                    )}

                    {/* ADMIN */}

                    {isAdmin && (
                      <>
                        <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                        <ProfileMenuLink
                          to="/admin/dashboard"
                          icon={LayoutDashboard}
                          label="Admin Dashboard"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/admin/products"
                          icon={Package}
                          label="Products"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/admin/users"
                          icon={Users}
                          label="User Management"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/admin/reports"
                          icon={ShieldCheck}
                          label="Reports & Safety"
                          onClick={() => setIsProfileOpen(false)}
                        />

                        <ProfileMenuLink
                          to="/notifications"
                          icon={Bell}
                          label="Notifications"
                          onClick={() => setIsProfileOpen(false)}
                        />
                      </>
                    )}

                    <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={17} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              aria-label="Toggle menu"
            >
              {isMenuOpen ?
                <X size={20} />
              : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE SEARCH
        ===================================================== */}

        <div className="pb-4 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search books, electronics, cycles..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {isMenuOpen && (
          <div className="border-t border-slate-100 pb-5 pt-4 dark:border-slate-800 lg:hidden">
            {/* THEME */}

            <button
              type="button"
              onClick={toggleTheme}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>

              {theme === "dark" ?
                <Sun size={18} />
              : <Moon size={18} />}
            </button>

            <nav className="grid gap-1">
              <NavLink to="/" className={mobileLinkClass}>
                Home
              </NavLink>

              <NavLink to="/marketplace" className={mobileLinkClass}>
                Marketplace
              </NavLink>

              {/* =================================================
                  ADMIN MOBILE
              ================================================== */}

              {isAdmin ?
                <>
                  <NavLink to="/admin/dashboard" className={mobileLinkClass}>
                    <LayoutDashboard size={16} className="mr-3" />
                    Admin Dashboard
                  </NavLink>

                  <NavLink to="/admin/products" className={mobileLinkClass}>
                    <Package size={16} className="mr-3" />
                    Products
                  </NavLink>

                  <NavLink to="/admin/users" className={mobileLinkClass}>
                    <Users size={16} className="mr-3" />
                    User Management
                  </NavLink>

                  <NavLink to="/admin/reports" className={mobileLinkClass}>
                    <ShieldCheck size={16} className="mr-3" />
                    Reports & Safety
                  </NavLink>

                  <NavLink to="/notifications" className={mobileLinkClass}>
                    <Bell size={16} className="mr-3" />
                    Notifications
                    {unreadNotifications > 0 && (
                      <span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </NavLink>

                  <NavLink to="/profile" className={mobileLinkClass}>
                    <User size={16} className="mr-3" />
                    My Profile
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex items-center rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={17} className="mr-3" />
                    Sign out
                  </button>
                </>
              : <>
                  <NavLink to="/sell" className={mobileLinkClass}>
                    Sell Product
                  </NavLink>

                  {isLoggedIn && (
                    <>
                      <NavLink to="/wishlist" className={mobileLinkClass}>
                        <Heart size={16} className="mr-3" />
                        Wishlist
                      </NavLink>

                      <NavLink to="/cart" className={mobileLinkClass}>
                        <ShoppingCart size={16} className="mr-3" />
                        Cart
                      </NavLink>

                      <NavLink to="/notifications" className={mobileLinkClass}>
                        <Bell size={16} className="mr-3" />
                        Notifications
                        {unreadNotifications > 0 && (
                          <span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                            {unreadNotifications > 99 ?
                              "99+"
                            : unreadNotifications}
                          </span>
                        )}
                      </NavLink>

                      <NavLink to="/orders" className={mobileLinkClass}>
                        <ShoppingCart size={16} className="mr-3" />
                        My Orders
                      </NavLink>

                      <NavLink to="/chat" className={mobileLinkClass}>
                        <MessageCircle size={16} className="mr-3" />
                        Messages
                      </NavLink>

                      <NavLink to="/my-rentals" className={mobileLinkClass}>
                        <CalendarDays size={16} className="mr-3" />
                        My Rentals
                      </NavLink>

                      <NavLink
                        to="/rental-requests"
                        className={mobileLinkClass}
                      >
                        <Package size={16} className="mr-3" />
                        Rental Requests
                      </NavLink>

                      <NavLink to="/seller-orders" className={mobileLinkClass}>
                        <ShoppingCart size={16} className="mr-3" />
                        Seller Orders
                      </NavLink>

                      <NavLink to="/my-reports" className={mobileLinkClass}>
                        <ShieldCheck size={16} className="mr-3" />
                        My Reports
                      </NavLink>

                      <NavLink to="/profile" className={mobileLinkClass}>
                        <User size={16} className="mr-3" />
                        My Profile
                      </NavLink>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex items-center rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <LogOut size={17} className="mr-3" />
                        Sign out
                      </button>
                    </>
                  )}

                  {!isLoggedIn && (
                    <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <Link
                        to="/login"
                        className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        <LogIn size={16} className="mr-2" />
                        Sign in
                      </Link>

                      <Link
                        to="/register"
                        className="flex h-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white"
                      >
                        Create account
                      </Link>

                      <Link
                        to="/admin/login"
                        className="admin-login-mobile-link"
                      >
                        <ShieldCheck size={17} />
                        Admin Login
                      </Link>
                    </div>
                  )}
                </>
              }
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/* =========================================================
   NOTIFICATION DATE
========================================================= */

function formatNotificationDate(date) {
  if (!date) {
    return "";
  }

  const notificationDate = new Date(date);

  const now = new Date();

  const difference = now.getTime() - notificationDate.getTime();

  const minutes = Math.floor(difference / 60000);

  const hours = Math.floor(difference / 3600000);

  const days = Math.floor(difference / 86400000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return notificationDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   PROFILE MENU LINK
========================================================= */

function ProfileMenuLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

export default Navbar;
