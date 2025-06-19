const express = require("express");
const {
  studentData,
  studentDetails,
  studentUpdate,
  studentDelete,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/add-students", studentData);
router.get("/fetch-students", studentDetails);
router.put("/update-sudent/:id", studentUpdate);
router.delete("/delete-sudent/:id", studentDelete);

module.exports = router;
