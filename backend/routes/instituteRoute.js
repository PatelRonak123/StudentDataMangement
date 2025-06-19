const express = require("express");
const instituteData = require("../controllers/instituteController");
const router = express.Router();
const authMiddelware = require("../middlewares/authMiddelware");
router.get("/institute-details", authMiddelware(["Student","Institute","Admin"]), instituteData);
module.exports = router;
