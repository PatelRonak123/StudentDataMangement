const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const institueSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, "Institute name must be at least 3 characters"],
    maxlength: [60, "Institute name must be at most 50 characters"],
  },
  establishmentYear: {
    type: Number,
    required: true,
    min: [1900, "Establishment year must be after 1900"],
    max: [
      new Date().getFullYear(),
      "Establishment year must be before the current year",
    ],
  },
  instituteType: {
    type: String,
    enum: ["School", "College", "University"],
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  department: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Department name must be at least 3 characters"],
    maxlength: [50, "Department name must be at most 30 characters"],
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [5, "Registration number must be at least 5 characters"],
    maxlength: [15, "Registration number must be at most 15 characters"],
  },
  contact: {
    phone: {
      type: Number,
      required: true,
      unique: true,
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [10, "Phone number must be at most 10 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [20, "Password must be at most 20 characters"],
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [20, "Password must be at most 20 characters"],
  },
  instituteLogo: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["Student", "Institute", "Admin"],
    default: "Student",
  },
});

institueSchema.pre("save", async function (next) {
  if (!this.isModified("confirmPassword")) return next();
  try {
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Institute", institueSchema);
