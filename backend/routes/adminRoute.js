const express = require("express");
const {
  studentData,
  studentDetails,
  studentUpdate,
  studentDelete,
  verifyAdmin,
  fetchStudentApplication,
  approveStudents,
  rejectStudnets,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddelware");

const router = express.Router();

router.post("/add-students", studentData);
router.get("/fetch-students", studentDetails);
router.put("/update-sudent/:id", studentUpdate);
router.delete("/delete-sudent/:id", studentDelete);
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
router.patch("/rejectstudents/:studentId", authMiddleware(["Admin"]),rejectStudnets)
module.exports = router;
