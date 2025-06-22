const applicationModel = require("../models/applicationModel");
const adminModel = require("../models/adminModel");

const verifyAdmin = async (req, res) => {
  try {
    const currentUser = await adminModel.findById(req.user.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "Failed",
        message: "Admin Not Found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Admin Verified",
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const fetchStudentApplication = async (req, res) => {
  try {
    const fetchStatus = await applicationModel
      .find({ status: "Pending" })
      .populate({
        path: "student",
        select:
          "fullName age profileImage dateOfBirth gender contact address enrolledDate",
      })
      .populate({
        path: "institute",
        select: "instituteName",
      });

    return res.status(200).json({
      status: "Success",
      message:
        fetchStatus.length > 0
          ? "Students found successfully with Pending status"
          : "No pending student applications",
      fetchStatus,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const approveStudents = async (req, res) => {
  try {
    const approve = await applicationModel.findByIdAndUpdate(
      req.params.studentId,
      { status: "Accepted" }
    );
    if (!approve) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed due to something reason",
      });
    }
    return res.status(200).json({
      status: "Sucess",
      message: "Student Status updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const rejectStudnets = async (req, res) => {
  const reject = await applicationModel.findByIdAndUpdate(
    req.params.studentId,
    {
      status: "Rejected",
    }
  );
  if (!reject) {
    return res.status(401).json({
      status: "Failed",
      message: "Failed rejection due to something reason",
    });
  }

  return res.status(200).json({
    status: "Success",
    message: "Studnet status update successfully",
  });
};
module.exports = {
  verifyAdmin,
  fetchStudentApplication,
  approveStudents,
  rejectStudnets,
};
