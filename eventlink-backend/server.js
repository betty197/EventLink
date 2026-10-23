
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const db = require("./config/db");

// Import API routes
const equipmentRoute = require("./routes/equipmentRoute");
const categoryRoute = require("./routes/categoryRoute");
const authRoute = require("./routes/authRoute");

// Import JWT authentication middleware
const authenticateToken = require("./middleware/authMiddleware");

// Create Express application
const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());

// ================================
// HOME ROUTE
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EventLink API",
    status: "running",
  });
});

// ================================
// DATABASE TEST ROUTE
// ================================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DATABASE() AS databaseName"
    );

    res.status(200).json({
      success: true,
      message: "Database connected successfully!",
      database: rows[0].databaseName,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ================================
// API ROUTES
// ================================

// Equipment routes
app.use("/api/equipment", equipmentRoute);

// Categories routes
app.use("/api/categories", categoryRoute);

// Registration and login routes
app.use("/api/auth", authRoute);

// ================================
// PROTECTED USER PROFILE ROUTE
// ================================

// GET /api/auth/me
// Requires a valid JWT token
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful!",
    user: req.user,
  });
});

// ================================
// UNKNOWN ROUTE HANDLER
// Keep this after all routes
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================================
// GLOBAL ERROR HANDLER
// ================================

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `EventLink API running at http://localhost:${PORT}`
  );
});
