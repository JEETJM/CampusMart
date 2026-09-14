import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Handshake,
  Laptop,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

function Home() {
  const categories = [
    {
      name: "Books",
      icon: "📚",
      count: "120+ items",
    },
    {
      name: "Electronics",
      icon: "💻",
      count: "85+ items",
    },
    {
      name: "Cycles",
      icon: "🚲",
      count: "42+ items",
    },
    {
      name: "Furniture",
      icon: "🪑",
      count: "38+ items",
    },
    {
      name: "Fashion",
      icon: "👕",
      count: "95+ items",
    },
    {
      name: "Hostel Essentials",
      icon: "🏠",
      count: "70+ items",
    },
  ];

  const aiFeatures = [
    {
      icon: Search,
      title: "AI Smart Product Finder",
      description:
        "Describe what you need naturally and AI finds the most relevant products for you.",
    },
    {
      icon: CircleDollarSign,
      title: "AI Fair Price Predictor",
      description:
        "Get an estimated fair price based on condition, age, original price and demand.",
    },
    {
      icon: Handshake,
      title: "AI Exchange Matcher",
      description:
        "Find students whose products match what you want to exchange.",
    },
    {
      icon: Camera,
      title: "AI Visual Analysis",
      description:
        "AI analyzes product images and helps identify category and visible condition.",
    },
    {
      icon: Sparkles,
      title: "AI Seller Assistant",
      description:
        "Generate better titles, descriptions, tags and listing details automatically.",
    },
    {
      icon: ShieldCheck,
      title: "AI Scam Detection",
      description:
        "Detect suspicious listings and unusual marketplace behavior for safer transactions.",
    },
  ];

  const products = [
    {
      title: "Engineering Mathematics Book",
      category: "Books",
      price: "₹350",
      condition: "Like New",
      seller: "Verified Student",
      icon: "📘",
    },
    {
      title: "Wireless Keyboard",
      category: "Electronics",
      price: "₹700",
      condition: "Good",
      seller: "Verified Student",
      icon: "⌨️",
    },
    {
      title: "Mountain Bicycle",
      category: "Cycles",
      price: "₹4,500",
      condition: "Good",
      seller: "Verified Student",
      icon: "🚲",
    },
    {
      title: "Study Table",
      category: "Furniture",
      price: "₹1,200",
      condition: "Used",
      seller: "Verified Student",
      icon: "🪑",
    },
  ];

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles size={16} />
                AI-Powered Student Marketplace
              </div>

              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your Campus.
                <br />
                <span className="text-blue-600">Your Marketplace.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Buy, sell, exchange and rent products with verified students
                from your campus community — powered by AI.
              </p>

              {/* AI SEARCH */}
              <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
                  <Sparkles className="shrink-0 text-blue-600" size={20} />

                  <input
                    type="text"
                    placeholder="Try: I need a used laptop under ₹30,000..."
                    className="min-w-0 flex-1 bg-transparent py-4 text-sm text-slate-700 outline-none"
                  />

                  <button className="hidden shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:block">
                    Ask AI
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  Explore Marketplace
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  Start Selling
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Verified Students
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Campus Pickup
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  AI Assisted
                </span>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-100">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">AI Marketplace</p>
                    <h2 className="text-xl font-bold text-slate-900">
                      Smart Recommendations
                    </h2>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <BrainCircuit size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-3xl">
                        💻
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-semibold text-slate-900">
                            Student Laptop
                          </h3>

                          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                            VERIFIED
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Excellent condition
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <span className="font-bold text-slate-900">
                            ₹28,500
                          </span>

                          <span className="text-xs text-green-600">
                            AI Fair Price
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles
                        className="mt-0.5 shrink-0 text-blue-600"
                        size={19}
                      />

                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          AI Recommendation
                        </p>

                        <p className="mt-1 text-sm leading-6 text-blue-700">
                          This product matches your budget and requirement with
                          94% relevance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-lg font-bold text-slate-900">94%</p>
                      <p className="text-[11px] text-slate-500">Match</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-lg font-bold text-slate-900">4.8</p>
                      <p className="text-[11px] text-slate-500">Rating</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-lg font-bold text-slate-900">AI</p>
                      <p className="text-[11px] text-slate-500">Checked</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-2 text-green-600">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Marketplace</p>
                    <p className="font-bold text-slate-900">Trusted & Safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
          <div className="px-4 py-7 text-center">
            <p className="text-2xl font-bold text-slate-900">500+</p>
            <p className="mt-1 text-sm text-slate-500">Products Listed</p>
          </div>

          <div className="px-4 py-7 text-center">
            <p className="text-2xl font-bold text-slate-900">250+</p>
            <p className="mt-1 text-sm text-slate-500">Students</p>
          </div>

          <div className="px-4 py-7 text-center">
            <p className="text-2xl font-bold text-slate-900">50+</p>
            <p className="mt-1 text-sm text-slate-500">Exchanges</p>
          </div>

          <div className="px-4 py-7 text-center">
            <p className="text-2xl font-bold text-slate-900">4.8/5</p>
            <p className="mt-1 text-sm text-slate-500">Average Rating</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="font-semibold text-blue-600">EXPLORE</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Popular Categories
              </h2>

              <p className="mt-3 text-slate-500">
                Find what you need from your campus community.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex"
            >
              View all
              <ChevronRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                to="/marketplace"
                key={category.name}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl transition group-hover:bg-blue-50">
                  {category.icon}
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BrainCircuit size={28} />
            </div>

            <p className="mt-5 font-semibold text-blue-600">SMARTER SHOPPING</p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI That Actually Helps
            </h2>

            <p className="mt-4 text-slate-500">
              CampusMart AI is more than a marketplace. AI helps students
              discover, price, sell, exchange and shop smarter.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="font-semibold text-blue-600">MARKETPLACE</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Featured Products
              </h2>

              <p className="mt-3 text-slate-500">
                Discover products listed by students.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex"
            >
              Browse marketplace
              <ChevronRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                to="/marketplace"
                key={product.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-52 items-center justify-center bg-slate-100 text-7xl transition group-hover:bg-blue-50">
                  {product.icon}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-blue-600">
                      {product.category}
                    </span>

                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                      {product.condition}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-2 font-semibold text-slate-900">
                    {product.title}
                  </h3>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Price</p>
                      <p className="text-xl font-bold text-slate-900">
                        {product.price}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-2 text-slate-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={18} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <ShieldCheck size={14} className="text-green-600" />
                    {product.seller}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-semibold text-blue-600">HOW IT WORKS</p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Marketplace Made Simple
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                icon: Users,
                title: "Join Campus",
                text: "Create your account and verify your student identity.",
              },
              {
                number: "02",
                icon: Search,
                title: "Find or List",
                text: "Search products or create your own listing.",
              },
              {
                number: "03",
                icon: MessageCircle,
                title: "Connect",
                text: "Chat with students and negotiate safely.",
              },
              {
                number: "04",
                icon: Package,
                title: "Complete",
                text: "Buy, sell, exchange or rent with campus pickup.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                    <Icon size={26} />
                  </div>

                  <span className="mt-5 block text-xs font-bold text-blue-600">
                    STEP {step.number}
                  </span>

                  <h3 className="mt-2 font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CAMPUSMART */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-semibold text-blue-600">WHY CAMPUSMART?</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for Student Life
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-500">
                CampusMart brings the convenience of e-commerce together with
                the trust and convenience of your campus community.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified Student Community",
                    text: "Trade with students from your campus instead of unknown sellers.",
                  },
                  {
                    icon: Truck,
                    title: "Easy Campus Pickup",
                    text: "Choose convenient pickup locations such as hostel, library or main gate.",
                  },
                  {
                    icon: TrendingUp,
                    title: "AI-Powered Decisions",
                    text: "Get smarter recommendations, pricing insights and marketplace assistance.",
                  },
                  {
                    icon: Store,
                    title: "Buy, Sell, Exchange & Rent",
                    text: "One platform for the complete student product lifecycle.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
              <div className="rounded-2xl bg-slate-950 p-7 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-600 p-3">
                    <BrainCircuit size={25} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">CampusMart AI</p>
                    <h3 className="font-bold">Smart Marketplace</h3>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        Price confidence
                      </span>

                      <span className="font-bold text-green-400">92%</span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[92%] rounded-full bg-green-400" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        Product match
                      </span>

                      <span className="font-bold text-blue-400">94%</span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[94%] rounded-full bg-blue-400" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        Listing quality
                      </span>

                      <span className="font-bold text-purple-400">
                        Excellent
                      </span>
                    </div>

                    <div className="mt-3 flex gap-1">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Star
                          key={item}
                          size={18}
                          className="fill-current text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <ShoppingBag size={28} />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to make your campus marketplace smarter?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join CampusMart and start buying, selling, exchanging and renting
            with your student community.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Create Student Account
            </Link>

            <Link
              to="/marketplace"
              className="rounded-xl border border-blue-400 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
