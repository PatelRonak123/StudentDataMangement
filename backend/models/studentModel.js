const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [30, "Name must be at most 30 characters"],
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 8,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pinCode: String,
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
  contact: {
    phone: {
      type: String,
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
    },
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["Student"],
    default: "Student",
  },
  appliedInstitute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    default: null,
  },
  applicationStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("confirmPassword")) return next();
  try {
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Student", studentSchema);
