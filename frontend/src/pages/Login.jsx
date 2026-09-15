import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
} from "lucide-react";

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

  /*
  |--------------------------------------------------------------------------
  | Input Change
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

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

      if (!token) {
        throw new Error("Login token was not returned by the server.");
      }

      localStorage.setItem("campusmart_token", token);

      if (user) {
        localStorage.setItem("campusmart_user", JSON.stringify(user));
      }

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Login Error:", error);

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
    <div className="min-h-[calc(100vh-76px)] bg-slate-50">
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl lg:grid-cols-2">
        {/* ============================================================= */}
        {/* LEFT BRAND PANEL                                               */}
        {/* ============================================================= */}

        <div className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
          {/* Background decoration */}

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Store size={22} className="text-slate-950" />
              </div>

              <div>
                <p className="text-lg font-extrabold text-white">
                  CampusMart
                  <span className="text-blue-400">AI</span>
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Campus Marketplace
                </p>
              </div>
            </Link>
          </div>

          <div className="relative max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
              <ShieldCheck size={14} className="text-blue-400" />
              Built for verified students
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
              Your campus.
              <br />
              Your marketplace.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              Buy, sell, exchange and rent products within your student
              community with smarter AI-powered recommendations.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xl font-bold text-white">Buy</p>

                <p className="mt-1 text-xs text-slate-500">Student products</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xl font-bold text-white">Sell</p>

                <p className="mt-1 text-xs text-slate-500">
                  Earn from unused items
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xl font-bold text-white">AI</p>

                <p className="mt-1 text-xs text-slate-500">Smarter decisions</p>
              </div>
            </div>
          </div>

          <p className="relative text-xs font-medium text-slate-600">
            Secure student marketplace
          </p>
        </div>

        {/* ============================================================= */}
        {/* RIGHT LOGIN FORM                                                */}
        {/* ============================================================= */}

        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}

            <div className="mb-10 flex justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                  <Store size={22} className="text-white" />
                </div>

                <div>
                  <p className="text-lg font-extrabold text-slate-950">
                    CampusMart
                    <span className="text-blue-600">AI</span>
                  </p>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Campus Marketplace
                  </p>
                </div>
              </Link>
            </div>

            {/* Heading */}

            <div>
              <p className="text-sm font-bold text-blue-600">Welcome back</p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                Sign in to CampusMart
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Access your marketplace account and continue where you left off.
              </p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-800"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ?
                      <EyeOff size={17} />
                    : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                : <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </>
                }
              </button>
            </form>

            {/* Register */}

            <div className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-blue-600 transition hover:text-blue-700"
              >
                Create one
              </Link>
            </div>

            {/* Security */}

            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck size={14} />
              Your account is protected with secure authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
