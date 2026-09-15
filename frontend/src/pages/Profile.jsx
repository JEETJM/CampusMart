import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Heart,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  User,
  Store,
  Sparkles,
  ChevronRight,
  LockKeyhole,
  Edit3,
} from "lucide-react";

import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH CURRENT USER
  // ==========================================

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data?.user;

        if (!currentUser) {
          throw new Error("User information not found.");
        }

        setUser(currentUser);

        // Keep localStorage updated
        localStorage.setItem("campusmart_user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Profile Error:", error);

        localStorage.removeItem("campusmart_token");

        localStorage.removeItem("campusmart_user");

        navigate("/login", {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("campusmart_token");

    localStorage.removeItem("campusmart_user");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // MEMBER SINCE
  // ==========================================

  const memberSince = useMemo(() => {
    if (!user?.createdAt) {
      return "—";
    }

    return new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [user]);

  // ==========================================
  // PROFILE COMPLETION
  // ==========================================

  const profileCompletion = useMemo(() => {
    if (!user) {
      return 0;
    }

    const fields = [
      user.name,
      user.email,
      user.studentId,
      user.college,
      user.location,
      user.profileImage,
    ];

    const completed = fields.filter(
      (field) => field && String(field).trim() !== "",
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [user]);

  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const actionItems = [
    {
      title: "Marketplace",
      description: "Discover products from your campus.",
      icon: ShoppingBag,
      to: "/marketplace",
      accent: "blue",
    },

    {
      title: "My Listings",
      description: "Manage products you have listed.",
      icon: Package,
      to: "/my-listings",
      accent: "indigo",
    },

    {
      title: "My Orders",
      description: "Track your purchases and orders.",
      icon: Store,
      to: "/orders",
      accent: "violet",
    },

    {
      title: "My Sales",
      description: "Manage orders from your buyers.",
      icon: ShoppingBag,
      to: "/seller-orders",
      accent: "emerald",
    },

    {
      title: "Wishlist",
      description: "View products you saved.",
      icon: Heart,
      to: "/wishlist",
      accent: "rose",
    },

    {
      title: "Messages",
      description: "Chat with buyers and sellers.",
      icon: MessageCircle,
      to: "/chat",
      accent: "sky",
    },

    {
      title: "My Exchange Offers",
      description: "Track your exchange requests.",
      icon: ArrowRightLeft,
      to: "/my-exchange-offers",
      accent: "amber",
    },

    {
      title: "Received Offers",
      description: "Manage offers from other students.",
      icon: ArrowRightLeft,
      to: "/exchange-offers",
      accent: "orange",
    },
  ];

  // ==========================================
  // CARD ACCENTS
  // ==========================================

  const accentClasses = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      hover: "group-hover:border-blue-200",
      arrow: "group-hover:text-blue-600",
    },

    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      hover: "group-hover:border-indigo-200",
      arrow: "group-hover:text-indigo-600",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",
      hover: "group-hover:border-violet-200",
      arrow: "group-hover:text-violet-600",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      hover: "group-hover:border-emerald-200",
      arrow: "group-hover:text-emerald-600",
    },

    rose: {
      icon: "bg-rose-50 text-rose-600",
      hover: "group-hover:border-rose-200",
      arrow: "group-hover:text-rose-600",
    },

    sky: {
      icon: "bg-sky-50 text-sky-600",
      hover: "group-hover:border-sky-200",
      arrow: "group-hover:text-sky-600",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      hover: "group-hover:border-amber-200",
      arrow: "group-hover:text-amber-600",
    },

    orange: {
      icon: "bg-orange-50 text-orange-600",
      hover: "group-hover:border-orange-200",
      arrow: "group-hover:text-orange-600",
    },
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Loading your profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please wait while we securely load your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {/* =====================================
          TOP BAR
      ====================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Home
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* PAGE TITLE */}

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Account
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your CampusMart identity, marketplace activity, and account
            preferences from one place.
          </p>
        </div>

        {/* =====================================
            PREMIUM PROFILE HERO
        ====================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_25px_80px_-35px_rgba(15,23,42,0.32)]">
          {/* BACKGROUND */}

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900" />

            <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>

          <div className="relative">
            {/* COVER */}

            <div className="px-5 pb-7 pt-7 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-8">
                {/* META */}

                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md">
                    <Sparkles size={14} />
                    CampusMart Member
                  </div>

                  {user.isVerified && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                      <BadgeCheck size={14} />
                      Verified Student
                    </div>
                  )}
                </div>

                {/* USER */}

                <div className="flex flex-col justify-between gap-7 pt-10 lg:flex-row lg:items-end lg:pt-12">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    {/* AVATAR */}

                    <div className="relative shrink-0">
                      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-[5px] border-white bg-gradient-to-br from-blue-100 to-indigo-100 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.65)] sm:h-32 sm:w-32">
                        {user.profileImage ?
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        : <User
                            size={52}
                            strokeWidth={1.5}
                            className="text-blue-600"
                          />
                        }
                      </div>

                      {user.isVerified && (
                        <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg">
                          <BadgeCheck size={17} />
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                          {user.name}
                        </h2>
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-300">
                        {user.role === "admin" ?
                          "CampusMart Administrator"
                        : "Student Member"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                          <Mail size={13} />

                          {user.email}
                        </div>

                        {user.location && (
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                            <MapPin size={13} />

                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PROFILE COMPLETION */}

                  <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md lg:w-72">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          Profile completion
                        </p>

                        <p className="mt-1 text-lg font-bold text-white">
                          {profileCompletion}%
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <CheckCircle2 size={19} className="text-emerald-300" />
                      </div>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-700"
                        style={{
                          width: `${profileCompletion}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      Keep your student profile complete and up-to-date.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO FOOTER */}

            <div className="grid border-t border-slate-200 bg-white/95 sm:grid-cols-3">
              <div className="border-b border-slate-200 px-5 py-5 sm:border-b-0 sm:border-r sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Student ID
                </p>

                <p className="mt-2 truncate text-sm font-bold text-slate-900">
                  {user.studentId || "Not added"}
                </p>
              </div>

              <div className="border-b border-slate-200 px-5 py-5 sm:border-b-0 sm:border-r sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  College
                </p>

                <p className="mt-2 truncate text-sm font-bold text-slate-900">
                  {user.college || "Not added"}
                </p>
              </div>

              <div className="px-5 py-5 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Member Since
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CalendarDays size={15} className="text-blue-600" />

                  {memberSince}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            BODY
        ====================================== */}

        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}

          <div className="space-y-7">
            {/* PERSONAL INFORMATION */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_15px_50px_-35px_rgba(15,23,42,0.35)] sm:p-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Identity
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-950">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your account information stored on CampusMart.
                  </p>
                </div>

                {/* EDIT PROFILE BUTTON */}

                <Link
                  to="/profile/edit"
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* NAME */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <User size={18} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Identity
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {user.name}
                  </p>
                </div>

                {/* EMAIL */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Mail size={18} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Contact
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-sm font-bold text-slate-900">
                    {user.email}
                  </p>
                </div>

                {/* STUDENT ID */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <BadgeCheck size={18} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Verification
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Student ID
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {user.studentId || "Not added"}
                  </p>
                </div>

                {/* COLLEGE */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <ShieldCheck size={18} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Institution
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    College
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {user.college || "Not added"}
                  </p>
                </div>

                {/* LOCATION */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <MapPin size={18} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Campus Area
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {user.location || "Not added"}
                  </p>
                </div>

                {/* JOINED */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <CalendarDays size={18} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Timeline
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Member Since
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {memberSince}
                  </p>
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS */}

            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Campus Activity
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-950">
                    Quick Actions
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Jump directly into your CampusMart activities.
                  </p>
                </div>

                <Link
                  to="/marketplace"
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                  Explore Marketplace
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {actionItems.map((item) => {
                  const Icon = item.icon;

                  const styles = accentClasses[item.accent];

                  return (
                    <Link
                      key={item.title}
                      to={item.to}
                      className={`group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_-28px_rgba(15,23,42,0.5)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] ${styles.hover}`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{item.title}</p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className={`shrink-0 text-slate-300 transition ${styles.arrow}`}
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          {/* =================================
              RIGHT SIDEBAR
          ================================== */}

          <aside className="space-y-6">
            {/* ACCOUNT STATUS */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_-35px_rgba(15,23,42,0.35)]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Account
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-950">
                  Account Status
                </h3>
              </div>

              <div className="mt-6 space-y-3">
                {/* ACTIVE */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Account
                      </p>

                      <p className="text-xs text-slate-500">
                        Your account is active
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                    Active
                  </span>
                </div>

                {/* VERIFICATION */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <BadgeCheck size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Student Verification
                      </p>

                      <p className="text-xs text-slate-500">
                        Campus identity verification
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                      user.isVerified ?
                        "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* ROLE */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <User size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Account Type
                      </p>

                      <p className="text-xs text-slate-500">
                        Your CampusMart role
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold capitalize text-slate-700">
                    {user.role || "student"}
                  </span>
                </div>
              </div>
            </section>

            {/* SECURITY */}

            <section className="relative overflow-hidden rounded-[26px] bg-slate-950 p-6 text-white shadow-[0_25px_55px_-30px_rgba(15,23,42,0.55)]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <LockKeyhole size={20} className="text-blue-300" />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Your account is protected
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  CampusMart uses protected authentication and secure password
                  handling to keep your account information safe.
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 size={15} />
                  Secure session active
                </div>
              </div>
            </section>

            {/* TRUST */}

            <section className="rounded-[26px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                <ShieldCheck size={20} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                Campus-first marketplace
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your student identity helps make buying, selling, exchanging,
                and renting safer within your campus community.
              </p>

              <Link
                to="/marketplace"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse Marketplace
                <ArrowRight size={15} />
              </Link>
            </section>
          </aside>
        </div>

        {/* FOOTER */}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>CampusMart AI • Student-to-Student Marketplace</p>

            <p className="inline-flex items-center gap-1">
              Your profile is securely connected to your account.
              <ShieldCheck size={13} />
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
