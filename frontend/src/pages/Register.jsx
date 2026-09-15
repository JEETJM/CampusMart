import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "Narula Institute of Technology",
    studentId: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.studentId.trim()) {
      setError("Please enter your student ID.");
      return;
    }

    if (!formData.password) {
      setError("Please create a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        studentId: formData.studentId.trim(),
        location: formData.location.trim(),
      });

      const token = response.data?.token || response.data?.accessToken;

      const user = response.data?.user || response.data?.data?.user;

      if (token) {
        localStorage.setItem("campusmart_token", token);

        if (user) {
          localStorage.setItem("campusmart_user", JSON.stringify(user));
        }

        navigate("/profile", {
          replace: true,
        });

        return;
      }

      setSuccess("Account created successfully. Redirecting to sign in...");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error("Register Error:", error);

      setError(
        error.response?.data?.message || "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-slate-50">
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl lg:grid-cols-2">
        {/* ============================================================= */}
        {/* LEFT PANEL                                                     */}
        {/* ============================================================= */}

        <div className="relative hidden overflow-hidden bg-blue-600 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-slate-950/20 blur-3xl" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Store size={22} className="text-blue-600" />
              </div>

              <div>
                <p className="text-lg font-extrabold text-white">
                  CampusMart
                  <span className="text-blue-200">AI</span>
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Campus Marketplace
                </p>
              </div>
            </Link>
          </div>

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
              <ShieldCheck size={14} />
              Student-first marketplace
            </div>

            <h1 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
              Turn unused things into
              <span className="text-blue-100"> value.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
              Create your account and connect with students around your campus
              to buy, sell, exchange and rent.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck size={18} className="text-white" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Student-focused
                  </p>

                  <p className="text-xs text-blue-100">
                    Designed around campus life
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Store size={18} className="text-white" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Buy & sell locally
                  </p>

                  <p className="text-xs text-blue-100">
                    Convenient campus pickup
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative text-xs font-medium text-blue-200">
            CampusMart AI
          </p>
        </div>

        {/* ============================================================= */}
        {/* RIGHT FORM                                                     */}
        {/* ============================================================= */}

        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-xl">
            {/* Mobile Logo */}

            <div className="mb-8 flex justify-center lg:hidden">
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
              <p className="text-sm font-bold text-blue-600">Join CampusMart</p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Set up your student profile and start using your campus
                marketplace.
              </p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* Student ID */}

                <div>
                  <label
                    htmlFor="studentId"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Student ID
                  </label>

                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="College student ID"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

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
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* College */}

              <div>
                <label
                  htmlFor="college"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  College
                </label>

                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Your college"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Location */}

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Campus / Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Campus location"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      {showPassword ?
                        <EyeOff size={16} />
                      : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-5 text-green-700">
                  {success}
                </div>
              )}

              {/* Terms */}

              <p className="text-xs leading-5 text-slate-400">
                By creating an account, you agree to use CampusMart responsibly
                and follow your campus marketplace guidelines.
              </p>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating account...
                  </>
                : <>
                    Create account
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </>
                }
              </button>
            </form>

            {/* Login */}

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 transition hover:text-blue-700"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck size={14} />
              Your student account is securely authenticated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
