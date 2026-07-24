const Attendance = require("../models/Attendance");
const { recalculateWarning } = require("./warningService");

// @desc Mark attendance (faculty)
exports.markAttendance = async (req, res, next) => {
  try {
    const { records } = req.body; // [{ student, course, date, status }]
    const ops = records.map((r) => ({
      updateOne: {
        filter: { student: r.student, course: r.course, date: r.date },
        update: { $set: { ...r, markedBy: req.user._id } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);

    for (const r of records) {
      await recalculateWarning(r.student);
    }

    res.status(200).json({ success: true, message: "Attendance recorded" });
  } catch (error) {
    next(error);
  }
};

// @desc Edit a single attendance record
exports.updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    await recalculateWarning(record.student);
    res.status(200).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

// @desc Get attendance for a student
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const records = await Attendance.find({ student: studentId }).sort({ date: -1 });

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total ? Math.round((present / total) * 10000) / 100 : 0;

    res.status(200).json({ success: true, records, percentage, total, present });
  } catch (error) {
    next(error);
  }
};

// @desc Faculty: attendance report for a course
exports.getCourseAttendanceReport = async (req, res, next) => {
  try {
    const { course } = req.query;
    const records = await Attendance.find({ course }).populate("student", "fullName rollNumber");
    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};
