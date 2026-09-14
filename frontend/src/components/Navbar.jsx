import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("campusmart_user");
      const token = localStorage.getItem("campusmart_token");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Navbar User Error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("campusmart-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("campusmart-auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("campusmart_token");
    localStorage.removeItem("campusmart_user");

    setUser(null);
    setCartCount(0);
    setMobileOpen(false);

    window.dispatchEvent(new Event("campusmart-auth-change"));

    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      name: "Marketplace",
      path: "/marketplace",
    },
    {
      name: "Sell",
      path: "/sell",
    },
  ];

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
            CM
          </div>

          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-tight text-slate-900">
              CampusMart
            </p>

            <p className="text-[11px] font-medium text-blue-600">
              AI Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive ?
                    "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => navigate("/marketplace")}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Search Marketplace"
          >
            <Search size={19} />
          </button>

          {user ?
            <>
              <button
                onClick={() => navigate("/wishlist")}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                title="Wishlist"
              >
                <Heart size={19} />
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                title="Cart"
              >
                <ShoppingCart size={19} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                  {getInitials(user?.name || user?.fullName || "ST") || "ST"}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="max-w-28 truncate text-xs font-semibold text-slate-900">
                    {user?.name || user?.fullName || "Student"}
                  </p>

                  <p className="text-[10px] text-slate-500">View Profile</p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          : <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LogIn size={17} />
              Login
            </Link>
          }
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {mobileOpen ?
            <X size={22} />
          : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive ?
                      "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <NavLink
              to="/marketplace"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Search size={18} />
              Search Marketplace
            </NavLink>

            {user ?
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <User size={18} />
                  Profile
                </NavLink>

                <NavLink
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Heart size={18} />
                  Wishlist
                </NavLink>

                <NavLink
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <ShoppingCart size={18} />
                  Cart
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            : <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                <LogIn size={17} />
                Login
              </Link>
            }
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
