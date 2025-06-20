const studentModel = require("../models/studentModel");
const instituteModel = require("../models/instituteModel");
const adminModel = require("../models/adminModel");
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
    const contact = {
      email,
      password,
    };
    const student = await studentModel.findOne({
      "contact.email": contact.email,
    });
    if (!student) {
      return res.status(401).json({
        status: "Failed",
        message: "Student Not found",
      });
    }
    const isMatched = await bcrypt.compare(
      contact.password,
      student.confirmPassword
    );
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
        role: "Student",
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
      role: "Student",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

const Logout = (req, res) => {
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

const instituteRegistration = async (req, res) => {
  try {
    const {
      instituteName,
      establishmentYear,
      instituteType,
      registrationDate,
      department,
      registrationNumber,
      contact,
      password,
      confirmPassword,
      instituteCode,
    } = req.body;

    const instituteLogo = req.file?.path || "";

    if (instituteCode !== process.env.VALID_INSTITUTE_CODE) {
      return res.status(401).json({
        status: "Faild",
        message: "Invalid Institute Code",
      });
    }

    const instituteExists = await instituteModel
      .findOne({
        $or: [
          { "contact.email": contact.email },
          { "contact.phone": contact.phone },
        ],
      })
      .select("-password");

    if (instituteExists) {
      return res.status(401).json({
        status: "Failed",
        message: "Institute already Registered",
      });
    }

    const instituteRegister = await instituteModel.create({
      instituteName,
      establishmentYear,
      instituteType,
      registrationDate,
      department,
      registrationNumber,
      contact,
      password,
      instituteCode,
      role: "Institute",
      confirmPassword,
      instituteLogo,
    });

    return res.status(201).json({
      status: "Success",
      message: "Instiute Registered Successfully",
      instituteRegister,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const instituteLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const contact = {
      email,
      password,
    };

    const institute = await instituteModel.findOne({
      "contact.email": contact.email,
    });

    if (!institute) {
      return res.status(401).json({
        status: "Failed",
        message: "Institute Not Found",
      });
    }

    const isMatched = await bcrypt.compare(password, institute.confirmPassword);
    if (!isMatched) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed to Login",
      });
    }

    const instituteToken = jwt.sign(
      {
        id: institute._id,
        email: institute.contact.email,
        role: institute.role || "Institute",
      },
      process.env.INSTITUTE_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("instituteToken", instituteToken, {
      httpOnly: true,
      secure: true, // make false for local dev if needed
      sameSite: "None", // or "Lax" for local
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "Institute Login Successfully",
      institute,
      role: "Institute",
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const instituteLogout = (req, res) => {
  res.clearCookie("instituteToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).json({
    status: "Success",
    message: "Institute Logout Successfully",
  });
};

const adminRegistration = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      dateOfBirth,
      contact,
      password,
      confirmPassword,
    } = req.body;

    const profileImage = req.file?.path || "";
    const adminExists = await adminModel.findOne({
      $or: [
        { "contact.email": contact.email },
        { "contact.phone": contact.phone },
      ],
    });

    if (adminExists) {
      return res.status(401).json({
        status: "Failed",
        message: "Admin already Registered",
      });
    }

    const adminRegister = await adminModel.create({
      fullName,
      age,
      gender,
      dateOfBirth,
      contact,
      password,
      confirmPassword,
      profileImage,
    });

    return res.status(201).json({
      status: "Success",
      message: "Admin Registered Successfully",
      adminRegister,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const contact = {
      email,
      password,
    };

    const admin = await adminModel.findOne({ "contact.email": contact.email });
    if (!admin) {
      return res.status(401).json({
        status: "Failed",
        message: "Admin Not Found",
      });
    }
    const isMatched = await bcrypt.compare(password, admin.confirmPassword);
    if (!isMatched) {
      return res.status(401).json({
        status: "Failed",
        message: "Failed to Login",
      });
    }

    const adminToken = jwt.sign(
      {
        id: admin._id,
        email: admin.contact.email,
        role: "Admin",
      },
      process.env.ADMIN_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("adminToken", adminToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "Admin Login Successfully",
      admin,
      role: "Admin",
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const adminLogout = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({
    status: "Success",
    message: "Admin Logout Successfully",
  });
};

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
      return res.status(404).json({
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
module.exports = {
  Register,
  Login,
  Logout,
  instituteRegistration,
  instituteLogin,
  instituteLogout,
  adminRegistration,
  adminLogin,
  adminLogout,
  verify,
};
