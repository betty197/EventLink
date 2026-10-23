
const db = require("../config/db");

const approvedVendorMiddleware = async (req, res, next) => {
  try {
    // Authentication middleware must run first
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    // Allow admins to manage equipment
    if (req.user.role === "admin") {
      return next();
    }

    // Only vendors can continue
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Only vendors can manage equipment.",
      });
    }

    // Check the vendor's current status in MySQL
    const [rows] = await db.query(
      `SELECT role, status, verification_status
       FROM users
       WHERE user_id = ?
       LIMIT 1`,
      [req.user.userId]
    );

    // Check that the account still exists
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    const vendor = rows[0];

    // Check that the account is active
    if (vendor.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // Check that the vendor is approved
    if (vendor.verification_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your vendor account is not approved yet.",
      });
    }

    // Vendor is active and approved
    next();
  } catch (error) {
    console.error("Vendor verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify vendor account.",
    });
  }
};

module.exports = approvedVendorMiddleware;
