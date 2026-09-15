import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import api from "../services/api";
import LocationPicker from "../components/LocationPicker";

function Register() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "Narula Institute of Technology",
    studentId: "",
    location: "",
  });

  const [locationCoordinates, setLocationCoordinates] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     THEME SAFETY
  ========================================================== */

  useEffect(() => {
    const savedTheme = localStorage.getItem("campusmart_theme") || "light";

    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add(savedTheme);
  }, []);

  /* =========================================================
     INPUT CHANGE
  ========================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /* =========================================================
     IMAGE
  ========================================================== */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be smaller than 5MB.");
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));

    setError("");
    setSuccess("");
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* Basic validation */

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

    if (!formData.location.trim()) {
      setError("Please select your campus location.");
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

      /* =====================================================
         REGISTER
      ====================================================== */

      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        studentId: formData.studentId.trim(),
        location: formData.location.trim(),

        locationCoordinates:
          locationCoordinates ?
            {
              lat: Number(locationCoordinates.lat),
              lng: Number(locationCoordinates.lng),
            }
          : null,
      });

      const token = response.data?.token || response.data?.accessToken;

      let user = response.data?.user || response.data?.data?.user;

      /* =====================================================
         TOKEN RECEIVED
      ====================================================== */

      if (token) {
        localStorage.setItem("campusmart_token", token);

        if (user) {
          localStorage.setItem("campusmart_user", JSON.stringify(user));
        }

        /* ===================================================
           PROFILE IMAGE + LOCATION SYNC
        ==================================================== */

        try {
          const imageData = new FormData();

          if (profileImage) {
            imageData.append("profileImage", profileImage);
          }

          imageData.append("name", formData.name.trim());

          imageData.append("studentId", formData.studentId.trim());

          imageData.append("college", formData.college.trim());

          imageData.append("location", formData.location.trim());

          if (locationCoordinates) {
            imageData.append(
              "locationCoordinates",
              JSON.stringify({
                lat: Number(locationCoordinates.lat),
                lng: Number(locationCoordinates.lng),
              }),
            );
          }

          const profileResponse = await api.put("/auth/profile", imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          user = profileResponse.data?.user || user;

          if (user) {
            localStorage.setItem("campusmart_user", JSON.stringify(user));
          }
        } catch (profileError) {
          /*
           * Account was successfully created.
           * Profile/image sync failure should not
           * cancel the registration.
           */

          console.error("Profile Sync Error:", profileError);
        }

        setSuccess("Account created successfully. Redirecting...");

        setTimeout(() => {
          navigate("/profile", {
            replace: true,
          });
        }, 900);

        return;
      }

      /* =====================================================
         NO TOKEN
      ====================================================== */

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
    <main className="min-h-[calc(100vh-72px)] bg-[#f7fbff] px-4 py-8 text-slate-900 transition-colors dark:bg-[#070d18] dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* =====================================================
            BRAND
        ====================================================== */}

        <div className="mb-6 flex justify-center">
          <Link to="/" className="group inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-100 transition group-hover:-translate-y-0.5 dark:shadow-blue-950/40">
              <ShoppingBag size={21} className="text-white" />
            </div>

            <div>
              <p className="text-[19px] font-black tracking-tight text-slate-950 dark:text-white">
                Campus
                <span className="text-blue-600 dark:text-blue-400">Mart</span>
                <span className="ml-1 text-xs text-indigo-500 dark:text-indigo-400">
                  AI
                </span>
              </p>

              <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                Campus Marketplace
              </p>
            </div>
          </Link>
        </div>

        {/* =====================================================
            CARD
        ====================================================== */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(37,99,235,0.10)] transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_70px_rgba(0,0,0,0.40)] sm:p-8">
          {/* HEADER */}

          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Join CampusMart
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Set up your student profile in a few steps.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* =================================================
                PROFILE IMAGE
            ================================================== */}

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-dashed border-blue-200 bg-blue-50 dark:border-slate-700 dark:bg-slate-800">
                  {preview ?
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  : <div className="text-center">
                      <ImagePlus
                        size={24}
                        className="mx-auto text-blue-500 dark:text-blue-400"
                      />

                      <p className="mt-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        Profile
                      </p>
                    </div>
                  }
                </div>

                {preview ?
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                : <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:shadow-blue-950/40"
                    aria-label="Upload profile picture"
                  >
                    <Camera size={16} />
                  </button>
                }
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {preview ? "Change profile picture" : "Add profile picture"}
              </button>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                JPG, PNG or WEBP · Max 5MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* =================================================
                BASIC INFORMATION
            ================================================== */}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300"
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
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-950/40"
                  />
                </div>
              </div>

              {/* STUDENT ID */}

              <div>
                <label
                  htmlFor="studentId"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300"
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
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                />
              </div>
            </div>

            {/* =================================================
                EMAIL
            ================================================== */}

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
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                />
              </div>
            </div>

            {/* =================================================
                COLLEGE
            ================================================== */}

            <div>
              <label
                htmlFor="college"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300"
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
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
              />
            </div>

            {/* =================================================
                LOCATION
            ================================================== */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Campus / Location
              </label>

              <p className="mb-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Search your campus or use your current location.
              </p>

              <LocationPicker
                value={formData.location}
                onChange={(location) => {
                  setFormData((previous) => ({
                    ...previous,
                    location,
                  }));

                  setError("");
                  setSuccess("");
                }}
                coordinates={locationCoordinates}
                onCoordinatesChange={setLocationCoordinates}
                placeholder="Search campus, building, area or street"
                required
                showMap={false}
              />

              {locationCoordinates && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 size={15} />
                    Location coordinates saved
                  </div>

                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                    GPS: {Number(locationCoordinates.lat).toFixed(6)},{" "}
                    {Number(locationCoordinates.lng).toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300"
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
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ?
                    <EyeOff size={16} />
                  : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <X size={17} className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================== */}

            {success && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

                <span>{success}</span>
              </div>
            )}

            {/* SECURITY NOTE */}

            <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-emerald-500"
              />

              <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                Create a verified student account and use CampusMart
                responsibly.
              </p>
            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-blue-950/40"
            >
              {loading ?
                <>
                  <Loader2 size={17} className="animate-spin" />
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

          {/* LOGIN LINK */}

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
