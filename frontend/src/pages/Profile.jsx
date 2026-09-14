import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Edit3,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";

import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);

        // Keep localStorage updated
        localStorage.setItem(
          "campusmart_user",
          JSON.stringify(response.data.user),
        );
      } catch (error) {
        console.error("Profile Error:", error);

        localStorage.removeItem("campusmart_token");
        localStorage.removeItem("campusmart_user");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("campusmart_token");
    localStorage.removeItem("campusmart_user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PROFILE HEADER */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="h-32 bg-slate-950" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              {/* USER */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 shadow-sm">
                  {user.profileImage ?
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  : <User
                      size={42}
                      strokeWidth={1.5}
                      className="text-blue-600"
                    />
                  }
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {user.name}
                    </h1>

                    {user.isVerified && (
                      <BadgeCheck size={20} className="text-blue-600" />
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {user.role === "admin" ?
                      "CampusMart Administrator"
                    : "Student Member"}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">
                  <Edit3 size={16} />
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* PERSONAL INFORMATION */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {/* NAME */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <User size={16} />
                    <span className="text-xs font-medium">Full Name</span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {user.name}
                  </p>
                </div>

                {/* EMAIL */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail size={16} />
                    <span className="text-xs font-medium">Email</span>
                  </div>

                  <p className="mt-2 break-all font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>

                {/* STUDENT ID */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BadgeCheck size={16} />
                    <span className="text-xs font-medium">Student ID</span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {user.studentId}
                  </p>
                </div>

                {/* COLLEGE */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-medium">College</span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {user.college}
                  </p>
                </div>

                {/* LOCATION */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={16} />
                    <span className="text-xs font-medium">Location</span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {user.location || "Not added"}
                  </p>
                </div>

                {/* JOINED */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarDays size={16} />
                    <span className="text-xs font-medium">Member Since</span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            {/* <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/marketplace"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <ShoppingBag size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">Marketplace</p>

                <p className="mt-1 text-xs text-slate-500">Browse products</p>
              </Link>

              <Link
                to="/cart"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <Package size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">My Orders</p>

                <p className="mt-1 text-xs text-slate-500">
                  View your purchases
                </p>
              </Link>

              <Link
                to="/wishlist"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <Heart size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">Wishlist</p>

                <p className="mt-1 text-xs text-slate-500">Saved products</p>
              </Link>
            </div> */}
            {/* QUICK ACTIONS */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* MARKETPLACE */}
              <Link
                to="/marketplace"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <ShoppingBag size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">Marketplace</p>

                <p className="mt-1 text-xs text-slate-500">Browse products</p>
              </Link>

              {/* MY LISTINGS */}
              <Link
                to="/my-listings"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <Package size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">My Listings</p>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your products
                </p>
              </Link>

              {/* MY ORDERS */}
              <Link
                to="/cart"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <Package size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">My Orders</p>

                <p className="mt-1 text-xs text-slate-500">
                  View your purchases
                </p>
              </Link>

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <Heart size={22} className="text-blue-600" />

                <p className="mt-4 font-bold text-slate-900">Wishlist</p>

                <p className="mt-1 text-xs text-slate-500">Saved products</p>
              </Link>
            </div>
          </section>

          {/* ACCOUNT STATUS */}
          <aside>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Account Status
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Account</span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Student Verification
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      user.isVerified ?
                        "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Account Type</span>

                  <span className="font-semibold capitalize text-slate-800">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* SECURITY */}
            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6">
              <div className="flex gap-3">
                <ShieldCheck size={21} className="shrink-0 text-green-600" />

                <div>
                  <h3 className="font-bold text-green-900">
                    Your account is protected
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-green-700">
                    CampusMart uses secure authentication and encrypted password
                    storage to protect your account.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Profile;
