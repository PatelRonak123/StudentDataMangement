const studentModel = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      dateOfBirth,
      contact,
      address,
      password,
      confirmPassword,
    } = req.body;

    const profileImage = req.file?.path || "";
    const studenExits = await studentModel
      .findOne({
        $or: [
          { "contact.email": contact.email },
          { "contact.phone": contact.phone },
        ],
      })
      .select("-password");
    if (studenExits) {
      return res.status(401).json({
        status: "Failed",
        message: "Student already Registerd",
      });
    }

    const studentRegister = await studentModel.create({
      fullName,
      contact,
      age,
      gender,
      dateOfBirth,
      address,
      password,
      confirmPassword,
      profileImage,
    });

    return res.status(201).json({
      status: "Success",
      message: "Student Registered Successfully",
      studentRegister,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await studentModel.findOne({ email });
    if (!student) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed to Login",
      });
    }

    const isMatched = await bcrypt.compare(password, student.password);
    if (!isMatched) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed to Login",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // make false for local dev if needed
      sameSite: "None", // or "Lax" for local
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "Login Successfully",
      student,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

const Logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

module.exports = { Register, Login, Logout };
