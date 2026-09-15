import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Search,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
  |--------------------------------------------------------------------------
  | Close profile dropdown when clicking outside
  |--------------------------------------------------------------------------
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
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
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
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
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
  |--------------------------------------------------------------------------
  | Navigation Link
  |--------------------------------------------------------------------------
  */

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center px-1 py-2 text-sm font-semibold transition ${
      isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-950"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
    }`;

  const displayName = user?.name || user?.fullName || "Student";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex h-[76px] items-center justify-between gap-5">
            {/* ========================================================= */}
            {/* BRAND                                                      */}
            {/* ========================================================= */}

            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 shadow-lg shadow-slate-200 transition duration-300 group-hover:-translate-y-0.5">
                <Store size={20} strokeWidth={2.2} className="text-white" />

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600" />
              </div>

              <div className="hidden sm:block">
                <p className="text-[17px] font-extrabold tracking-tight text-slate-950">
                  CampusMart
                  <span className="text-blue-600">AI</span>
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Campus Marketplace
                </p>
              </div>
            </Link>

            {/* ========================================================= */}
            {/* DESKTOP NAVIGATION                                         */}
            {/* ========================================================= */}

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
            </nav>

            {/* ========================================================= */}
            {/* SEARCH                                                      */}
            {/* ========================================================= */}

            <form
              onSubmit={handleSearch}
              className="hidden max-w-md flex-1 md:flex"
            >
              <div className="relative w-full">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search books, electronics, cycles..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </form>

            {/* ========================================================= */}
            {/* RIGHT ACTIONS                                               */}
            {/* ========================================================= */}

            <div className="flex items-center gap-1.5">
              {/* Wishlist */}

              {token && (
                <Link
                  to="/wishlist"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 sm:flex"
                  title="Wishlist"
                >
                  <Heart size={19} />
                </Link>
              )}

              {/* Cart */}

              {token && (
                <Link
                  to="/cart"
                  className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 sm:flex"
                  title="Cart"
                >
                  <ShoppingCart size={19} />
                </Link>
              )}

              {/* Auth */}

              {!token ?
                <div className="ml-1 hidden items-center gap-2 sm:flex">
                  <Link
                    to="/login"
                    className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    <LogIn size={17} />
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="group inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-100"
                  >
                    Create account
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              : /* ======================================================= */
                /* PROFILE DROPDOWN                                        */
                /* ======================================================= */

                <div ref={profileRef} className="relative ml-1 hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((previous) => !previous)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                      {initial}
                    </div>

                    <div className="hidden max-w-[100px] text-left xl:block">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {displayName}
                      </p>

                      <p className="text-[10px] font-medium text-slate-400">
                        Student
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70">
                      <div className="mb-2 rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                            {initial}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {displayName}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {user?.email || "Student account"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <User size={17} />
                        My Profile
                      </Link>

                      <Link
                        to="/my-listings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Package size={17} />
                        My Listings
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ShoppingCart size={17} />
                        My Orders
                      </Link>

                      <Link
                        to="/chat"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <MessageCircle size={17} />
                        Messages
                      </Link>

                      <div className="my-2 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              }

              {/* Mobile Menu */}

              <button
                type="button"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ?
                  <X size={20} />
                : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* =========================================================== */}
          {/* MOBILE MENU                                                  */}
          {/* =========================================================== */}

          {isMenuOpen && (
            <div className="border-t border-slate-100 pb-5 pt-4 lg:hidden">
              {/* Mobile Search */}

              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search products..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
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
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      My Profile
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex items-center rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} className="mr-3" />
                      Sign out
                    </button>
                  </>
                )}

                {!token && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
                    >
                      Sign in
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white"
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
    </>
  );
}

export default Navbar;
