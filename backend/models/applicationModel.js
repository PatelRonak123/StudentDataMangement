const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  course: {
    type: String,
    enum: ["Engineering", "Medical", "Arts", "Commerce", "Science"],
    required: true,
  },
  documents: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Application", applicationSchema);
