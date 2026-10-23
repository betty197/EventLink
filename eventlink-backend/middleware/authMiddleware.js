
const jwt = require("jsonwebtoken");

// Verify the JWT sent by the client
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Require the Bearer token format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

  // Ensure the JWT secret is configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured.",
    });
  }

  try {
    // Verify the token and its expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach authenticated user information to the request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // Continue to the protected route
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateToken;
