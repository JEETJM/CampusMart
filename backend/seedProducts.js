require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/product");

const categories = {
  Books: [
    "Engineering Mathematics",
    "Data Structures and Algorithms",
    "Operating System",
    "Computer Networks",
    "Database Management System",
    "Software Engineering",
    "Java Programming",
    "Web Development",
    "Digital Electronics",
    "Computer Organization",
    "Artificial Intelligence",
    "Machine Learning",
  ],

  Electronics: [
    "Mechanical Keyboard",
    "Wireless Mouse",
    "Bluetooth Speaker",
    "Wireless Headphones",
    "USB Hub",
    "Laptop Stand",
    "Webcam",
    "Power Bank",
    "Pendrive",
    "External Hard Drive",
    "Smart Watch",
    "USB Cable",
  ],

  Notes: [
    "OS Semester Notes",
    "CN Semester Notes",
    "DBMS Class Notes",
    "Java OOP Notes",
    "Software Engineering Notes",
    "Mathematics Notes",
    "AI Notes",
    "DSA Notes",
    "Exam Preparation Notes",
    "Handwritten Lecture Notes",
  ],

  Accessories: [
    "College Backpack",
    "Laptop Sleeve",
    "Water Bottle",
    "Desk Organizer",
    "Phone Stand",
    "Keychain",
    "Wallet",
    "Calculator",
    "Pen Set",
    "Cable Organizer",
  ],

  Clothing: [
    "College Hoodie",
    "Casual Shirt",
    "Denim Jacket",
    "College T-Shirt",
    "Sports T-Shirt",
    "Jeans",
    "Track Pants",
    "Sweatshirt",
    "Cap",
    "Winter Jacket",
  ],

  Sports: [
    "Football",
    "Cricket Bat",
    "Cricket Ball Set",
    "Badminton Racket",
    "Badminton Shuttle",
    "Table Tennis Bat",
    "Skipping Rope",
    "Yoga Mat",
    "Gym Gloves",
    "Sports Shoes",
  ],

  Cycles: [
    "Mountain Bicycle",
    "Hybrid Bicycle",
    "City Bicycle",
    "Road Bicycle",
    "Gear Bicycle",
    "Single Speed Bicycle",
  ],

  Furniture: [
    "Study Desk",
    "Study Chair",
    "Bookshelf",
    "Computer Table",
    "Office Chair",
    "Bedside Table",
    "Plastic Chair",
    "Storage Rack",
  ],

  Other: [
    "Scientific Calculator",
    "Drawing Kit",
    "Extension Board",
    "Umbrella",
    "Room Lamp",
    "Table Clock",
    "Travel Bag",
    "Mini Fan",
    "Study Lamp",
    "Whiteboard",
  ],
};

const conditions = ["New", "Like New", "Good", "Fair"];

const listingTypes = ["Sell", "Sell", "Sell", "Rent", "Exchange"];

const locations = [
  "Kolkata",
  "Agarpara",
  "Belgharia",
  "Sodepur",
  "Kamarhati",
  "Panihati",
  "Dunlop",
  "Baranagar",
  "Barrackpore",
  "College Campus",
];

const firstNames = [
  "Aarav",
  "Aditya",
  "Ankit",
  "Arjun",
  "Ayush",
  "Dev",
  "Ishan",
  "Karan",
  "Rahul",
  "Rohan",
  "Sayan",
  "Subham",
  "Soumyadeep",
  "Sourav",
  "Abhishek",
  "Akash",
  "Ritwik",
  "Rishav",
  "Anirban",
  "Debanjan",
];

const lastNames = [
  "Das",
  "Roy",
  "Ghosh",
  "Mondal",
  "Saha",
  "Dutta",
  "Paul",
  "Chatterjee",
  "Banerjee",
  "Sen",
  "Bose",
  "Mitra",
  "Pal",
  "Sarkar",
  "Datta",
];

