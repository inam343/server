// Polyfill crypto for older Node versions
const { webcrypto } = require("crypto");
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const sliderRoutes = require("./routes/slidercat");
const productrowRoutes = require("./routes/productrow");
const featuredProductRoutes = require("./routes/featuredproduct");
const breakfastRoutes = require("./routes/breakefast");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

// Models for dashboard counts
const Category = require("./models/Category");
const Productrow = require("./models/productrow");
const Featuredproduct = require("./models/featuredproduct");
const Breakfast = require("./models/breakfast");
const Productslider = require("./models/productslider");
const User = require("./models/User");
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["https://grocerystore-production-362f.up.railway.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed for: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/productslider", sliderRoutes);
app.use("/api/productrow", productrowRoutes);
app.use("/api/featuredproduct", featuredProductRoutes);
app.use("/api/breakfast", breakfastRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);

// Dashboard stats — counts for all major collections
app.get("/api/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalCategories,
      totalLatestProducts,
      totalFeaturedProducts,
      totalBreakfast,
      totalSliders,
      totalOrders,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Productrow.countDocuments(),
      Featuredproduct.countDocuments(),
      Breakfast.countDocuments(),
      Productslider.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
    ]);

    const totalProducts = totalLatestProducts + totalFeaturedProducts + totalBreakfast;

    res.json({
      totalUsers,
      totalCategories,
      totalProducts,
      totalLatestProducts,
      totalFeaturedProducts,
      totalBreakfast,
      totalSliders,
      totalOrders,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Grocery Store API is running");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });
