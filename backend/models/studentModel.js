const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  age: {
    type: Number,
    required: true,
    min: 3,
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
  division: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
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
  contact: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  marks: [
    {
      subject: String,
      score: Number,
    },
  ],
  attendance: {
    totalDays: { type: Number, default: 0 },
    presentDays: { type: Number, default: 0 },
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
    default: "",
  },
  role:{
    type:String,
    enum :["Student","Institute"],
    default: "Student"
  }
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Student", studentSchema);
