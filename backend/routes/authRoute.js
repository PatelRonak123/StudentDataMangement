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
router.post("/student-logout", Logout);

router.post(
  "/institute-register",
  uploadInstituteLogo.single("instituteLogo"),
  instituteRegistration
);
router.post("/institute-login", instituteLogin);
router.post("/institute-logout", instituteLogout);

router.post(
  "/admin-register",
  uploadAdminProfiles.single("profileImage"),
  adminRegistration
);
router.post("/admin-login", adminLogin);
router.post("/admin-logout", adminLogout);


module.exports = router;
