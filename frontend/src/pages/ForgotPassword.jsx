import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // STEP 1 - SEND OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: formData.email,
      });

      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(formData.otp)) {
      setError("OTP must contain exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-reset-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 - RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (formData.newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        {/* BACK */}
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        {/* CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          {/* HEADER */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              {step === 1 && <Mail size={25} />}

              {step === 2 && <KeyRound size={25} />}

              {step === 3 && <LockKeyhole size={25} />}
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              {step === 1 && "Forgot Password?"}

              {step === 2 && "Verify OTP"}

              {step === 3 && "Create New Password"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {step === 1 &&
                "Enter your registered email address and we'll send you a verification code."}

              {step === 2 &&
                "Enter the 6-digit OTP sent to your email address."}

              {step === 3 &&
                "Create a new secure password for your CampusMart account."}
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div
              className={`h-2 w-16 rounded-full ${
                step >= 1 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />

            <div
              className={`h-2 w-16 rounded-full ${
                step >= 2 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />

            <div
              className={`h-2 w-16 rounded-full ${
                step >= 3 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="mt-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <p className="text-sm leading-6 text-emerald-700">{message}</p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm leading-6 text-red-600">{error}</p>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="mt-7 space-y-5">
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
                    placeholder="Enter your registered email"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Verification Code
                </label>

                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                    setFormData((prev) => ({
                      ...prev,
                      otp: value,
                    }));
                  }}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-xl font-bold tracking-[0.5em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  OTP is valid for 10 minutes.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}

                {!loading && <ArrowRight size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setError("");
                }}
                className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Resetting Password..." : "Reset Password"}

                {!loading && <CheckCircle2 size={18} />}
              </button>
            </form>
          )}

          {/* SECURITY INFO */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Secure Password Recovery
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your verification code is securely processed and expires after
                  10 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
