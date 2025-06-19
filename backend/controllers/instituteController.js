const instituteModel = require("../models/instituteModel");

const instituteData = async (req, res) => {
  try {
    const fetchInstitute = await instituteModel
      .find({ role: "Institute" })
      .select("-password -confirmPassword");

    if (fetchInstitute.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No Institute Details Found",
      });
    }
    return res.status(200).json({
      status: "Success",
      message: "Institute Details fetched Successfully",
      fetchInstitute,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

module.exports = instituteData;
