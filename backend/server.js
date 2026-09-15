require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const chatRoutes = require("./routes/chatRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");

const app = express();

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin
      // such as Postman/server-side requests
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "Not allowed by CORS",
        ),
      );
    },

    credentials: true,
  }),
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(cookieParser());

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "CampusMart API is running",
    environment:
      process.env.NODE_ENV ||
      "development",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/products",
  productRoutes,
);

app.use(
  "/api/upload",
  uploadRoutes,
);

app.use(
  "/api/cart",
  cartRoutes,
);

app.use(
  "/api/orders",
  orderRoutes,
);

app.use(
  "/api/wishlist",
  wishlistRoutes,
);

app.use(
  "/api/chat",
  chatRoutes,
);

app.use(
  "/api/exchange",
  exchangeRoutes,
);

// ==========================================
// 404
// ==========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API route not found.",
    });
  },
);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server Error:",
      error,
    );

    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "CORS request blocked.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  },
);

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `CampusMart API running on port ${PORT}`,
    );
  },
);