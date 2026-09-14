import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Login successful but token was not received.");
      }

      // Save authentication data
      localStorage.setItem("campusmart_token", token);

      localStorage.setItem("campusmart_user", JSON.stringify(user));

      console.log("TOKEN SAVED:", localStorage.getItem("campusmart_token"));

      // Go to profile after successful login
      navigate("/profile", {
        replace: true,
      });
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to login. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
        {/* Left Section */}
        <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <ShoppingBag size={23} />
              </div>

              <div>
                <p className="text-xl font-bold">CampusMart</p>

                <p className="text-sm text-slate-400">Student Marketplace</p>
              </div>
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Your campus marketplace, built for students.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-slate-300">
              Buy, sell, exchange and rent products within your campus
              community.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck size={19} className="text-blue-400" />
              Verified student marketplace
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <LockKeyhole size={19} className="text-blue-400" />
              Secure account authentication
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <LockKeyhole size={24} />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to continue to CampusMart.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ?
                      <EyeOff size={18} />
                    : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
