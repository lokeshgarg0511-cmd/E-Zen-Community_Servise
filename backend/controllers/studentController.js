const Student = require("../models/Student");
const Warning = require("../models/Warning");
const Notification = require("../models/Notification");

// @desc Get full student profile + composite score
exports.getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id || req.user._id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, student: student.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc Get a student's warning history (for trend charts)
exports.getWarningHistory = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user._id;
    const history = await Warning.find({ student: studentId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

// @desc Get notifications for the logged-in student
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc Update own profile (limited fields)
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, theme } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { ...(fullName && { fullName }), ...(theme && { theme }) },
      { new: true }
    );
    res.status(200).json({ success: true, student: student.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc List all students (faculty/admin), with filters
exports.listStudents = async (req, res, next) => {
  try {
    const { department, semester, riskLevel, search } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (riskLevel) filter["composite.riskLevel"] = riskLevel;
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, "i") },
        { rollNumber: new RegExp(search, "i") },
      ];
    }
    const students = await Student.find(filter).select("-password");
    res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

// @desc At-risk students list
exports.getAtRiskStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ "composite.riskLevel": "at-risk" }).select("-password");
    res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};
