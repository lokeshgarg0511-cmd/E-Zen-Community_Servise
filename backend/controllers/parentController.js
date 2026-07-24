const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");
const Warning = require("../models/Warning");
const Notification = require("../models/Notification");

const getLinkedStudentId = async (parentUserId) => {
  const parent = await Parent.findById(parentUserId);
  return parent ? parent.linkedStudent : null;
};

// @desc View linked child's profile
exports.getChildProfile = async (req, res, next) => {
  try {
    const studentId = await getLinkedStudentId(req.user._id);
    if (!studentId) return res.status(404).json({ success: false, message: "No linked student found" });
    const student = await Student.findById(studentId);
    res.status(200).json({ success: true, student: student.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc View linked child's attendance
exports.getChildAttendance = async (req, res, next) => {
  try {
    const studentId = await getLinkedStudentId(req.user._id);
    const records = await Attendance.find({ student: studentId }).sort({ date: -1 });
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total ? Math.round((present / total) * 10000) / 100 : 0;
    res.status(200).json({ success: true, records, percentage });
  } catch (error) {
    next(error);
  }
};

// @desc View linked child's marks
exports.getChildMarks = async (req, res, next) => {
  try {
    const studentId = await getLinkedStudentId(req.user._id);
    const records = await Marks.find({ student: studentId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

// @desc View linked child's assignment status
exports.getChildAssignments = async (req, res, next) => {
  try {
    const studentId = await getLinkedStudentId(req.user._id);
    const assignments = await Assignment.find({ "submissions.student": studentId });
    const mapped = assignments.map((a) => ({
      title: a.title,
      course: a.course,
      dueDate: a.dueDate,
      status: a.submissions.find((s) => String(s.student) === String(studentId))?.status,
    }));
    res.status(200).json({ success: true, assignments: mapped });
  } catch (error) {
    next(error);
  }
};

// @desc View linked child's warning history / alerts
exports.getChildWarnings = async (req, res, next) => {
  try {
    const studentId = await getLinkedStudentId(req.user._id);
    const history = await Warning.find({ student: studentId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

// @desc Parent notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};
