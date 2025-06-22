const applicationModel = require("../models/applicationModel");
const studentModel = require("../models/studentModel");
const path = require("path");

const verify = async (req, res) => {
  try {
    const { id, role } = req.user;
    let currentUser;
    if (role === "Student") {
      currentUser = await studentModel
        .findById(id)
        .select("-password -confirmPassword");
    }
    if (!currentUser) {
      return res.status(401).json({
        status: "Failed",
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "User Found Successfully",
      currentUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const applyToInstitute = async (req, res) => {
  try {
    const { msg, course } = req.body;
    const { id } = req.params;

    const files = req.files || [];
    if (req.user.role !== "Student") {
      return res.status(403).json({
        status: "Failed",
        message: "Forbidden, You don't have permission to access this resource",
      });
    }
    const applicationExists = await applicationModel.findOne({
      student: req.user.id,
      institute: id,
    });
    if (applicationExists) {
      return res.status(400).json({
        status: "Failed",
        message: "You have already applied to this institute",
      });
    }

    const uploadedDocuments = req.files.map((file) => {
      const ext = path.extname(file.originalname); // get file extension
      const filename = file.originalname.endsWith(ext)
        ? file.originalname
        : file.originalname + ext;

      return {
        url: `${file.path}?fl_attachment=${encodeURIComponent(filename)}`,
        filename,
      };
    });

    const addApplication = await applicationModel.create({
      student: req.user.id, // Assuming req.user._id is the student's ID
      institute: id,
      msg,
      course,
      documents: uploadedDocuments,
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

module.exports = { verify, applyToInstitute };
