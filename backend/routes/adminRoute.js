const express = require("express");
const {
  verifyAdmin,
  fetchStudentApplication,
  approveStudents,
  rejectStudnets,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddelware");

const router = express.Router();

router.get("/verify-admin", authMiddleware(["Admin"]), verifyAdmin);
router.get(
  "/fetch-studentApplication",
  authMiddleware(["Admin"]),
  fetchStudentApplication
);
router.patch(
  "/approveStudent/:studentId",
  authMiddleware(["Admin"]),
  approveStudents
);
router.patch(
  "/rejectstudents/:studentId",
  authMiddleware(["Admin"]),
  rejectStudnets
);
module.exports = router;
