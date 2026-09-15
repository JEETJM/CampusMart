import { Link } from "react-router-dom";
import heroStudents from "../assets/campusmart-hero-students.png";

import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Grid2X2,
  Headphones,
  Heart,
  Laptop,
  Leaf,
  NotebookTabs,
  ShieldCheck,
  ShoppingBag,
  Sofa,
  Sparkles,
  Store,
  Shirt,
  Tag,
  Users,
} from "lucide-react";

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
    icon: Building2,
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
    description: "Verified students & secure transactions",
  },
  {
    icon: Tag,
    title: "Great Deals",
    description: "Save money with campus prices",
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Buy and sell within your campus",
  },
  {
    icon: Leaf,
    title: "Sustainable Choice",
    description: "Give useful products a second life",
  },
];

const featuredProducts = [
  {
    title: "MacBook Air M1",
    category: "Electronics",
    price: "₹45,000",
    condition: "Like New",
    type: "For Sale",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Engineering Books",
    category: "Books",
    price: "₹2,000",
    condition: "Good",
    type: "For Sale",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Mountain Cycle",
    category: "Cycles",
    price: "₹150 / day",
    condition: "Good",
    type: "For Rent",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Smart Watch",
    category: "Accessories",
    price: "₹3,500",
    condition: "Like New",
    type: "For Sale",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  },
];

const toneClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  green:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  pink: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  yellow: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function StudentIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[#eaf5ff] dark:border-slate-800 dark:bg-slate-900">
      <img
        src={heroStudents}
        alt="Campus students"
        className="h-auto min-h-[430px] w-full object-contain object-center"
      />

      <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold text-blue-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-blue-300">
        Student-first marketplace
      </div>
    </div>
  );
}

function Home() {
  return (
    <main className="overflow-hidden bg-[#f8fbff] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative border-b border-blue-100 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-500/10" />

        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-500/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
            {/* LEFT */}

            <div>
              {/* BRAND */}

              <div className="mb-7 inline-flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-950/40">
                  <ShoppingBag size={28} className="text-white" />
                </div>

                <div>
                  <p className="text-[25px] font-extrabold tracking-tight text-slate-950 dark:text-white">
                    Campus
                    <span className="text-blue-600 dark:text-blue-400">
                      Mart
                    </span>
                    <span className="ml-1.5 text-sm font-bold text-indigo-500 dark:text-indigo-400">
                      AI
                    </span>
                  </p>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Campus Marketplace
                  </p>
                </div>
              </div>

              {/* TITLE */}

              <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl lg:text-[66px]">
                Buy.
                <span className="text-blue-600 dark:text-blue-400"> Sell.</span>
                <br />
                Exchange.
                <span className="text-blue-600 dark:text-blue-400"> Rent.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                Your trusted student marketplace to buy, sell, exchange and rent
                useful products within your campus community.
              </p>

              {/* SEARCH */}

              <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_15px_45px_rgba(37,99,235,0.12)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
                <form className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 dark:bg-slate-800">
                    <Sparkles
                      size={20}
                      className="shrink-0 text-blue-600 dark:text-blue-400"
                    />

                    <input
                      type="text"
                      placeholder="Search products, categories, or anything..."
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>

                  <Link
                    to="/marketplace"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:shadow-blue-950/30"
                  >
                    Search
                    <ArrowRight size={17} />
                  </Link>
                </form>
              </div>

              {/* BENEFITS */}

              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check size={13} strokeWidth={3} className="text-white" />
                  </span>
                  Verified Students
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check size={13} strokeWidth={3} className="text-white" />
                  </span>
                  Campus Pickup
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check size={13} strokeWidth={3} className="text-white" />
                  </span>
                  AI Assisted
                </span>
              </div>

              {/* CTA */}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  Explore Marketplace
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  Start Selling
                </Link>
              </div>
            </div>

            {/* IMAGE */}

            <StudentIllustration />
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORY ROW
      ========================================================== */}

      <section className="border-b border-blue-100 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/marketplace?category=${encodeURIComponent(category.name)}`}
                  className="group rounded-2xl border border-slate-100 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
                >
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105 ${toneClasses[category.tone]}`}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                    {category.count}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================== */}

      <section className="bg-[#eef6ff] dark:bg-[#0b1424]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-2 rounded-2xl border border-blue-100 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`flex items-center gap-4 px-4 py-4 ${
                    index !== 0 ?
                      "border-t border-slate-100 sm:border-t-0 sm:border-l dark:border-slate-800"
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

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================== */}

      <section className="bg-white py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Featured Listings
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Top Picks for You
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Handpicked products from your campus community.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="hidden items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 sm:flex"
            >
              View All
              <ChevronRight size={17} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.title}
                to="/marketplace"
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/40"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                    {product.type}
                  </span>

                  <button
                    type="button"
                    onClick={(event) => event.preventDefault()}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-slate-600 shadow-md backdrop-blur transition hover:text-red-500 dark:bg-slate-900/90 dark:text-slate-300"
                    aria-label={`Wishlist ${product.title}`}
                  >
                    <Heart size={17} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {product.category}
                    </p>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {product.condition}
                    </span>
                  </div>

                  <h3 className="mt-2 truncate text-base font-bold text-slate-900 dark:text-white">
                    {product.title}
                  </h3>

                  <p className="mt-3 text-xl font-black text-blue-600 dark:text-blue-400">
                    {product.price}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <ShieldCheck size={14} className="text-blue-500" />
                      Verified Student
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-7 flex justify-center sm:hidden">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
            >
              View All Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
{/* =========================================================
    AI CTA
========================================================== */}

<section className="border-y border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950/40">
  <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
    {/* ICON */}

    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-950/40">
      <Sparkles size={27} />
    </div>

    {/* TITLE */}

    <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
      Smarter shopping for student life.
    </h2>

    {/* DESCRIPTION */}

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
      CampusMart AI helps students discover better products, compare prices
      and make smarter buying, selling, rental and exchange decisions.
    </p>

    {/* BUTTONS */}

    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
      <Link
        to="/marketplace"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:bg-blue-500 dark:shadow-blue-950/40 dark:hover:bg-blue-400"
      >
        Explore Marketplace
        <ArrowRight size={17} />
      </Link>

      <Link
        to="/register"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
      >
        Join CampusMart
        <Users size={17} />
      </Link>
    </div>
  </div>
</section>
    </main>
  );
}

export default Home;
