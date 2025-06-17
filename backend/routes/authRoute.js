const express = require("express");
const { Register, Login, Logout } = require("../controllers/authController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/student-register", upload.single("profileImage"), Register);
router.post("/student-login", Login);
router.get("/student-logout", Logout);
module.exports = router;
