const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const { applyToInstitute } = require("../controllers/studentController");
const router = express.Router();

router.post(
  "/apply/:InstituteId",
  authMiddleware(["Student"]),
  applyToInstitute
);

module.exports = router;
