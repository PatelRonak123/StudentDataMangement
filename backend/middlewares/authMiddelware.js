const jwt = require("jsonwebtoken");

const authMiddleware =
  (allowedRoles = []) =>
  (req, res, next) => {
    try {
      let token;
      let secret;

      if (req.cookies.token) {
        token = req.cookies.token;
        secret = process.env.JWT_SECRET;
      } else if (req.cookies.instituteToken) {
        token = req.cookies.instituteToken;
        secret = process.env.INSTITUTE_SECRET;
      } else if (req.cookies.adminToken) {
        token = req.cookies.adminToken;
        secret = process.env.ADMIN_SECRET;
      }

      if (!token || !secret) {
        return res.status(401).json({
          status: "Failed",
          message: "Unauthorized, Please Login First",
        });
      }

      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          status: "Failed",
          message:
            "Forbidden, You don't have permission to access this resource",
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        error: err.message,
      });
    }
  };

module.exports = authMiddleware;
