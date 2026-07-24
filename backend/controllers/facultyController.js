const Student = require("../models/Student");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");

// @desc Faculty dashboard summary stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const attendanceEntries = await Attendance.countDocuments({ markedBy: req.user._id });
    const assignments = await Assignment.find({ createdBy: req.user._id });
    const pendingAssignments = assignments.reduce(
      (sum, a) => sum + a.submissions.filter((s) => s.status === "pending").length,
      0
    );
    const atRiskStudents = await Student.countDocuments({ "composite.riskLevel": "at-risk" });

    res.status(200).json({
      success: true,
      stats: { totalStudents, attendanceEntries, pendingAssignments, atRiskStudents },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Faculty sends a custom announcement/notification
exports.sendNotification = async (req, res, next) => {
  try {
    const { recipients, title, message, type } = req.body; // recipients: array of user IDs
    const docs = recipients.map((r) => ({ recipient: r, title, message, type: type || "announcement" }));
    await Notification.insertMany(docs);
    res.status(201).json({ success: true, message: "Notifications sent" });
  } catch (error) {
    next(error);
  }
};

// @desc Get profile
exports.getProfile = async (req, res, next) => {
  res.status(200).json({ success: true, faculty: req.user.toSafeObject() });
};
