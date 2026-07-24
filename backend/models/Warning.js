const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    compositeScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ["excellent", "normal", "at-risk"], required: true },
    breakdown: {
      attendanceScore: Number,
      marksScore: Number,
      submissionScore: Number,
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warning", warningSchema);
