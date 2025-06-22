const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const {
  applyToInstitute,
  verify,
} = require("../controllers/studentController");
const uploadDocuments = require("../middlewares/documentsUpload");
const router = express.Router();

router.get("/verify", authMiddleware(["Student"]), verify);
router.post(
  "/apply/:id",
  authMiddleware(["Student"]),
  uploadDocuments.array("documents", 5),
  applyToInstitute
);

module.exports = router;
