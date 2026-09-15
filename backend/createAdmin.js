require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log("Admin already exists.");
        console.log("Email:", email);
        process.exit(0);
      }

      existingAdmin.role = "admin";
      existingAdmin.isVerified = true;
      existingAdmin.isActive = true;
      existingAdmin.password = await bcrypt.hash(password, 12);

      await existingAdmin.save();

      console.log("Existing user converted to admin successfully.");
      console.log("Email:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "CampusMart Admin",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
      studentId: "ADMIN001",
    });

    console.log("=================================");
    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Student ID:", admin.studentId);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();
