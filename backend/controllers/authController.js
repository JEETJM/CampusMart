const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ===============================
// JWT HELPER
// ===============================
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ===============================
// REGISTER
// ===============================
const registerUser = async (req, res) => {
  try {
    const { name, email, studentId, password, college } = req.body || {};

    if (!name || !email || !studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const normalizedStudentId = studentId.trim();

    // Check existing email
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Check existing student ID
    const existingStudentId = await User.findOne({
      studentId: normalizedStudentId,
    });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      studentId: normalizedStudentId,
      password: hashedPassword,
      college: college?.trim() || "Narula Institute of Technology",
    });

    // Generate JWT
    const token = generateToken(user._id);

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
        role: user.role,
        isVerified: user.isVerified,
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

// ===============================
// LOGIN
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

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
        role: user.role,
        isVerified: user.isVerified,
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

// ===============================
// GET CURRENT USER
// ===============================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

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
      message:
        "Server error while fetching user.",
    });
  }
};

// ===============================
// FORGOT PASSWORD
// ===============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

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

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before saving
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordToken = hashedOTP;

    // OTP valid for 10 minutes
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // Email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
        <title>CampusMart Password Reset</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#f8fafc;
        font-family:Arial,Helvetica,sans-serif;
      ">

        <div style="
          max-width:600px;
          margin:40px auto;
          background:#ffffff;
          border:1px solid #e2e8f0;
          border-radius:16px;
          padding:32px;
        ">

          <h2 style="
            margin:0;
            color:#0f172a;
          ">
            CampusMart
          </h2>

          <p style="
            color:#475569;
            line-height:1.6;
          ">
            We received a request to reset your
            CampusMart account password.
          </p>

          <div style="
            margin:28px 0;
            padding:25px;
            text-align:center;
            background:#eff6ff;
            border-radius:12px;
          ">

            <p style="
              margin:0 0 10px;
              color:#64748b;
              font-size:14px;
            ">
              Your verification code
            </p>

            <div style="
              font-size:34px;
              font-weight:bold;
              letter-spacing:8px;
              color:#2563eb;
            ">
              ${otp}
            </div>

          </div>

          <p style="
            color:#475569;
            line-height:1.6;
          ">
            This OTP is valid for
            <strong>10 minutes</strong>.
          </p>

          <p style="
            color:#64748b;
            font-size:13px;
            line-height:1.6;
          ">
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #e2e8f0;
            margin:28px 0;
          ">

          <p style="
            margin:0;
            color:#94a3b8;
            font-size:12px;
          ">
            CampusMart Student Marketplace
          </p>

        </div>

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

// ===============================
// VERIFY OTP
// ===============================
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

    const normalizedEmail = email.toLowerCase().trim();

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

// ===============================
// RESET PASSWORD
// ===============================
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

    const normalizedEmail = email.toLowerCase().trim();

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

// ===============================
// EXPORTS
// ===============================
module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
