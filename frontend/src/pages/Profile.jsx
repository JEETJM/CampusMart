import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Heart,
  Link2,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  User,
} from "lucide-react";

import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH CURRENT USER
  ========================================================= */

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
        setLoading(true);

        const response = await api.get("/auth/me");

        const currentUser = response.data?.user;

        if (!currentUser) {
          throw new Error("User information not found.");
        }

        setUser(currentUser);

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

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("campusmart_token");

    localStorage.removeItem("campusmart_user");

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================================================
     MEMBER SINCE
  ========================================================= */

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

  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

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

  /* =========================================================
     ACTIVITY ITEMS
  ========================================================= */

  const actionItems = [
    {
      title: "Marketplace",
      description: "Discover products across your campus.",
      icon: ShoppingBag,
      to: "/marketplace",
    },
    {
      title: "My Listings",
      description: "Manage the products you listed.",
      icon: Package,
      to: "/my-listings",
    },
    {
      title: "My Orders",
      description: "Track your purchases and deliveries.",
      icon: Store,
      to: "/orders",
    },
    {
      title: "My Sales",
      description: "Manage orders from your buyers.",
      icon: ShoppingBag,
      to: "/seller-orders",
    },
    {
      title: "Wishlist",
      description: "View the products you saved.",
      icon: Heart,
      to: "/wishlist",
    },
    {
      title: "Messages",
      description: "Connect with buyers and sellers.",
      icon: MessageCircle,
      to: "/chat",
    },
    {
      title: "My Exchange Offers",
      description: "Track your exchange requests.",
      icon: ArrowRightLeft,
      to: "/my-exchange-offers",
    },
    {
      title: "Received Offers",
      description: "Review offers from other students.",
      icon: ArrowRightLeft,
      to: "/exchange-offers",
    },
    {
      title: "My Rentals",
      description: "Track products you requested to rent.",
      icon: CalendarDays,
      to: "/my-rentals",
    },
    {
      title: "Rental Requests",
      description: "Manage rental requests from students.",
      icon: CalendarDays,
      to: "/rental-requests",
    },
  ];

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#070d18]">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_70px_-35px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_70px_-35px_rgba(0,0,0,0.6)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
              <Loader2 size={23} className="animate-spin text-white" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Loading your profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Securely loading your CampusMart account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      {/* ======================================================
          TOP NAV
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-500/10">
              <ArrowRight size={16} className="rotate-180" />
            </span>
            Back to Home
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/profile/edit"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400 sm:inline-flex"
            >
              <Edit3 size={16} />
              Edit Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 dark:bg-white dark:text-slate-950 dark:hover:bg-red-500 dark:hover:text-white"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* ==================================================
            INTRO
        ================================================== */}

        <div className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
            Account Center
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Welcome back, {user.name?.split(" ")[0]}.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Manage your student identity, marketplace activity, exchanges,
                rentals and account settings from one place.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account active
            </div>
          </div>
        </div>

        {/* ==================================================
            PREMIUM HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_30px_100px_-45px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_30px_100px_-45px_rgba(0,0,0,0.65)]">
          {/* BACKGROUND GLOW */}

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-32 h-[330px] w-[330px] rounded-full bg-blue-100 blur-3xl dark:bg-blue-500/15" />

            <div className="absolute right-[-100px] top-[-80px] h-[390px] w-[390px] rounded-full bg-indigo-100 blur-3xl dark:bg-indigo-500/15" />

            <div className="absolute bottom-[-130px] left-[40%] h-[300px] w-[300px] rounded-full bg-cyan-100 blur-3xl dark:bg-cyan-500/10" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8">
              {/* META */}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
                  <Sparkles
                    size={14}
                    className="text-blue-600 dark:text-blue-300"
                  />
                  CampusMart AI Member
                </div>

                {user.isVerified ?
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <BadgeCheck size={14} />
                    Verified Student
                  </div>
                : <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-300">
                    <ShieldCheck size={14} />
                    Verification Pending
                  </div>
                }
              </div>

              {/* USER */}

              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-end">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* AVATAR */}

                  <div className="relative w-fit shrink-0">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border-[5px] border-white bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl dark:border-slate-800 dark:from-slate-800 dark:to-slate-700 sm:h-32 sm:w-32">
                      {user.profileImage ?
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      : <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                          {userInitial}
                        </span>
                      }
                    </div>

                    <div
                      className={`absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg dark:border-slate-950 ${
                        user.isVerified ?
                          "bg-blue-600 text-white"
                        : "bg-slate-700 text-white"
                      }`}
                    >
                      <BadgeCheck size={17} />
                    </div>
                  </div>

                  {/* USER INFO */}

                  <div className="min-w-0">
                    <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {user.name}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {user.role === "admin" ?
                        "CampusMart Administrator"
                      : "Student Member"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <Mail size={13} />
                        <span className="truncate">{user.email}</span>
                      </div>

                      {user.location && (
                        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          <MapPin size={13} />

                          <span className="truncate">{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROFILE STRENGTH */}

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Profile strength
                      </p>

                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                        {profileCompletion}%
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-700"
                      style={{
                        width: `${profileCompletion}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-500">
                      Keep your profile updated
                    </span>

                    <Link
                      to="/profile/edit"
                      className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Complete
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INFO STRIP */}

          <div className="grid border-t border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-white/[0.03] md:grid-cols-3">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 md:border-b-0 md:border-r">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Student ID
              </p>

              <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
                {user.studentId || "Not added yet"}
              </p>
            </div>

            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 md:border-b-0 md:border-r">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Institution
              </p>

              <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
                {user.college || "Not added yet"}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Member Since
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <CalendarDays
                  size={15}
                  className="text-blue-600 dark:text-blue-400"
                />

                {memberSince}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-8">
            {/* PERSONAL INFORMATION */}

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_60px_-40px_rgba(0,0,0,0.6)] sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                    Identity
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Your student account information.
                  </p>
                </div>

                <Link
                  to="/profile/edit"
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </Link>
              </div>

              <div className="mt-7 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                <ProfileRow
                  icon={User}
                  label="Full Name"
                  value={user.name}
                  accent="blue"
                />

                <ProfileRow
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                  accent="violet"
                />

                <ProfileRow
                  icon={BadgeCheck}
                  label="Student ID"
                  value={user.studentId || "Not added"}
                  accent="emerald"
                />

                <ProfileRow
                  icon={ShieldCheck}
                  label="College"
                  value={user.college || "Not added"}
                  accent="indigo"
                />

                <ProfileRow
                  icon={MapPin}
                  label="Location"
                  value={user.location || "Not added"}
                  accent="rose"
                />

                <ProfileRow
                  icon={CalendarDays}
                  label="Member Since"
                  value={memberSince}
                  accent="amber"
                />
              </div>
            </section>

            {/* ACTIVITY */}

            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                    Marketplace
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Your Activity
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage buying, selling, exchanging and renting from one
                    place.
                  </p>
                </div>

                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Explore
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {actionItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_45px_-34px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_55px_-32px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_12px_45px_-34px_rgba(0,0,0,0.55)] dark:hover:border-blue-700"
                    >
                      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-50 blur-2xl opacity-0 transition group-hover:opacity-100 dark:bg-blue-500/10" />

                      <div className="relative flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
                          <Icon size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>
                        </div>

                        <ChevronRight
                          size={18}
                          className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside className="space-y-6">
            {/* ACCOUNT OVERVIEW */}

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_60px_-40px_rgba(0,0,0,0.6)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Trust & Security
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                Account Overview
              </h3>

              <div className="mt-6 space-y-3">
                <StatusCard
                  icon={CheckCircle2}
                  title="Account Status"
                  description="Your account is active"
                  status="Active"
                  statusClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                />

                <StatusCard
                  icon={BadgeCheck}
                  title="Student Verification"
                  description="Campus identity verification"
                  status={user.isVerified ? "Verified" : "Pending"}
                  statusClass={
                    user.isVerified ?
                      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                  }
                  iconClass={
                    user.isVerified ?
                      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  }
                />

                <StatusCard
                  icon={User}
                  title="Account Type"
                  description="Your CampusMart role"
                  status={user.role || "student"}
                  statusClass="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  iconClass="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                />
              </div>
            </section>

            {/* SECURITY */}

            <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:shadow-[0_25px_70px_-35px_rgba(0,0,0,0.7)]">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-100 blur-3xl dark:bg-blue-500/15" />

              <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-indigo-100 blur-3xl dark:bg-indigo-500/10" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-white/[0.06]">
                  <LockKeyhole
                    size={20}
                    className="text-blue-600 dark:text-blue-300"
                  />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
                  Secure by design
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Your CampusMart session is protected with authenticated access
                  and secure account handling.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-300/10 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <CheckCircle2 size={14} />
                  Secure session active
                </div>
              </div>
            </section>

            {/* CAMPUS */}

            <section className="rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100 dark:bg-slate-800 dark:text-blue-400 dark:ring-slate-700">
                <ShieldCheck size={21} />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
                Built for campus communities
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Verified student profiles help make buying, selling, exchanging
                and renting safer inside your campus marketplace.
              </p>

              <div className="mt-5 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  Student-focused marketplace
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  Campus-first transactions
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  AI-ready platform
                </div>
              </div>

              <Link
                to="/marketplace"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                Browse Marketplace
                <ArrowRight size={15} />
              </Link>
            </section>

            {/* QUICK LINKS */}

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_60px_-40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Shortcuts
                  </p>

                  <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                    Quick Links
                  </h3>
                </div>

                <Link2
                  size={18}
                  className="text-slate-300 dark:text-slate-600"
                />
              </div>

              <div className="mt-5 space-y-2">
                <QuickLink to="/sell" label="List a Product" icon={Package} />

                <QuickLink to="/cart" label="Open Cart" icon={ShoppingBag} />

                <QuickLink to="/wishlist" label="View Wishlist" icon={Heart} />

                <QuickLink
                  to="/chat"
                  label="Open Messages"
                  icon={MessageCircle}
                />

                <QuickLink
                  to="/my-rentals"
                  label="My Rentals"
                  icon={CalendarDays}
                />

                <QuickLink
                  to="/rental-requests"
                  label="Rental Requests"
                  icon={CalendarDays}
                />
              </div>
            </section>
          </aside>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>CampusMart AI · Student-to-Student Marketplace</p>

          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} />
            Secure account connected
          </p>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PROFILE ROW
========================================================= */

function ProfileRow({ icon: Icon, label, value, accent }) {
  const accentMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div className="group flex items-center gap-4 px-4 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:px-5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentMap[accent]}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  icon: Icon,
  title,
  description,
  status,
  statusClass,
  iconClass,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${statusClass}`}
      >
        {status}
      </span>
    </div>
  );
}

/* =========================================================
   QUICK LINK
========================================================= */

function QuickLink({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-slate-800"
    >
      <div className="flex items-center gap-3">
        <Icon
          size={17}
          className="text-slate-500 transition group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400"
        />

        <span className="text-sm font-semibold text-slate-700 transition group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white">
          {label}
        </span>
      </div>

      <ChevronRight
        size={16}
        className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400"
      />
    </Link>
  );
}

export default Profile;
