import { useEffect, useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const redirectPath = location.state?.from || "/profile";

  // =========================================================
  // THEME
  // =========================================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("campusmart_theme") || "light";

    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add(savedTheme);
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = response.data?.token || response.data?.accessToken;

      const user = response.data?.user || response.data?.data?.user;

      if (!token || !user) {
        throw new Error("Login response was incomplete.");
      }

      // ======================================================
      // BLOCK ADMIN SESSION
      // ======================================================

      if (String(user.role || "").toLowerCase() === "admin") {
        setError("This is an admin account. Please use Admin Login.");

        return;
      }

      // ======================================================
      // CLEAR ADMIN SESSION
      // ======================================================

      localStorage.removeItem("campusmart_admin_token");

      localStorage.removeItem("campusmart_admin_user");

      // ======================================================
      // SAVE STUDENT SESSION
      // ======================================================

      localStorage.setItem("campusmart_token", token);

      localStorage.setItem("campusmart_user", JSON.stringify(user));

      // ======================================================
      // REDIRECT
      // ======================================================

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Student Login Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#f7fbff] px-4 py-10 text-slate-900 transition-colors dark:bg-[#070d18] dark:text-slate-100 sm:px-6">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-500/10" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-500/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-152px)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* BRAND */}

          <div className="mb-7 flex justify-center">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-100 transition group-hover:-translate-y-0.5 dark:shadow-blue-950/40">
                <ShoppingBag size={23} className="text-white" />
              </div>

              <div>
                <p className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  Campus
                  <span className="text-blue-600 dark:text-blue-400">Mart</span>
                  <span className="ml-1 text-xs text-indigo-500 dark:text-indigo-400">
                    AI
                  </span>
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Campus Marketplace
                </p>
              </div>
            </Link>
          </div>

          {/* CARD */}

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(37,99,235,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:p-8">
            {/* HEADER */}

            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Sparkles size={20} />
              </div>

              <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Welcome back
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Sign in to CampusMart
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                Access your student marketplace account.
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  >
                    {showPassword ?
                      <EyeOff size={17} />
                    : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-blue-950/40"
              >
                {loading ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                : <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                }
              </button>
            </form>

            {/* ADMIN LOGIN */}

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">
                    Are you an administrator?
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Use the dedicated admin login.
                  </p>
                </div>

                <Link
                  to="/admin/login"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  <ShieldCheck size={14} />
                  Admin Login
                </Link>
              </div>
            </div>

            {/* REGISTER */}

            <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create one
              </Link>
            </div>

            {/* SECURITY */}

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              Secure student authentication
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
