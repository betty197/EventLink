
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const db = require("./config/db");

// Import API routes
const equipmentRoute = require("./routes/equipmentRoute");
const categoryRoute = require("./routes/categoryRoute");

// Create Express application
const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());

// ================================
// HOME ROUTE
// Check whether the API is running
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
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
      message: "Database connected successfully!",
      database: rows[0].databaseName,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// ================================
// EQUIPMENT API ROUTES
// ================================

app.use("/api/equipment", equipmentRoute);

// ================================
// CATEGORY API ROUTES
// ================================

app.use("/api/categories", categoryRoute);

// ================================
// HANDLE UNKNOWN ROUTES
// Keep this after all API routes
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================================
// GENERAL ERROR-HANDLING MIDDLEWARE
// ================================

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ================================
// START THE SERVER
// ================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `EventLink API running at http://localhost:${PORT}`
  );
});
