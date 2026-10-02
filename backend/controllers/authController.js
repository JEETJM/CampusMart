const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");

// ============================================================
// JWT HELPER
// ============================================================

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ============================================================
// LOCATION HELPER
// ============================================================

const parseLocationCoordinates = (value) => {
  if (!value) {
    return null;
  }

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (parsed && parsed.lat !== undefined && parsed.lng !== undefined) {
      const lat = Number(parsed.lat);
      const lng = Number(parsed.lng);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return {
          lat,
          lng,
        };
      }
    }
  } catch (error) {
    console.warn("Location Coordinates Parse Error:", error.message);
  }

  return null;
};

// ============================================================
// REGISTER
// ============================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      studentId,
      password,
      college,
      location,
      locationCoordinates,
    } = req.body || {};

    // Required fields
    if (!name || !email || !studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    // Clean values
    const cleanName = String(name).trim();

    const normalizedEmail = String(email).toLowerCase().trim();

    const normalizedStudentId = String(studentId).trim();

    const cleanCollege =
      college !== undefined ?
        String(college).trim()
      : "Narula Institute of Technology";

    const cleanLocation = location !== undefined ? String(location).trim() : "";

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }

    // ========================================================
    // PARSE LOCATION COORDINATES
    // ========================================================

    const parsedLocationCoordinates =
      parseLocationCoordinates(locationCoordinates);

    // ========================================================
    // CHECK EMAIL
    // ========================================================

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // ========================================================
    // CHECK STUDENT ID
    // ========================================================

    const existingStudentId = await User.findOne({
      studentId: normalizedStudentId,
    });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is already registered.",
      });
    }

    // ========================================================
    // HASH PASSWORD
    // ========================================================

    const hashedPassword = await bcrypt.hash(password, 12);

    // ========================================================
    // CREATE USER
    // ========================================================

    const user = await User.create({
      name: cleanName,
      email: normalizedEmail,
      studentId: normalizedStudentId,
      password: hashedPassword,

      college: cleanCollege || "Narula Institute of Technology",

      location: cleanLocation,

      locationCoordinates: parsedLocationCoordinates,

      profileImage: "",
    });

    // ========================================================
    // JWT
    // ========================================================

    const token = generateToken(user._id);

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(201).json({
      success: true,
      message: "Registration successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        college: user.college,
        location: user.location || "",

        locationCoordinates: user.locationCoordinates || null,

        profileImage: user.profileImage || "",

        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

// ============================================================
// STUDENT LOGIN
// ============================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // ========================================================
    // FIND USER
    // ========================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================================
    // BLOCK ADMIN FROM STUDENT LOGIN
    // ========================================================

    if (String(user.role).toLowerCase() === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account detected. Please use Admin Login.",
        code: "ADMIN_ACCOUNT",
      });
    }

    // ========================================================
    // ACTIVE CHECK
    // ========================================================

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact the administrator.",
      });
    }

    // ========================================================
    // PASSWORD CHECK
    // ========================================================

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================================
    // GENERATE TOKEN
    // ========================================================

    const token = generateToken(user._id);

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        college: user.college,
        location: user.location || "",

        locationCoordinates: user.locationCoordinates || null,

        profileImage: user.profileImage || "",

        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

// ============================================================
// ADMIN LOGIN
// ============================================================

const adminLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // ========================================================
    // FIND USER
    // ========================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    // ========================================================
    // ADMIN ROLE CHECK
    // ========================================================

    if (String(user.role).toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "This account does not have admin access.",
        code: "NOT_ADMIN",
      });
    }

    // ========================================================
    // ACTIVE CHECK
    // ========================================================

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "This admin account is inactive.",
      });
    }

    // ========================================================
    // PASSWORD CHECK
    // ========================================================

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    // ========================================================
    // GENERATE TOKEN
    // ========================================================

    const token = generateToken(user._id);

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId || "",
        college: user.college || "",
        location: user.location || "",

        locationCoordinates: user.locationCoordinates || null,

        profileImage: user.profileImage || "",

        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
};

