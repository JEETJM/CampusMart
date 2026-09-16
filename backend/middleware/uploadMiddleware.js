const multer = require("multer");
const path = require("path");

// ============================================================
// MEMORY STORAGE
// ============================================================
// File will stay in memory and can be uploaded to Cloudinary
// from the controller/service.
// ============================================================

const storage = multer.memoryStorage();

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only image files are allowed (JPG, JPEG, PNG, WEBP, GIF).",
    ),
    false,
  );
};

// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter,
});

module.exports = upload;