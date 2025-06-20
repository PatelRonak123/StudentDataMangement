const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const { applyToInstitute } = require("../controllers/studentController");
const uploadDocuments = require("../middlewares/documentsUpload");
const router = express.Router();

router.post(
  "/apply/:id",
  authMiddleware(["Student"]),
  uploadDocuments.array("documents", 5),
  applyToInstitute
);

module.exports = router;
