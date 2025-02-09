const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth"); // Import auth.js route
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Include credentials if needed
  })
);
app.use(express.json()); // Parse JSON bodies

// Register auth routes
app.use("/api/auth", authRoutes); // Now the signup route will be available at /api/auth/signup/user

// Serve static files from the uploads directory (for testing purposes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