// ============================================================
// GET CURRENT USER
// ============================================================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user.",
    });
  }
};

// ============================================================
// FORGOT PASSWORD
// ============================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, an OTP has been sent.",
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordToken = hashedOTP;

    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // ========================================================
    // EMAIL TEMPLATE
    // ========================================================

    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>CampusMart AI - Password Reset</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f1f5f9;padding:40px 15px;"
  >
    <tr>
      <td align="center">

        <!-- MAIN CARD -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #e2e8f0;
          "
        >

          <!-- HEADER -->
          <tr>
            <td
              style="
                background:#2563eb;
                padding:30px 25px;
                text-align:center;
              "
            >

              <div
                style="
                  display:inline-block;
                  width:58px;
                  height:58px;
                  line-height:58px;
                  background:#ffffff;
                  border-radius:16px;
                  color:#2563eb;
                  font-size:25px;
                  font-weight:bold;
                  margin-bottom:12px;
                "
              >
                CM
              </div>

              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:25px;
                  font-weight:700;
                "
              >
                CampusMart AI
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  color:#dbeafe;
                  font-size:14px;
                "
              >
                Your Campus. Your Marketplace.
              </p>

            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:35px 30px 30px;">

              <h2
                style="
                  margin:0 0 12px;
                  font-size:24px;
                  color:#0f172a;
                "
              >
                Password Reset
              </h2>

              <p
                style="
                  margin:0;
                  color:#475569;
                  font-size:15px;
                  line-height:1.7;
                "
              >
                We received a request to reset your
                CampusMart AI account password.
                Use the verification code below to continue.
              </p>

              <!-- OTP BOX -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin:30px 0;"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      background:#eff6ff;
                      border:1px solid #bfdbfe;
                      border-radius:16px;
                      padding:28px 20px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 12px;
                        color:#64748b;
                        font-size:13px;
                        font-weight:600;
                        text-transform:uppercase;
                        letter-spacing:1px;
                      "
                    >
                      Your Verification Code
                    </p>

                    <div
                      style="
                        font-size:38px;
                        line-height:1.2;
                        font-weight:700;
                        letter-spacing:9px;
                        color:#2563eb;
                      "
                    >
                      ${otp}
                    </div>

                    <p
                      style="
                        margin:15px 0 0;
                        color:#64748b;
                        font-size:13px;
                      "
                    >
                      Enter this 6-digit code in CampusMart AI.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- EXPIRY -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#f8fafc;
                  border-radius:12px;
                  margin-bottom:24px;
                "
              >
                <tr>
                  <td style="padding:15px 18px;">

                    <p
                      style="
                        margin:0;
                        color:#334155;
                        font-size:14px;
                        line-height:1.6;
                      "
                    >
                      <strong>⏱ Valid for 10 minutes</strong>
                      <br />
                      For your security, this verification code
                      will expire after 10 minutes.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- SECURITY WARNING -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#fff7ed;
                  border:1px solid #fed7aa;
                  border-radius:12px;
                  margin-bottom:25px;
                "
              >
                <tr>
                  <td style="padding:16px 18px;">

                    <p
                      style="
                        margin:0 0 5px;
                        color:#9a3412;
                        font-size:14px;
                        font-weight:700;
                      "
                    >
                      Security Notice
                    </p>

                    <p
                      style="
                        margin:0;
                        color:#9a3412;
                        font-size:13px;
                        line-height:1.6;
                      "
                    >
                      Never share this OTP with anyone.
                      CampusMart AI will never ask you to
                      share your verification code.
                    </p>

                  </td>
                </tr>
              </table>

              <p
                style="
                  margin:0;
                  color:#64748b;
                  font-size:13px;
                  line-height:1.7;
                "
              >
                If you did not request a password reset,
                you can safely ignore this email.
                Your account remains secure.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="
                border-top:1px solid #e2e8f0;
                padding:22px 25px;
                text-align:center;
                background:#f8fafc;
              "
            >

              <p
                style="
                  margin:0 0 6px;
                  color:#475569;
                  font-size:13px;
                  font-weight:600;
                "
              >
                CampusMart AI
              </p>

              <p
                style="
                  margin:0;
                  color:#94a3b8;
                  font-size:12px;
                "
              >
                Student-to-Student Campus Marketplace
              </p>

              <p
                style="
                  margin:10px 0 0;
                  color:#cbd5e1;
                  font-size:11px;
                "
              >
                © 2026 CampusMart AI. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    await sendEmail({
      to: normalizedEmail,
      subject: "CampusMart Password Reset OTP",
      html: emailHTML,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }
};

