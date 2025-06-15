const studentModel = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      dateofBirth,
      address,
      contact,
      password,
      profileImage,
    } = req.body;

    const studenExits = await studentModel.find({ email }).select("-password");
    if (studenExits) {
      return response.status(401).josn({
        stauts: "Failed ",
        message: "Student already Registerd",
      });
    }

    const studentRegister = await studentModel.create({
      name,
      age,
      gender,
      dateofBirth,
      address,
      contact,
      password,
      profileImage,
    });

    return response.status(201).json({
      stauts: "Success",
      message: "Stundent Registered Successfully",
      studentRegister,
    });
  } catch (err) {
    return response.status(401).json({
      message: "Failed to Register",
      error: err.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const studentExists = await studentModel
      .find({ email })
      .select("-password");
    if (!studentExists) {
      return response.status(401).json({
        stauts: "Failed",
        message: "Failed to Login",
      });
    }

    const isMatched = await bcrypt.compare(password, studentRegister.password);
    if (!isMatched) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed to Login",
      });
    }

    const token = jwt.sign(
      {
        id: studentExists._id,
        email: studentExists.email,
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

    return response.status(200).json({
      status: "Success",
      message: "Login Successfully",
      studentExists,
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
