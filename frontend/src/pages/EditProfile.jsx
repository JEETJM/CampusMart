import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  User,
  X,
  Building2,
  GraduationCap,
} from "lucide-react";

import api from "../services/api";

function EditProfile() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    college: "",
    location: "",
  });

  const [preview, setPreview] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("campusmart_token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data?.user;

        if (!currentUser) {
          throw new Error("User data not found.");
        }

        setUser(currentUser);

        setFormData({
          name: currentUser.name || "",
          studentId: currentUser.studentId || "",
          college: currentUser.college || "",
          location: currentUser.location || "",
        });

        setPreview(currentUser.profileImage || "");

        localStorage.setItem("campusmart_user", JSON.stringify(currentUser));
      } catch (err) {
        console.error("Edit Profile Load Error:", err);

        localStorage.removeItem("campusmart_token");

        localStorage.removeItem("campusmart_user");

        navigate("/login", {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================

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

  // ==========================================
  // REMOVE NEW PHOTO
  // ==========================================

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null);

    setPreview(user?.profileImage || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Full name is required.");

      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name.trim());

      data.append("studentId", formData.studentId.trim());

      data.append("college", formData.college.trim());

      data.append("location", formData.location.trim());

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

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        studentId: updatedUser.studentId || "",
        college: updatedUser.college || "",
        location: updatedUser.location || "",
      });

      setPreview(updatedUser.profileImage || "");

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // VERY IMPORTANT
      // Keep localStorage synchronized
      localStorage.setItem("campusmart_user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/profile", {
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* ======================================
          HEADER
      ======================================= */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <ShieldCheck size={14} />
            Secure Account Settings
          </div>
        </div>
      </header>

      {/* ======================================
          MAIN
      ======================================= */}

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:py-10">
        {/* TITLE */}

        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Edit Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Update your student identity, profile image, and campus information.
          </p>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />

            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-7 lg:grid-cols-[310px_minmax(0,1fr)]"
        >
          {/* ==================================
              PROFILE IMAGE CARD
          =================================== */}

          <section className="h-fit overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)]">
            <div className="h-28 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900" />

            <div className="-mt-14 px-6 pb-6">
              {/* IMAGE */}

              <div className="relative mx-auto h-28 w-28">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl">
                  {preview ?
                    <img
                      src={preview}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  : <User
                      size={46}
                      strokeWidth={1.5}
                      className="text-blue-600"
                    />
                  }
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg ring-4 ring-white transition hover:bg-blue-600"
                >
                  <Camera size={17} />
                </button>
              </div>

              <div className="mt-5 text-center">
                <h2 className="font-bold text-slate-950">
                  {user?.name || "Your Name"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  CampusMart Student
                </p>

                {user?.isVerified && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    <BadgeCheck size={14} />
                    Verified Student
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
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Camera size={16} />
                Change Photo
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveSelectedImage}
                  className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove New Photo
                </button>
              )}

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Profile security
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      JPG, PNG or WEBP. Maximum 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================
              FORM CARD
          =================================== */}

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Student Information
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Personal Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your CampusMart profile accurate.
              </p>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {/* NAME */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* STUDENT ID */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student ID
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
                    placeholder="Student ID"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* COLLEGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Campus / city / pickup location"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            {/* SAVE BUTTON */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ?
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
