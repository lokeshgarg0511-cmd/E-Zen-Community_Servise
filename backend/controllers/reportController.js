const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Warning = require("../models/Warning");

// @desc Attendance trend across all students grouped by month
exports.getAttendanceTrend = async (req, res, next) => {
  try {
    const trend = await Attendance.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.status(200).json({ success: true, trend });
  } catch (error) {
    next(error);
  }
};

// @desc Marks trend (average per course)
exports.getMarksTrend = async (req, res, next) => {
  try {
    const trend = await Marks.aggregate([
      {
        $group: {
          _id: "$course",
          avgPercentage: { $avg: { $multiply: [{ $divide: ["$marksObtained", "$totalMarks"] }, 100] } },
        },
      },
    ]);
    res.status(200).json({ success: true, trend });
  } catch (error) {
    next(error);
  }
};

// @desc Department-wise statistics
exports.getDepartmentStats = async (req, res, next) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          totalStudents: { $sum: 1 },
          avgScore: { $avg: "$composite.score" },
          atRiskCount: {
            $sum: { $cond: [{ $eq: ["$composite.riskLevel", "at-risk"] }, 1, 0] },
          },
        },
      },
    ]);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// @desc At-risk student analysis with breakdown
exports.getAtRiskAnalysis = async (req, res, next) => {
  try {
    const warnings = await Warning.find({ riskLevel: "at-risk" })
      .populate("student", "fullName rollNumber department")
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, warnings });
  } catch (error) {
    next(error);
  }
};
