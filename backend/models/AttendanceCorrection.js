const mongoose = require("mongoose");

const attendanceCorrectionSchema = new mongoose.Schema(
  {
    attendanceRecord: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseOrSubject: { type: String, required: true },
    date: { type: Date, required: true },
    originalStatus: { type: String, enum: ["present", "absent", "late"], required: true },
    requestedStatus: { type: String, enum: ["present", "absent", "late"], required: true },
    reason: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminComment: { type: String },
    actionDate: { type: Date },
    isOlderThan30Days: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceCorrection", attendanceCorrectionSchema);
