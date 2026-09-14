const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "campusmart/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);

          return res.status(500).json({
            success: false,
            message: "Image upload failed.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Image uploaded successfully.",
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Upload Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while uploading image.",
    });
  }
};

module.exports = {
  uploadImage,
};