import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `transition ${
      isActive ?
        "text-blue-600 font-semibold"
      : "text-slate-600 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <ShoppingBag size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Campus<span className="text-blue-600">Mart</span>
            </h1>

            <p className="hidden text-[10px] font-medium text-slate-400 sm:block">
              Your Campus Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="mx-8 hidden max-w-md flex-1 md:flex">
          <div className="flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search books, electronics, cycles..."
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/marketplace" className={navClass}>
            Marketplace
          </NavLink>

          <NavLink to="/wishlist" className={navClass}>
            <Heart size={20} />
          </NavLink>

          <NavLink to="/cart" className={navClass}>
            <ShoppingCart size={20} />
          </NavLink>

          <NavLink to="/profile" className={navClass}>
            <User size={20} />
          </NavLink>

          <Link
            to="/login"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
        >
          {menuOpen ?
            <X />
          : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mb-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            <NavLink
              to="/marketplace"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Marketplace
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Wishlist
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Cart
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Profile
            </NavLink>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
