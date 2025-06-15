const express = require("express");
const { Register, Login, Logout } = require("../controllers/authController");
const router = express.Router();

router.post("/student-register", Register);
router.post("/student-login", Login);
router.get("/student-logout", Logout);

module.exports = router;