// ============================================================
// VERIFY OTP
// ============================================================

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain exactly 6 digits.",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email: normalizedEmail,

      resetPasswordToken: hashedOTP,

      resetPasswordExpire: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP.",
    });
  }
};

// ============================================================
// RESET PASSWORD
// ============================================================

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email: normalizedEmail,

      resetPasswordToken: hashedOTP,

      resetPasswordExpire: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);

    // Clear OTP
    user.resetPasswordToken = null;

    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }
};

// ============================================================
// UPDATE PROFILE
// ============================================================

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, studentId, college, location, locationCoordinates } =
      req.body || {};

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ========================================================
    // NAME
    // ========================================================

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 2 characters.",
        });
      }

      user.name = cleanName;
    }

    // ========================================================
    // STUDENT ID
    // ========================================================

    if (studentId !== undefined && String(studentId).trim() !== "") {
      const cleanStudentId = String(studentId).trim();

      const duplicateStudent = await User.findOne({
        studentId: cleanStudentId,

        _id: {
          $ne: user._id,
        },
      });

      if (duplicateStudent) {
        return res.status(400).json({
          success: false,
          message: "This Student ID is already in use.",
        });
      }

      user.studentId = cleanStudentId;
    }

    // ========================================================
    // COLLEGE
    // ========================================================

    if (college !== undefined) {
      user.college = String(college).trim();
    }

    // ========================================================
    // LOCATION
    // ========================================================

    if (location !== undefined) {
      user.location = String(location).trim();
    }

    // ========================================================
    // LOCATION COORDINATES
    // ========================================================

    if (locationCoordinates !== undefined) {
      const parsedCoordinates = parseLocationCoordinates(locationCoordinates);

      if (parsedCoordinates) {
        user.locationCoordinates = parsedCoordinates;
      } else {
        user.locationCoordinates = null;
      }
    }

    // ========================================================
    // PROFILE IMAGE
    // ========================================================

    if (req.file) {
      try {
        console.log("Uploading CampusMart profile image...");

        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "campusmart/profile-images",

              resource_type: "image",
            },

            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          uploadStream.end(req.file.buffer);
        });

        // ====================================================
        // DELETE OLD IMAGE
        // ====================================================

        if (user.profileImage && user.profileImage.includes("cloudinary.com")) {
          try {
            const oldUrl = user.profileImage;

            const uploadIndex = oldUrl.indexOf("/upload/");

            if (uploadIndex !== -1) {
              const afterUpload = oldUrl.substring(
                uploadIndex + "/upload/".length,
              );

              const withoutVersion = afterUpload.replace(/^v\d+\//, "");

              const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

              await cloudinary.uploader.destroy(publicId, {
                resource_type: "image",
              });

              console.log("Old profile image removed from Cloudinary.");
            }
          } catch (deleteError) {
            console.warn(
              "Old profile image deletion failed:",
              deleteError.message,
            );
          }
        }

        user.profileImage = result.secure_url;

        console.log("Profile image uploaded successfully.");
      } catch (uploadError) {
        console.error("Profile Image Upload Error:", uploadError);

        return res.status(500).json({
          success: false,
          message: "Failed to upload profile image.",
        });
      }
    }

    // ========================================================
    // SAVE
    // ========================================================

    await user.save();

    // ========================================================
    // UPDATED USER
    // ========================================================

    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      college: user.college,
      location: user.location || "",

      locationCoordinates: user.locationCoordinates || null,

      profileImage: user.profileImage || "",

      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,

      createdAt: user.createdAt,

      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  registerUser,
  loginUser,
  adminLoginUser,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
};
