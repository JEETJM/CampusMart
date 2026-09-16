import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Mail,
  Save,
  ShieldCheck,
  User,
  X,
  Building2,
  GraduationCap,
} from "lucide-react";

import api from "../services/api";
import LocationPicker from "../components/LocationPicker";

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef(null);

  // ==========================================================
  // DETECT ADMIN PROFILE EDIT
  // ==========================================================

  const isAdminProfileEdit = location.pathname.startsWith(
    "/admin/profile/edit",
  );

  const profilePath = isAdminProfileEdit ? "/admin/profile" : "/profile";

  const loginPath = isAdminProfileEdit ? "/admin/login" : "/login";

  // ==========================================================
  // STATE
  // ==========================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    college: "",
    location: "",
  });

  const [locationCoordinates, setLocationCoordinates] = useState(null);

  const [preview, setPreview] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // ==========================================================
  // LOAD USER
  // ==========================================================

  useEffect(() => {
    const fetchUser = async () => {
      const studentToken = localStorage.getItem("campusmart_token");

      const adminToken = localStorage.getItem("campusmart_admin_token");

      const selectedToken = isAdminProfileEdit ? adminToken : studentToken;

      // --------------------------------------------------------
      // TOKEN CHECK
      // --------------------------------------------------------

      if (!selectedToken) {
        navigate(loginPath, {
          replace: true,
        });

        return;
      }

      try {
        setLoading(true);

        const response = await api.get("/auth/me");

        const currentUser = response.data?.user;

        if (!currentUser) {
          throw new Error("User data not found.");
        }

        // ------------------------------------------------------
        // ROLE VALIDATION
        // ------------------------------------------------------

        const currentRole = String(currentUser.role || "").toLowerCase();

        if (isAdminProfileEdit && currentRole !== "admin") {
          throw new Error("Admin account required.");
        }

        if (!isAdminProfileEdit && currentRole === "admin") {
          throw new Error("Admin account detected.");
        }

        setUser(currentUser);

        setFormData({
          name: currentUser.name || "",
          studentId: currentUser.studentId || "",
          college: currentUser.college || "",
          location: currentUser.location || "",
        });

        setPreview(currentUser.profileImage || "");

        // ------------------------------------------------------
        // EXISTING LOCATION COORDINATES
        // ------------------------------------------------------

        if (
          currentUser.locationCoordinates &&
          typeof currentUser.locationCoordinates === "object"
        ) {
          const lat = Number(currentUser.locationCoordinates.lat);

          const lng = Number(currentUser.locationCoordinates.lng);

          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            setLocationCoordinates({
              lat,
              lng,
            });
          }
        }

        // ------------------------------------------------------
        // SAVE CORRECT SESSION
        // ------------------------------------------------------

        if (isAdminProfileEdit) {
          localStorage.setItem(
            "campusmart_admin_user",
            JSON.stringify(currentUser),
          );
        } else {
          localStorage.setItem("campusmart_user", JSON.stringify(currentUser));
        }
      } catch (err) {
        console.error("Edit Profile Load Error:", err);

        if (isAdminProfileEdit) {
          localStorage.removeItem("campusmart_admin_token");

          localStorage.removeItem("campusmart_admin_user");
        } else {
          localStorage.removeItem("campusmart_token");

          localStorage.removeItem("campusmart_user");
        }

        navigate(loginPath, {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, isAdminProfileEdit, loginPath]);

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // IMAGE SELECT
  // ==========================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");

      return;
    }

    setError("");
    setSuccess("");

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  // ==========================================================
  // REMOVE NEW IMAGE
  // ==========================================================

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null);

    setPreview(user?.profileImage || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Full name is required.");

      return;
    }

    if (!formData.location.trim()) {
      setError("Please select your location.");

      return;
    }

    if (
      !locationCoordinates ||
      !Number.isFinite(Number(locationCoordinates.lat)) ||
      !Number.isFinite(Number(locationCoordinates.lng))
    ) {
      setError("Please select a valid location or use your current location.");

      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name.trim());

      data.append("studentId", formData.studentId.trim());

      data.append("college", formData.college.trim());

      data.append("location", formData.location.trim());

      // --------------------------------------------------------
      // LOCATION COORDINATES
      // --------------------------------------------------------

      data.append(
        "locationCoordinates",
        JSON.stringify({
          lat: Number(locationCoordinates.lat),
          lng: Number(locationCoordinates.lng),
        }),
      );

      // --------------------------------------------------------
      // PROFILE IMAGE
      // --------------------------------------------------------

      if (selectedFile) {
        data.append("profileImage", selectedFile);
      }

      const response = await api.put("/auth/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error("Updated user data was not returned.");
      }

      // --------------------------------------------------------
      // UPDATE STATE
      // --------------------------------------------------------

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        studentId: updatedUser.studentId || "",
        college: updatedUser.college || "",
        location: updatedUser.location || "",
      });

      setPreview(updatedUser.profileImage || "");

      // --------------------------------------------------------
      // UPDATED COORDINATES
      // --------------------------------------------------------

      if (updatedUser.locationCoordinates) {
        const lat = Number(updatedUser.locationCoordinates.lat);

        const lng = Number(updatedUser.locationCoordinates.lng);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          setLocationCoordinates({
            lat,
            lng,
          });
        }
      }

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // --------------------------------------------------------
      // SAVE CORRECT LOCAL STORAGE
      // --------------------------------------------------------

      if (isAdminProfileEdit) {
        localStorage.setItem(
          "campusmart_admin_user",
          JSON.stringify(updatedUser),
        );
      } else {
        localStorage.setItem("campusmart_user", JSON.stringify(updatedUser));
      }

      setSuccess("Profile updated successfully.");

      // --------------------------------------------------------
      // REDIRECT TO CORRECT PROFILE
      // --------------------------------------------------------

      setTimeout(() => {
        navigate(profilePath, {
          replace: true,
        });
      }, 1000);
    } catch (err) {
      console.error("Update Profile Error:", err);

      setError(err.response?.data?.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4 dark:bg-[#070d18]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />

          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to={profilePath}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <ShieldCheck size={14} />

            {isAdminProfileEdit ?
              "Admin Account Settings"
            : "Secure Account Settings"}
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:py-10">
        {/* TITLE */}

        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            {isAdminProfileEdit ? "Administrator Settings" : "Account Settings"}
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Edit Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {isAdminProfileEdit ?
              "Update your CampusMart administrator profile and account information."
            : "Update your student identity, profile image, and campus location."
            }
          </p>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100 dark:hover:bg-red-500/10"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-7 lg:grid-cols-[310px_minmax(0,1fr)]"
        >
          {/* =================================================
              PROFILE IMAGE CARD
          ================================================== */}

          <section className="h-fit overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.65)]">
            <div className="h-28 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900" />

            <div className="-mt-14 px-6 pb-6">
              <div className="relative mx-auto h-28 w-28">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl dark:border-slate-800 dark:from-slate-800 dark:to-slate-700">
                  {preview ?
                    <img
                      src={preview}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  : <User
                      size={46}
                      strokeWidth={1.5}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  }
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg ring-4 ring-white transition hover:bg-blue-600 dark:ring-slate-900"
                >
                  <Camera size={17} />
                </button>
              </div>

              <div className="mt-5 text-center">
                <h2 className="font-bold text-slate-950 dark:text-white">
                  {user.name || "Your Name"}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {isAdminProfileEdit ?
                    "CampusMart Administrator"
                  : "CampusMart Student"}
                </p>

                {user.isVerified && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <BadgeCheck size={14} />

                    {isAdminProfileEdit ? "Verified Admin" : "Verified Student"}
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              >
                <Camera size={16} />
                Change Photo
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveSelectedImage}
                  className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Remove New Photo
                </button>
              )}

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="shrink-0 text-emerald-600 dark:text-emerald-400"
                  />

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Profile security
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                      JPG, PNG or WEBP. Maximum 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              FORM CARD
          ================================================== */}

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.65)] sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                {isAdminProfileEdit ?
                  "Administrator Information"
                : "Student Information"}
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                Personal Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Keep your CampusMart profile accurate.
              </p>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {/* NAME */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* STUDENT / ADMIN ID */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {isAdminProfileEdit ? "Admin ID" : "Student ID"}
                </label>

                <div className="relative">
                  <GraduationCap
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder={isAdminProfileEdit ? "Admin ID" : "Student ID"}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* COLLEGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  College
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Your college"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div className="sm:col-span-2">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Campus / Pickup Location
                    </label>

                    <p className="mt-1 text-xs text-slate-400">
                      Search your location or use your current location.
                    </p>
                  </div>

                  {locationCoordinates && (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Location coordinates saved
                    </span>
                  )}
                </div>

                <LocationPicker
                  value={formData.location}
                  onChange={(locationValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      location: locationValue,
                    }));

                    setError("");
                    setSuccess("");
                  }}
                  coordinates={locationCoordinates}
                  onCoordinatesChange={(coordinates) => {
                    setLocationCoordinates(coordinates);

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Search campus, building, street or area"
                  showMap={true}
                />

                {locationCoordinates && (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/10">
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                      <span>
                        Latitude: {Number(locationCoordinates.lat).toFixed(6)}
                      </span>

                      <span>
                        Longitude: {Number(locationCoordinates.lng).toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SAVE */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
              <Link
                to={profilePath}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                {saving ?
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950" />
                    Saving Changes...
                  </>
                : <>
                    <Save size={17} />
                    Save Changes
                  </>
                }
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;
