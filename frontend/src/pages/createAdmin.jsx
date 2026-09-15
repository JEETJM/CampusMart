require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const ADMIN_EMAIL = "jm382118@gmail.com";

// এখানে তোমার admin password বসাও.
// এটাকে frontend code-এ কখনো রাখবে না.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const createAdmin = async () => {
  try {
    if (!ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is missing from backend .env");
    }

    await connectDB();

    console.log("Connected to MongoDB.");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    let admin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (admin) {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isVerified = true;

      if (!admin.college) {
        admin.college = "Narula Institute of Technology";
      }

      await admin.save();

      console.log("Existing account converted to admin successfully.");
    } else {
      admin = await User.create({
        name: "CampusMart Admin",
        email: ADMIN_EMAIL,
        studentId: "ADMIN001",
        password: hashedPassword,
        college: "Narula Institute of Technology",
        role: "admin",
        isVerified: true,
        location: "Kolkata",
        bio: "CampusMart platform administrator.",
      });

      console.log("Admin account created successfully.");
    }

    console.log("");
    console.log("Admin email:", ADMIN_EMAIL);
    console.log("Admin role:", admin.role);
    console.log("Password stored as a secure bcrypt hash.");
    console.log("");
  } catch (error) {
    console.error("Create Admin Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

createAdmin();
