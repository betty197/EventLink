
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

// Remove sensitive fields before returning user information
const safeUser = (user) => ({
  user_id: user.user_id,
  full_name: user.full_name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  business_name: user.business_name,
  business_description: user.business_description,
  business_address: user.business_address,
  verification_status: user.verification_status,
  status: user.status,
  created_at: user.created_at,
});

// Register a customer or vendor
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      role = "customer",
      business_name,
      business_description,
      business_address,
    } = req.body;

    if (
      typeof full_name !== "string" ||
      !full_name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (full_name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at most 100 characters.",
      });
    }

    if (normalizedEmail.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Email must be at most 150 characters.",
      });
    }

    // Never allow public registration as admin
    if (!["customer", "vendor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be customer or vendor.",
      });
    }

    if (
      role === "vendor" &&
      (typeof business_name !== "string" ||
        !business_name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Business name is required for vendors.",
      });
    }

    if (
      role === "vendor" &&
      business_name.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message: "Business name must be at most 150 characters.",
      });
    }

    const existingUser =
      await userModel.findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const userId = await userModel.createUser({
      full_name: full_name.trim(),
      email: normalizedEmail,
      password_hash,
      phone: typeof phone === "string" && phone.trim()
        ? phone.trim()
        : null,
      role,
      business_name:
        role === "vendor" ? business_name.trim() : null,
      business_description:
        role === "vendor" ? business_description || null : null,
      business_address:
        role === "vendor" ? business_address || null : null,
    });

    const newUser = await userModel.findUserByEmail(
      normalizedEmail
    );

    return res.status(201).json({
      success: true,
      message:
        role === "vendor"
          ? "Vendor registered. Verification is pending."
          : "Registration successful.",
      user: safeUser(newUser),
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

// Log in an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This account is inactive.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

module.exports = {
  register,
  login,
};
