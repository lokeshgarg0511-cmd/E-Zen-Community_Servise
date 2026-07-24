const mongoose = require("mongoose");
const User = require("./User");

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 10 },
  yearOfPassing: { type: Number, required: true },
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
