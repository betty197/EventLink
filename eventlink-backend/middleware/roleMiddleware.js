
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check that authentication middleware ran first
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    // Check whether the user's role is permitted
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    // User has permission; continue to the route
    next();
  };
};

module.exports = authorizeRoles;
