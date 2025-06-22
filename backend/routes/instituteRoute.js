const express = require("express");
const {
  instituteData,
  verifyInstitute,
  fetchInstitutewithAcceptedStatus,
} = require("../controllers/instituteController");
const router = express.Router();
const authMiddelware = require("../middlewares/authMiddelware");

router.get("/verifyInstiute", authMiddelware(["Institute"]), verifyInstitute);
router.get("/institute-details", instituteData);
router.get(
  "/fetchInstitutewithStatus",
  authMiddelware(["Institute"]),
  fetchInstitutewithAcceptedStatus
);
module.exports = router;
