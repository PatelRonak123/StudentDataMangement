const applicationModel = require("../models/applicationModel");

const applyToInstitute = async (req, res) => {
  try {
    const { message, course, documents } = req.body;
    const { InstituteId } = req.params;
    if (req.user.role !== "Student") {
      return res.status(403).json({
        status: "Failed",
        message: "Forbidden, You don't have permission to access this resource",
      });
    }

    const applicationExists = await applicationModel.findOne({
      student: req.user._id,
    });
    if (applicationExists) {
      return res.status(400).json({
        status: "Failed",
        message: "You have already applied to this institute",
      });
    }

    const addApplication = await applicationModel.create({
      student: req.user._id, // Assuming req.user._id is the student's ID
      institute: InstituteId,
      message,
      course,
      documents,
    });

    return res.status(201).json({
      status: "Success",
      message: "Application submitted successfully",
      addApplication,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

module.exports = { applyToInstitute };
