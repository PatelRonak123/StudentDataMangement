const jwt = require("jsonwebtoken");

const authMiddleware =
  (allowedRoles = []) =>
  (req, res, next) => {
    try {
      const token = req.cookies.token || req.cookies.instituteToken;
      if (!token) {
        return res.status(401).json({
          staus: "Failed",
          message: "Unauthorized, Please Login First",
        });
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || process.env.INSTITUTE_SECRET
      );

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          status: "Failed",
          message:
            "Forbidden, You don't have permission to access this resource",
        });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        error: err.message,
      });
    }
  };

module.exports = authMiddleware;
