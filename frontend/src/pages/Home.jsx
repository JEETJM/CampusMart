import { Link } from "react-router-dom";
import heroStudents from "../assets/campusmart-hero-students.png";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bike,
  Check,
  ChevronRight,
  CircleDollarSign,
  Grid2X2,
  Headphones,
  Heart,
  Laptop,
  Leaf,
  MessageCircle,
  NotebookTabs,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sofa,
  Sparkles,
  Store,
  Shirt,
  Tag,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

// ============================================================
// DATA
// ============================================================

const categories = [
  {
    name: "Books",
    count: "120+ items",
    icon: BookOpen,
    tone: "blue",
  },
  {
    name: "Electronics",
    count: "85+ items",
    icon: Laptop,
    tone: "violet",
  },
  {
    name: "Cycles",
    count: "42+ items",
    icon: Bike,
    tone: "green",
  },
  {
    name: "Furniture",
    count: "38+ items",
    icon: Sofa,
    tone: "orange",
  },
  {
    name: "Clothing",
    count: "95+ items",
    icon: Shirt,
    tone: "pink",
  },
  {
    name: "Accessories",
    count: "65+ items",
    icon: Headphones,
    tone: "cyan",
  },
  {
    name: "Sports",
    count: "40+ items",
    icon: CircleDollarSign,
    tone: "yellow",
  },
  {
    name: "Notes",
    count: "70+ items",
    icon: NotebookTabs,
    tone: "indigo",
  },
  {
    name: "Other",
    count: "30+ items",
    icon: Grid2X2,
    tone: "slate",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description: "Verified students and secure transactions",
  },
  {
    icon: WalletCards,
    title: "Better Deals",
    description: "Save more with student-friendly prices",
  },
  {
    icon: MessageCircle,
    title: "Campus Community",
    description: "Buy and sell within your campus",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Give useful products a second life",
  },
];

const featuredProducts = [
  {
    title: "Engineering Books",
    category: "Books",
    price: "₹2,000",
    condition: "Good",
    type: "For Sale",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=90",
  },
  {
    title: "Mountain Cycle",
    category: "Cycles",
    price: "₹150 / day",
    condition: "Good",
    type: "For Rent",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1000&q=90",
  },
  {
    title: "Smart Watch",
    category: "Accessories",
    price: "₹3,500",
    condition: "Like New",
    type: "For Sale",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90",
  },
];

const toneClasses = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/10",
  violet:
    "bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/10",
  green:
    "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/10",
  orange:
    "bg-orange-50 text-orange-600 ring-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/10",
  pink: "bg-pink-50 text-pink-600 ring-pink-100 dark:bg-pink-500/10 dark:text-pink-400 dark:ring-pink-500/10",
  cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:ring-cyan-500/10",
  yellow:
    "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/10",
  indigo:
    "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/10",
  slate:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
};

// ============================================================
// HERO VISUAL
// ============================================================

