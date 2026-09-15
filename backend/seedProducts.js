require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

/* =========================================================
   CAMPUSMART PRODUCT CATALOG

   IMPORTANT:
   Every product has its own image.
   Therefore product name and image remain matched.
========================================================= */

const productCatalog = [
  /* =======================================================
     BOOKS
  ======================================================= */

  {
    title: "Engineering Mathematics",
    category: "Books",
    price: [250, 650],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Data Structures and Algorithms",
    category: "Books",
    price: [300, 800],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Operating System",
    category: "Books",
    price: [280, 700],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Computer Networks",
    category: "Books",
    price: [300, 750],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Database Management System",
    category: "Books",
    price: [280, 720],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Software Engineering",
    category: "Books",
    price: [250, 650],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Java Programming",
    category: "Books",
    price: [300, 900],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Web Development",
    category: "Books",
    price: [300, 850],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Digital Electronics",
    category: "Books",
    price: [250, 650],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Computer Organization",
    category: "Books",
    price: [280, 700],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Artificial Intelligence",
    category: "Books",
    price: [350, 950],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Machine Learning",
    category: "Books",
    price: [400, 1200],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Compiler Design",
    category: "Books",
    price: [300, 800],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Theory of Computation",
    category: "Books",
    price: [280, 720],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Object Oriented Programming",
    category: "Books",
    price: [300, 850],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     ELECTRONICS
  ======================================================= */

  {
    title: "Mechanical Keyboard",
    category: "Electronics",
    price: [900, 4500],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Wireless Mouse",
    category: "Electronics",
    price: [350, 1800],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bluetooth Speaker",
    category: "Electronics",
    price: [700, 3500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Wireless Headphones",
    category: "Electronics",
    price: [1000, 6000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "USB Hub",
    category: "Electronics",
    price: [300, 1500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Laptop Stand",
    category: "Electronics",
    price: [500, 2500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Webcam",
    category: "Electronics",
    price: [800, 4000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Power Bank",
    category: "Electronics",
    price: [600, 2500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1609592424496-2c4e6e1c1df7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Pendrive",
    category: "Electronics",
    price: [250, 1200],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1617734651182-46651b4b8f90?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "External Hard Drive",
    category: "Electronics",
    price: [3500, 9000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Smart Watch",
    category: "Electronics",
    price: [1000, 7000],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "USB Cable",
    category: "Electronics",
    price: [100, 800],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Laptop Cooling Pad",
    category: "Electronics",
    price: [700, 2500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Tablet",
    category: "Electronics",
    price: [5000, 18000],
    listingTypes: ["Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "USB Microphone",
    category: "Electronics",
    price: [1200, 6000],
    listingTypes: ["Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     NOTES
  ======================================================= */

  {
    title: "OS Semester Notes",
    category: "Notes",
    price: [50, 180],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "CN Semester Notes",
    category: "Notes",
    price: [50, 180],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "DBMS Class Notes",
    category: "Notes",
    price: [50, 200],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Java OOP Notes",
    category: "Notes",
    price: [60, 220],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Software Engineering Notes",
    category: "Notes",
    price: [50, 180],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mathematics Notes",
    category: "Notes",
    price: [50, 180],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "AI Notes",
    category: "Notes",
    price: [60, 220],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "DSA Notes",
    category: "Notes",
    price: [60, 250],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Exam Preparation Notes",
    category: "Notes",
    price: [50, 150],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Handwritten Lecture Notes",
    category: "Notes",
    price: [50, 180],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     ACCESSORIES
  ======================================================= */

  {
    title: "College Backpack",
    category: "Accessories",
    price: [600, 2500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Laptop Sleeve",
    category: "Accessories",
    price: [400, 1800],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Water Bottle",
    category: "Accessories",
    price: [200, 1200],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Desk Organizer",
    category: "Accessories",
    price: [150, 900],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1586870190087-5a3ce9f4d1f5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Phone Stand",
    category: "Accessories",
    price: [150, 800],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Keychain",
    category: "Accessories",
    price: [50, 300],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1517639493569-5666a7b2f494?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Wallet",
    category: "Accessories",
    price: [300, 1500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Scientific Calculator",
    category: "Accessories",
    price: [400, 1800],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Pen Set",
    category: "Accessories",
    price: [80, 500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cable Organizer",
    category: "Accessories",
    price: [80, 500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "College ID Card Holder",
    category: "Accessories",
    price: [50, 250],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Travel Mug",
    category: "Accessories",
    price: [250, 1000],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Umbrella",
    category: "Accessories",
    price: [250, 900],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1553978297-833d8a5f4cba?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     CLOTHING
  ======================================================= */

  {
    title: "College Hoodie",
    category: "Clothing",
    price: [500, 2200],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Casual Shirt",
    category: "Clothing",
    price: [350, 1500],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Denim Jacket",
    category: "Clothing",
    price: [700, 2500],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "College T-Shirt",
    category: "Clothing",
    price: [200, 900],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Sports T-Shirt",
    category: "Clothing",
    price: [250, 1000],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Jeans",
    category: "Clothing",
    price: [600, 2200],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Track Pants",
    category: "Clothing",
    price: [400, 1400],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1506629905607-d9fd9b7f6a89?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Sweatshirt",
    category: "Clothing",
    price: [500, 1800],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cap",
    category: "Clothing",
    price: [150, 700],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Winter Jacket",
    category: "Clothing",
    price: [900, 3500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "College Track Jacket",
    category: "Clothing",
    price: [700, 2200],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Formal Trousers",
    category: "Clothing",
    price: [500, 1800],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     SPORTS
  ======================================================= */

  {
    title: "Football",
    category: "Sports",
    price: [400, 1800],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cricket Bat",
    category: "Sports",
    price: [800, 5000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cricket Ball Set",
    category: "Sports",
    price: [250, 1200],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Badminton Racket",
    category: "Sports",
    price: [600, 3500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Badminton Shuttle",
    category: "Sports",
    price: [150, 700],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Table Tennis Bat",
    category: "Sports",
    price: [300, 1800],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Skipping Rope",
    category: "Sports",
    price: [100, 500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501b4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Yoga Mat",
    category: "Sports",
    price: [300, 1500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Gym Gloves",
    category: "Sports",
    price: [250, 1000],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Sports Shoes",
    category: "Sports",
    price: [800, 3500],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Volleyball",
    category: "Sports",
    price: [400, 1400],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Basketball",
    category: "Sports",
    price: [500, 1800],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     CYCLES
  ======================================================= */

  {
    title: "Mountain Bicycle",
    category: "Cycles",
    price: [5000, 18000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1529429617124-aee711c9d4db?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Hybrid Bicycle",
    category: "Cycles",
    price: [7000, 22000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "City Bicycle",
    category: "Cycles",
    price: [4500, 15000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Road Bicycle",
    category: "Cycles",
    price: [12000, 40000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Gear Bicycle",
    category: "Cycles",
    price: [7000, 25000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Single Speed Bicycle",
    category: "Cycles",
    price: [4000, 14000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Folding Bicycle",
    category: "Cycles",
    price: [8000, 22000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Student Commuter Bicycle",
    category: "Cycles",
    price: [5000, 16000],
    listingTypes: ["Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     FURNITURE
  ======================================================= */

  {
    title: "Study Desk",
    category: "Furniture",
    price: [1200, 5000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Study Chair",
    category: "Furniture",
    price: [700, 3000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1505843490701-5be5d6f0d4bb?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bookshelf",
    category: "Furniture",
    price: [1000, 4500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Computer Table",
    category: "Furniture",
    price: [1500, 6000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Office Chair",
    category: "Furniture",
    price: [1500, 7000],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bedside Table",
    category: "Furniture",
    price: [700, 3000],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Plastic Chair",
    category: "Furniture",
    price: [400, 1200],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Storage Rack",
    category: "Furniture",
    price: [700, 3000],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Reading Chair",
    category: "Furniture",
    price: [1200, 5000],
    listingTypes: ["Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Folding Table",
    category: "Furniture",
    price: [800, 3000],
    listingTypes: ["Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },

  /* =======================================================
     OTHER
  ======================================================= */

  {
    title: "Drawing Kit",
    category: "Other",
    price: [200, 1200],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Extension Board",
    category: "Other",
    price: [300, 1500],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Room Lamp",
    category: "Other",
    price: [400, 2200],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Table Clock",
    category: "Other",
    price: [250, 1200],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Travel Bag",
    category: "Other",
    price: [600, 2500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mini Fan",
    category: "Other",
    price: [500, 1800],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Study Lamp",
    category: "Other",
    price: [350, 1800],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Whiteboard",
    category: "Other",
    price: [500, 2500],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Calculator",
    category: "Other",
    price: [300, 1800],
    listingTypes: ["Sell", "Sell", "Exchange"],
    image:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Desk Lamp",
    category: "Other",
    price: [350, 1800],
    listingTypes: ["Sell", "Sell", "Rent"],
    image:
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Portable Study Board",
    category: "Other",
    price: [400, 1600],
    listingTypes: ["Sell", "Sell"],
    image:
      "https://images.unsplash.com/photo-1532619187608-e5375cab36a1?auto=format&fit=crop&w=900&q=80",
  },
];

/* =========================================================
   CONFIG
========================================================= */

const TARGET_PRODUCTS = 1200;

const conditions = ["New", "Like New", "Good", "Fair"];

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
  "Naihati",
  "Titagarh",
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
  "Sagnik",
  "Ayan",
  "Ritabrata",
  "Souvik",
  "Prithvi",
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

/* =========================================================
   HELPERS
========================================================= */

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

/* =========================================================
   CREATE PRICE
========================================================= */

function getPrice(priceRange) {
  const [min, max] = priceRange;

  return randomNumber(min, max);
}

/* =========================================================
   CREATE DESCRIPTION
========================================================= */

function createDescription(title, category, condition, listingType, variant) {
  const conditionText = {
    New: "brand new and unused",
    "Like New": "lightly used and maintained in excellent condition",
    Good: "pre-owned and in good working condition",
    Fair: "used with visible signs of use but still functional",
  };

  const listingText = {
    Sell: "available for direct purchase",
    Rent: "available for student rental",
    Exchange: "seller is open to reasonable exchange offers",
  };

  return (
    `${title} ${variant ? `(${variant})` : ""} is listed on CampusMart for students of Narula Institute of Technology. ` +
    `This ${category.toLowerCase()} item is ${conditionText[condition]}. ` +
    `${listingText[listingType]}. ` +
    `Campus pickup is available and students can contact the seller for more details.`
  );
}

/* =========================================================
   CREATE RENTAL DATA
========================================================= */

function createRentalFields(catalogItem) {
  if (catalogItem.listingTypes.includes("Rent")) {
    const price = Number(getPrice(catalogItem.price));

    return {
      dailyRate: Math.max(50, Math.round(price * 0.03)),
      depositAmount: Math.max(100, Math.round(price * 0.25)),
    };
  }

  return {};
}

/* =========================================================
   CREATE DEMO USERS
========================================================= */

async function createDemoUsers() {
  const users = [];

  const password = await bcrypt.hash("Demo@12345", 12);

  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[i];

    const lastName = lastNames[i % lastNames.length];

    const name = `${firstName} ${lastName}`;

    const email = `student${i + 1}@campusmart.demo`;

    const studentId = `DEMO${String(i + 1).padStart(4, "0")}`;

    let user = await User.findOne({
      email,
    });

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

/* =========================================================
   BUILD PRODUCTS
========================================================= */

function buildProducts(users) {
  const products = [];

  if (!Array.isArray(productCatalog) || productCatalog.length === 0) {
    throw new Error("Product catalog is empty.");
  }

  let productIndex = 0;
  let catalogIndex = 0;

  while (products.length < TARGET_PRODUCTS) {
    const catalogItem = productCatalog[catalogIndex % productCatalog.length];

    const cycleNumber = Math.floor(catalogIndex / productCatalog.length) + 1;

    /*
     * Keep the first version with the clean product name.
     * Additional versions get meaningful variation labels.
     */
    let variant = "";

    if (cycleNumber > 1) {
      const variantNames = [
        "Student Edition",
        "Campus Edition",
        "Premium Edition",
        "Value Edition",
        "Classic Edition",
        "Latest Edition",
        "Second Hand",
        "Exam Edition",
        "Daily Use Edition",
        "Pro Edition",
      ];

      variant = variantNames[(cycleNumber - 2) % variantNames.length];
    }

    const title =
      variant ? `${catalogItem.title} - ${variant}` : catalogItem.title;

    const condition = randomItem(conditions);

    /*
     * Fairer condition distribution.
     */
    const weightedCondition = productIndex % 10;

    let finalCondition;

    if (weightedCondition < 2) {
      finalCondition = "New";
    } else if (weightedCondition < 5) {
      finalCondition = "Like New";
    } else if (weightedCondition < 9) {
      finalCondition = "Good";
    } else {
      finalCondition = condition;
    }

    /*
     * Listing type follows the catalog.
     */
    const listingType = randomItem(catalogItem.listingTypes);

    const seller = users[productIndex % users.length];

    const price = getPrice(catalogItem.price);

    const rentalFields = createRentalFields(catalogItem);

    const product = {
      title,

      description: createDescription(
        catalogItem.title,
        catalogItem.category,
        finalCondition,
        listingType,
        variant,
      ),

      category: catalogItem.category,

      price,

      condition: finalCondition,

      listingType,

      images: [catalogItem.image],

      location: randomItem(locations),

      seller: seller._id,

      college: "Narula Institute of Technology",

      isAvailable: true,

      stock:
        catalogItem.category === "Cycles" ?
          randomNumber(1, 3)
        : randomNumber(1, 8),

      views: randomNumber(0, 350),

      wishlistCount: randomNumber(0, 60),

      averageRating: randomDecimal(3.2, 5),

      reviewCount: randomNumber(0, 45),

      aiFairPrice: null,

      aiRiskScore: null,

      aiQualityScore: null,

      ...rentalFields,
    };

    products.push(product);

    productIndex++;
    catalogIndex++;
  }

  return products;
}

/* =========================================================
   MAIN SEED
========================================================= */

async function seedProducts() {
  try {
    console.log("");
    console.log("========================================");
    console.log("CampusMart Product Seeder");
    console.log("========================================");
    console.log("");

    await connectDB();

    console.log("Connected to MongoDB.");

    /* =====================================================
       CREATE / LOAD DEMO USERS
    ===================================================== */

    const users = await createDemoUsers();

    console.log(`Demo students ready: ${users.length}`);

    /* =====================================================
       DELETE ALL OLD PRODUCTS

       IMPORTANT:
       This intentionally removes ALL Product documents.
    ===================================================== */

    const deleteResult = await Product.deleteMany({});

    console.log(`Old products deleted: ${deleteResult.deletedCount}`);

    /* =====================================================
       BUILD NEW PRODUCTS
    ===================================================== */

    const products = buildProducts(users);

    console.log(`Prepared products: ${products.length}`);

    /* =====================================================
       INSERT IN BATCHES

       Prevents an unnecessarily large single insert
       for bigger future datasets.
    ===================================================== */

    const BATCH_SIZE = 200;

    let insertedCount = 0;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      await Product.insertMany(batch);

      insertedCount += batch.length;

      console.log(`Inserted ${insertedCount}/${products.length}`);
    }

    /* =====================================================
       CATEGORY SUMMARY
    ===================================================== */

    const categorySummary = {};

    for (const product of products) {
      categorySummary[product.category] =
        (categorySummary[product.category] || 0) + 1;
    }

    const listingSummary = {};

    for (const product of products) {
      listingSummary[product.listingType] =
        (listingSummary[product.listingType] || 0) + 1;
    }

    /* =====================================================
       FINAL OUTPUT
    ===================================================== */

    console.log("");
    console.log("========================================");
    console.log("CampusMart Demo Data Seeded");
    console.log("========================================");

    console.log(`Students : ${users.length}`);

    console.log(`Products : ${insertedCount}`);

    console.log("");

    console.log("Category distribution:");

    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`  ${category.padEnd(14)}: ${count}`);
    });

    console.log("");

    console.log("Listing distribution:");

    Object.entries(listingSummary).forEach(([type, count]) => {
      console.log(`  ${type.padEnd(14)}: ${count}`);
    });

    console.log("");

    console.log("========================================");

    console.log("Demo student login");

    console.log("Password: Demo@12345");

    console.log("========================================");

    console.log("");
    console.log("Product names and images are catalog-matched.");
    console.log("");
  } catch (error) {
    console.error("", "Seed Error:", error);
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  }
}

/* =========================================================
   START
========================================================= */

seedProducts();
