const express = require("express");
const {
  Register,
  Login,
  Logout,
  instituteRegistration,
  instituteLogin,
  instituteLogout,
  adminRegistration,
  adminLogin,
  adminLogout,
} = require("../controllers/authController");
const upload = require("../middlewares/upload");
const uploadInstituteLogo = require("../middlewares/instituteUpload");
const uploadAdminProfiles = require("../middlewares/adminUpload");
const authMiddleware = require("../middlewares/authMiddelware");
const router = express.Router();

router.post("/student-register", upload.single("profileImage"), Register);
router.post("/student-login", Login);
router.get("/student-logout", Logout);
router.get("/student-dashboard", authMiddleware(["Student"]), (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome to student Dashboard",
  });
});
router.post(
  "/institute-register",
  uploadInstituteLogo.single("instituteLogo"),
  instituteRegistration
);
router.post("/institute-login", instituteLogin);
router.get("/institute-logout", instituteLogout);
router.get(
  "/institute-dashboard",
  authMiddleware(["Institute"]),
  (req, res) => {
    res.status(200).json({
      status: "Success",
      message: "Welcome to Institute Dashboard",
    });
  }
);
router.post(
  "/admin-register",
  uploadAdminProfiles.single("profileImage"),
  adminRegistration
);
router.post("/admin-login", adminLogin);
router.get("/admin-logout", adminLogout);

module.exports = router;
