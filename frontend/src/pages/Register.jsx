import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password,
      }
    );

    console.log("Register Response:", response.data);

    // Save JWT token
    localStorage.setItem("campusmart_token", response.data.token);

    // Save user information
    localStorage.setItem(
      "campusmart_user",
      JSON.stringify(response.data.user)
    );

    alert("Account created successfully!");

    navigate("/profile");
  } catch (error) {
    console.error("Register Error:", error);

    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    alert(message);
  }
};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* LEFT — BRAND PANEL */}
        <div className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <UserPlus size={22} />
              </div>

              <div>
                <p className="text-lg font-bold">CampusMart AI</p>
                <p className="text-xs text-slate-400">Campus Marketplace</p>
              </div>
            </Link>

            <div className="mt-24 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Join your campus marketplace
              </p>

              <h1 className="mt-4 text-5xl font-bold leading-tight">
                Buy, sell and exchange smarter.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Create your student account and connect with verified students
                around your campus.
              </p>
            </div>

            <div className="mt-12 space-y-5">
              <div className="flex gap-4">
                <BadgeCheck className="mt-0.5 text-blue-400" size={22} />

                <div>
                  <p className="font-semibold">Verified Student Community</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Connect with students from your campus.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="mt-0.5 text-blue-400" size={22} />

                <div>
                  <p className="font-semibold">Safer Transactions</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Built for trusted campus-to-campus transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">© 2026 CampusMart AI</p>
        </div>

        {/* RIGHT — REGISTER FORM */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}
            <Link to="/" className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <UserPlus size={21} />
              </div>

              <div>
                <p className="font-bold text-slate-900">CampusMart AI</p>

                <p className="text-xs text-slate-500">Campus Marketplace</p>
              </div>
            </Link>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join your campus marketplace in a few steps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* STUDENT ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student ID
                </label>

                <div className="relative">
                  <BadgeCheck
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Enter your student ID"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Your student ID will be used for campus verification.
                </p>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ?
                      <EyeOff size={18} />
                    : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPassword ?
                      <EyeOff size={18} />
                    : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I agree to the CampusMart terms and understand that my student
                  account will be verified.
                </span>
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            {/* LOGIN */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
