import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

import api from "../services/api";

const categories = [
  "Books",
  "Electronics",
  "Cycles",
  "Furniture",
  "Clothing",
  "Accessories",
  "Sports",
  "Notes",
  "Other",
];

const conditions = ["New", "Like New", "Good", "Fair"];

const listingTypes = ["Sell", "Rent", "Exchange"];

function SellProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "Good",
    listingType: "Sell",
    location: "Campus Pickup",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      return "";
    }

    const uploadData = new FormData();
    uploadData.append("image", imageFile);

    const response = await api.post("/upload/image", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("campusmart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.title.trim()) {
      setMessage("Please enter a product title.");
      return;
    }

    if (!formData.description.trim()) {
      setMessage("Please enter a product description.");
      return;
    }

    if (!formData.category) {
      setMessage("Please select a category.");
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      let imageUrl = "";

      if (imageFile) {
        setUploading(true);

        imageUrl = await uploadImageToCloudinary();

        setUploading(false);
      }

      const response = await api.post("/products", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: Number(formData.price),
        condition: formData.condition,
        listingType: formData.listingType,
        location: formData.location.trim(),
        images: imageUrl ? [imageUrl] : [],
      });

      if (response.data.success) {
        setMessage("Product listed successfully.");

        setTimeout(() => {
          navigate("/marketplace");
        }, 800);
      }
    } catch (error) {
      console.error("Sell Product Error:", error);

      setUploading(false);

      const errorMessage =
        error.response?.data?.message ||
        "Unable to list product. Please try again.";

      setMessage(errorMessage);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            List Your Product
          </h1>

          <p className="mt-2 text-slate-600">
            Sell, rent or exchange your products with students on campus.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Main Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Provide accurate details so other students can find your
                  product.
                </p>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Engineering Mathematics Book"
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the product condition, features and other important details..."
                    rows={5}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {formData.description.length}/2000
                  </p>
                </div>

                {/* Category + Condition */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Condition
                    </label>

                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price + Listing Type */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Listing Type
                    </label>

                    <select
                      name="listingType"
                      value={formData.listingType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      {listingTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Pickup Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Example: Campus Gate"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Image
                  </label>

                  {!imagePreview ?
                    <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Upload size={25} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        Choose product image
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG or WEBP up to 5 MB
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  : <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-72 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-slate-100"
                      >
                        <X size={18} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm text-white">
                        {imageFile?.name}
                      </div>
                    </div>
                  }
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                      message.includes("successfully") ?
                        "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message.includes("successfully") && (
                      <CheckCircle2 size={18} />
                    )}

                    <span>{message}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ?
                    <>
                      <Loader2 size={19} className="animate-spin" />

                      {uploading ?
                        "Uploading Image..."
                      : "Publishing Product..."}
                    </>
                  : <>
                      <Upload size={19} />
                      Publish Product
                    </>
                  }
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Preview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon size={19} className="text-blue-600" />

                  <h3 className="font-semibold text-slate-900">
                    Listing Preview
                  </h3>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {imagePreview ?
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-44 w-full object-cover"
                    />
                  : <div className="flex h-44 items-center justify-center text-slate-400">
                      <ImageIcon size={38} />
                    </div>
                  }

                  <div className="p-4">
                    <p className="line-clamp-2 font-semibold text-slate-900">
                      {formData.title || "Your product title"}
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-600">
                      {formData.price ?
                        `₹${Number(formData.price).toLocaleString("en-IN")}`
                      : "₹0"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {formData.category && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                          {formData.category}
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                        {formData.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      AI Seller Assistant
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      AI will later help improve your listing, suggest a fair
                      price and detect potential risks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Safe Campus Marketplace
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Keep transactions within campus and meet at a safe pickup
                      location.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellProduct;
