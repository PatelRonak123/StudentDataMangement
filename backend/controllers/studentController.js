const studentModel = require("../models/studentModel");

const studentData = async (req, res) => {
  try {
    const { name, age, division, marks, contact } = req.body;
    const studentExists = await studentModel
      .find({ email })
      .select("-password");
    if (studentExists) {
      return res.status(401).json({
        status: "Failed",
        message: "Student Already Registerd",
      });
    }
    const addStudent = await studentModel.create({
      name,
      age,
      division,
      marks,
      contact,
    });

    return res.status(401).json({
      status: "Success",
      message: "Student Registered Successfully",
      addStudent,
    });
  } catch (err) {
    return res.status(401).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const studentDetails = async (req, res) => {
  try {
    const fetchStudents = await studentModel
      .find({ role: "Student" })
      .select("-password");
    if (!fetchStudents) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed to fetch Student Details",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Student Details fetched Successfully",
      fetchStudents,
    });
  } catch (err) {
    return res.status(401).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const studentUpdate = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      dateofBirth,
      rollNumber,
      marks,
      contact,
      division,
      address,
    } = req.body;

    const studentFetched = await studentModel.findById(req.params.id);
    if (!studentFetched) {
      return res.status(404).json({
        status: "Failed",
        message: "Student not Found",
      });
    }
    const editStudnent = await studentModel
      .findByIdAndUpdate(req.params.id, {
        name,
        age,
        gender,
        dateofBirth,
        rollNumber,
        marks,
        contact,
        division,
        address,
      })
      .select("-password");

    return res.status(200).json({
      status: "Success",
      message: "Student Details Edit Successfully",
      editStudnent,
    });
  } catch (err) {
    return res.status(401).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const studentDelete = async (req, res) => {
  try {
    const studentFetched = await userModel
      .findById(req.params.id)
      .select("-password");

    if (!studentFetched) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }
    const deleteStudent = await userModel
      .findByIdAndDelete(req.params.id)
      .select("-password");

    return res.status(200).json({
      status: "success",
      message: "Student  deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};

module.exports = { studentData, studentDetails, studentUpdate, studentDelete };
