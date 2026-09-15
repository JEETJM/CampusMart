import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("jm382118@gmail.com");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ========================================================
  // THEME
  // ========================================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("campusmart_theme") || "light";

    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add(savedTheme);
  }, []);

  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/admin-login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const loggedUser = response.data?.user;

      const token = response.data?.token || response.data?.accessToken;

      if (!token || !loggedUser) {
        throw new Error("Invalid admin login response.");
      }

      // ====================================================
      // ROLE CHECK
      // ====================================================

      if (String(loggedUser.role || "").toLowerCase() !== "admin") {
        setError("This account does not have admin access.");

        return;
      }

      // ====================================================
      // CLEAR STUDENT SESSION
      // ====================================================

      localStorage.removeItem("campusmart_token");

      localStorage.removeItem("campusmart_user");

      // ====================================================
      // SAVE ADMIN SESSION
      // ====================================================

      localStorage.setItem("campusmart_admin_token", token);

      localStorage.setItem("campusmart_admin_user", JSON.stringify(loggedUser));

      // ====================================================
      // ADMIN DASHBOARD
      // ====================================================

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin Login Error:", error);

      setError(
        error.response?.data?.message || error.message || "Admin login failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* HEADER */}

          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
              <ShieldCheck size={30} />
            </div>

            <div className="mt-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Administration
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                CampusMart Admin
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Sign in to manage the CampusMart platform.
              </p>
            </div>
          </div>

          {/* CARD */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
            {/* ERROR */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300"
                >
                  Admin Email
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    {showPassword ?
                      <EyeOff size={17} />
                    : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                : <>
                    <ShieldCheck size={18} />
                    Admin Sign In
                    <ArrowRight size={17} />
                  </>
                }
              </button>
            </form>

            {/* BACK */}

            <div className="mt-6 border-t border-slate-100 pt-5 text-center dark:border-slate-800">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                <ArrowRight size={14} className="rotate-180" />
                Back to student login
              </Link>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Authorized CampusMart administrators only.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
