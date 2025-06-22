const instituteModel = require("../models/instituteModel");
const applicationModel = require("../models/applicationModel");

const instituteData = async (req, res) => {
  try {
    const fetchInstitute = await instituteModel
      .find({ role: "Institute" })
      .select("-password -confirmPassword");

    return res.status(200).json({
      status: "Success",
      message:
        fetchInstitute.length > 0
          ? "Institute details fetched successfully"
          : "No institute records found",
      fetchInstitute,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const verifyInstitute = async (req, res) => {
  try {
    const currentInstitute = await instituteModel.findById(req.user.id);
    if (!currentInstitute) {
      return res.status(401).json({
        status: "Failed",
        message: "Insitute Not Found",
      });
    }
    return res.status(200).json({
      status: "Success",
      message: "Institute Found Successfully",
      currentInstitute,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const fetchInstitutewithAcceptedStatus = async (req, res) => {
  try {
    const institutewithStatus = await applicationModel
      .find({
        $and: [{ status: "Accepted" }, { institute: req.user.id }],
      })
      .populate({
        path: "student",
        select: "fullName age gender address contact profileImage",
      });

    return res.status(200).json({
      status: "Success",
      message:
        institutewithStatus.length === 0
          ? "No applications found with Accepted status for this institute"
          : "Institute Found with Accepted Status",
      institutewithStatus,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

module.exports = {
  verifyInstitute,
  instituteData,
  fetchInstitutewithAcceptedStatus,
};