function StudentIllustration() {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-[0_30px_80px_rgba(37,99,235,0.14)] dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 dark:shadow-black/30">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />

      <img
        src={heroStudents}
        alt="Campus students using CampusMart"
        className="relative z-10 h-auto min-h-[420px] w-full object-contain object-center transition duration-700 group-hover:scale-[1.025] sm:min-h-[460px]"
      />

      {/* Top badge */}
      <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Student-first marketplace
      </div>

      {/* Bottom card */}
      <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              CampusMart AI
            </p>

            <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
              Smarter choices. Better value.
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-950/40">
            <Sparkles size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOME
// ============================================================

function Home() {
  return (
    <main className="overflow-hidden bg-[#f7faff] text-slate-900 dark:bg-[#070b14] dark:text-slate-100">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative border-b border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Background glows */}
        <div className="pointer-events-none absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-600/10" />

        <div className="pointer-events-none absolute right-[-5rem] top-20 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-sky-100/40 blur-3xl dark:bg-sky-500/5" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14">
            {/* =================================================
                LEFT
            ================================================== */}

            <div>
              {/* Brand */}
              <div className="mb-7 inline-flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:shadow-blue-950/40">
                  <Store size={27} strokeWidth={2.2} />

                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white shadow-md dark:border-slate-950 dark:bg-slate-900">
                    <Sparkles
                      size={10}
                      strokeWidth={2.5}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </span>
                </div>

                <div>
                  <p className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    Campus
                    <span className="text-blue-600 dark:text-blue-400">
                      Mart
                    </span>
                    <span className="ml-2 rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-black text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      AI
                    </span>
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Student Marketplace
                  </p>
                </div>
              </div>

              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm dark:border-blue-500/15 dark:bg-blue-500/10 dark:text-blue-300">
                <Sparkles size={14} />
                Buy smarter with CampusMart AI
              </div>

              {/* Heading */}
              <h1 className="max-w-3xl text-[3.35rem] font-black leading-[0.98] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl lg:text-[68px]">
                Buy.
                <span className="text-blue-600 dark:text-blue-400"> Sell.</span>
                <br />
                Exchange.
                <span className="text-blue-600 dark:text-blue-400"> Rent.</span>
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                A trusted student marketplace for buying, selling, exchanging
                and renting useful products within your campus community.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 dark:bg-slate-800">
                    <Search
                      size={19}
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    />

                    <input
                      type="text"
                      placeholder="Search products, categories, or anything..."
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />

                    <span className="hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-400 lg:inline-flex dark:border-slate-700 dark:bg-slate-900">
                      AI
                    </span>
                  </div>

                  <Link
                    to="/marketplace"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:bg-blue-700 hover:shadow-xl dark:bg-blue-500 dark:shadow-blue-950/30 dark:hover:bg-blue-400"
                  >
                    Search
                    <ArrowRight size={17} />
                  </Link>
                </form>
              </div>

              {/* Trust signals */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                  Verified Students
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                  Campus Pickup
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                  AI Assisted
                </span>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/marketplace"
                  className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  Explore Marketplace
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <ShoppingBag size={16} />
                  Start Selling
                </Link>
              </div>

              {/* Micro stats */}
              <div className="mt-9 flex flex-wrap gap-7 border-t border-slate-100 pt-6 dark:border-slate-800">
                <div>
                  <p className="text-xl font-black text-slate-950 dark:text-white">
                    1.2K+
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Listings
                  </p>
                </div>

                <div>
                  <p className="text-xl font-black text-slate-950 dark:text-white">
                    500+
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Students
                  </p>
                </div>

                <div>
                  <p className="text-xl font-black text-slate-950 dark:text-white">
                    9
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Categories
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT
            ================================================== */}

            <StudentIllustration />
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY SECTION
      ====================================================== */}

      <section className="border-b border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Explore Categories
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Shop by category
              </h2>
            </div>

            <Link
              to="/marketplace"
              className="hidden items-center gap-1 text-sm font-bold text-blue-600 sm:flex dark:text-blue-400"
            >
              Browse all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/marketplace?category=${encodeURIComponent(
                    category.name,
                  )}`}
                  className="group rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:shadow-black/20"
                >
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-110 ${toneClasses[category.tone]}`}
                  >
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {category.count}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFIT STRIP
      ====================================================== */}

      <section className="bg-[#f1f7ff] dark:bg-[#0a1220]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-blue-100/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className={`flex items-center gap-4 px-5 py-5 ${
                      index !== 0 ?
                        "border-t border-slate-100 dark:border-slate-800 sm:border-l sm:border-t-0"
                      : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="bg-white py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <TrendingUp size={13} />
                Featured Listings
              </div>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Top picks for student life
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Useful products, campus-friendly prices and listings from your
                student community.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="hidden items-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 sm:flex dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              View All
              <ChevronRight size={17} />
            </Link>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.title}
                to="/marketplace"
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 dark:hover:shadow-black/40"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

                  <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                    {product.type}
                  </span>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-slate-600 shadow-lg backdrop-blur transition hover:scale-105 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
                    aria-label={`Wishlist ${product.title}`}
                  >
                    <Heart size={17} />
                  </button>

                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-md backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
                    <BadgeCheck size={12} className="text-blue-500" />
                    Verified seller
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {product.category}
                    </p>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {product.condition}
                    </span>
                  </div>

                  <h3 className="mt-2 truncate text-base font-extrabold text-slate-900 dark:text-white">
                    {product.title}
                  </h3>

                  <p className="mt-3 text-xl font-black text-slate-950 dark:text-white">
                    {product.price}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      <ShieldCheck size={14} className="text-blue-500" />
                      Campus verified
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-950/30"
            >
              View All Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="border-y border-slate-200/70 bg-[#f8fbff] py-16 dark:border-slate-800 dark:bg-[#0a101b]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Simple by design
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Marketplace made for campus life
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Find what you need, connect with students and complete the deal
              around your campus.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Search,
                title: "Discover",
                text: "Search products and explore categories that match your needs.",
              },
              {
                number: "02",
                icon: MessageCircle,
                title: "Connect",
                text: "Chat with students, compare options and negotiate safely.",
              },
              {
                number: "03",
                icon: PackageCheck,
                title: "Complete",
                text: "Buy, rent or exchange with convenient campus pickup.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon size={21} />
                    </div>

                    <span className="text-xs font-black text-slate-300 dark:text-slate-700">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          AI CTA
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950/40">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/10" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-200 dark:from-blue-500 dark:to-indigo-500 dark:shadow-blue-950/40">
            <Sparkles size={28} />
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-blue-400">
            <Sparkles size={12} />
            AI-powered student commerce
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Smarter shopping for student life.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            CampusMart AI helps students discover better products, compare
            prices, spot risky listings and make smarter buying, selling, rental
            and exchange decisions.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl dark:bg-blue-500 dark:shadow-blue-950/40 dark:hover:bg-blue-400"
            >
              Explore Marketplace
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              Join CampusMart
              <Users size={17} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "Smart Product Finder",
              "Fair Price Insights",
              "Exchange Matching",
              "Scam Detection",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-blue-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