const imagePool = {
  Books: [
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  ],

  Electronics: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    "https://images.unsplash.com/photo-1527814050087-3793815479db",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  ],

  Notes: [
    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    "https://images.unsplash.com/photo-1517842645767-c639042777db",
  ],

  Accessories: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
  ],

  Clothing: [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  ],

  Sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc",
  ],

  Cycles: [
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
    "https://images.unsplash.com/photo-1502744688674-c619d1586c9e",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
  ],

  Furniture: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  ],

  Other: [
    "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
  ],
};

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPrice(category) {
  const ranges = {
    Books: [150, 1200],
    Electronics: [300, 8000],
    Notes: [50, 500],
    Accessories: [100, 1500],
    Clothing: [200, 2500],
    Sports: [200, 4000],
    Cycles: [2500, 12000],
    Furniture: [500, 6000],
    Other: [100, 2500],
  };

  const [min, max] = ranges[category];

  return randomNumber(min, max);
}

function createDescription(title, category, condition, listingType) {
  return `${title} available for students at Narula Institute of Technology. Category: ${category}. Condition: ${condition}. Suitable for college use. ${
    listingType === "Rent" ? "Available for short-term rental."
    : listingType === "Exchange" ? "Seller is open to exchange offers."
    : "Available for direct purchase."
  }`;
}

async function createDemoUsers() {
  const users = [];

  const password = await bcrypt.hash("Demo@12345", 12);

  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName =
      lastNames[Math.floor(i / firstNames.length)] ||
      lastNames[i % lastNames.length];

    const name = `${firstName} ${lastName}`;
    const email = `student${i + 1}@campusmart.demo`;
    const studentId = `DEMO${String(i + 1).padStart(4, "0")}`;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        studentId,
        password,
        college: "Narula Institute of Technology",
        role: "student",
        isVerified: true,
        location: randomItem(locations),
        bio: "CampusMart demo student account.",
      });
    }

    users.push(user);
  }

  return users;
}

async function seedProducts() {
  try {
    await connectDB();

    console.log("Connected to MongoDB.");

    const users = await createDemoUsers();

    console.log(`Demo students ready: ${users.length}`);

    // Remove only previously generated demo products
    await Product.deleteMany({
      description: {
        $regex: "CampusMart Demo Product",
        $options: "i",
      },
    });

    const products = [];

    const categoryNames = Object.keys(categories);

    for (let i = 0; i < 500; i++) {
      const category = categoryNames[i % categoryNames.length];

      const baseTitle = randomItem(categories[category]);

      const condition = randomItem(conditions);

      const listingType = randomItem(listingTypes);

      const price = getPrice(category);

      const seller = users[i % users.length];

      const imageBase = randomItem(imagePool[category]);

      const imageUrl = `${imageBase}?auto=format&fit=crop&w=900&q=80`;

      const titleNumber = Math.floor(i / categoryNames.length) + 1;

      const title = titleNumber > 1 ? `${baseTitle} ${titleNumber}` : baseTitle;

      const product = {
        title,
        description: `CampusMart Demo Product ${i + 1}: ${createDescription(
          title,
          category,
          condition,
          listingType,
        )}`,
        category,
        price,
        condition,
        listingType,
        images: [imageUrl],
        location: randomItem(locations),
        seller: seller._id,
        college: "Narula Institute of Technology",
        isAvailable: true,
        views: randomNumber(0, 250),
        wishlistCount: randomNumber(0, 40),

        // Initial AI placeholders.
        // Real AI values will be generated later.
        aiFairPrice: null,
        aiRiskScore: null,
        aiQualityScore: null,
      };

      products.push(product);
    }

    await Product.insertMany(products);

    console.log("");
    console.log("======================================");
    console.log("CampusMart Demo Data Seeded");
    console.log("======================================");
    console.log(`Students : ${users.length}`);
    console.log(`Products : ${products.length}`);
    console.log("======================================");
    console.log("");
    console.log("Demo student password: Demo@12345");
    console.log("");
  } catch (error) {
    console.error("Seed Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedProducts();
