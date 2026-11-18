const mongoose = require("mongoose");
const User = require("./User");

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true, trim: true },
  department: { type: String, default: "General" },
  semester: { type: Number, min: 1, max: 10, default: 1 },
  schoolClass: { type: String }, // e.g., "Class 10", "Class 12"
  section: { type: String, default: "A" },
  yearOfPassing: { type: Number, default: () => new Date().getFullYear() + 2 },
  admissionNumber: { type: String },
  otp: { type: String, select: false },
  otpExpire: { type: Date, select: false },
  composite: {
    score: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ["excellent", "normal", "at-risk"],
      default: "normal",
    },
    lastCalculated: { type: Date },
  },
  parentMapping: { type: mongoose.Schema.Types.ObjectId, ref: "ParentStudentMapping" },
});

module.exports = User.discriminator("student", studentSchema);
