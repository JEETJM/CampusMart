import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  ShoppingCart,
  Store,
  Sun,
  User,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("campusmart_theme") || "light";
  });

  const profileRef = useRef(null);

  const token = localStorage.getItem("campusmart_token");

  const storedUser = localStorage.getItem("campusmart_user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  /*
  =========================================================
  THEME
  =========================================================
  */

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    localStorage.setItem("campusmart_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  };

  /*
  =========================================================
  OUTSIDE PROFILE CLICK
  =========================================================
  */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
  =========================================================
  SEARCH
  =========================================================
  */

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

  /*
  =========================================================
  LOGOUT
  =========================================================
  */

  const handleLogout = () => {
    localStorage.removeItem("campusmart_token");

    localStorage.removeItem("campusmart_user");

    setIsProfileOpen(false);
    setIsMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  /*
  =========================================================
  NAV CLASSES
  =========================================================
  */

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-semibold transition ${
      isActive ?
        "text-blue-600 dark:text-blue-400"
      : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive ?
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  const displayName = user?.name || user?.fullName || "Student";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center gap-5">
          {/* BRAND */}

          <Link
            to="/"
            className="group flex shrink-0 items-center gap-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-100 transition group-hover:-translate-y-0.5 dark:shadow-blue-950/40">
              <Store size={21} className="text-white" strokeWidth={2.4} />

              <span className="absolute right-[-2px] top-[-2px] h-3 w-3 rounded-full border-2 border-white bg-blue-900 dark:border-slate-950" />
            </div>

            <div className="hidden sm:block">
              <div className="text-[18px] font-black tracking-tight text-slate-950 dark:text-white">
                Campus
                <span className="text-blue-600 dark:text-blue-400">Mart</span>
                <span className="ml-1 text-xs text-indigo-500 dark:text-indigo-400">
                  AI
                </span>
              </div>

              <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Campus Marketplace
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/marketplace" className={navLinkClass}>
              Marketplace
            </NavLink>

            <NavLink to="/sell" className={navLinkClass}>
              Sell
            </NavLink>

            {token && (
              <NavLink to="/chat" className={navLinkClass}>
                Messages
              </NavLink>
            )}

            {token && (
              <NavLink to="/my-rentals" className={navLinkClass}>
                My Rentals
              </NavLink>
            )}

            {token && (
              <NavLink to="/rental-requests" className={navLinkClass}>
                Rental Requests
              </NavLink>
            )}
          </nav>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:flex"
          >
            <div className="relative mx-auto w-full max-w-xl">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search books, electronics, cycles..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-950/30"
              />
            </div>
          </form>

          {/* RIGHT ACTIONS */}

          <div className="ml-auto flex items-center gap-1">
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
              aria-label={
                theme === "dark" ?
                  "Switch to light mode"
                : "Switch to dark mode"
              }
            >
              {theme === "dark" ?
                <Sun size={19} />
              : <Moon size={19} />}
            </button>

            {/* AUTHENTICATED */}

            {token && (
              <>
                <Link
                  to="/wishlist"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:flex"
                  title="Wishlist"
                >
                  <Heart size={19} />
                </Link>

                <Link
                  to="/cart"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:flex"
                  title="Cart"
                >
                  <ShoppingCart size={19} />
                </Link>

                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:flex"
                  title="Notifications"
                >
                  <Bell size={19} />
                </button>
              </>
            )}

            {/* NOT LOGGED IN */}

            {!token ?
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
                  <ArrowRight size={16} />
                </Link>
              </div>
            : /* PROFILE */

              <div ref={profileRef} className="relative ml-2 hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((previous) => !previous)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-blue-600 text-sm font-bold text-white">
                    {user?.profileImage ?
                      <img
                        src={user.profileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    : initial}
                  </div>

                  <div className="hidden max-w-[110px] text-left xl:block">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {displayName}
                    </p>

                    <p className="text-[10px] text-slate-400">Student</p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={
                      isProfileOpen ?
                        "rotate-180 text-blue-600"
                      : "text-slate-400"
                    }
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
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
                            {user?.email || "Student account"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ProfileMenuLink
                      to="/profile"
                      icon={User}
                      label="My Profile"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <ProfileMenuLink
                      to="/orders"
                      icon={ShoppingCart}
                      label="My Orders"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <ProfileMenuLink
                      to="/chat"
                      icon={MessageCircle}
                      label="Messages"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <ProfileMenuLink
                      to="/my-rentals"
                      icon={CalendarIcon}
                      label="My Rentals"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <ProfileMenuLink
                      to="/rental-requests"
                      icon={PackageIcon}
                      label="Rental Requests"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={17} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            }

            {/* MOBILE */}

            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden dark:border-slate-700 dark:text-slate-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ?
                <X size={20} />
              : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}

        {isMenuOpen && (
          <div className="border-t border-slate-100 pb-5 pt-4 dark:border-slate-800 lg:hidden">
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

            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </form>

            <nav className="grid gap-1">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={mobileLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/marketplace"
                onClick={() => setIsMenuOpen(false)}
                className={mobileLinkClass}
              >
                Marketplace
              </NavLink>

              <NavLink
                to="/sell"
                onClick={() => setIsMenuOpen(false)}
                className={mobileLinkClass}
              >
                Sell Product
              </NavLink>

              {token && (
                <>
                  <NavLink
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    Wishlist
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    Cart
                  </NavLink>

                  <NavLink
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </NavLink>

                  <NavLink
                    to="/chat"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    Messages
                  </NavLink>

                  <NavLink
                    to="/my-rentals"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    My Rentals
                  </NavLink>

                  <NavLink
                    to="/rental-requests"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    Rental Requests
                  </NavLink>

                  <NavLink
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    My Profile
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600"
                  >
                    <LogOut size={17} className="mr-3" />
                    Sign out
                  </button>
                </>
              )}

              {!token && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/* =========================================================
   PROFILE MENU LINK
========================================================= */

function ProfileMenuLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

/*
=========================================================
RENTAL ICON ALIASES
=========================================================
*/

function CalendarIcon(props) {
  return <Search {...props} />;
}

function PackageIcon(props) {
  return <ShoppingCart {...props} />;
}

export default Navbar;
