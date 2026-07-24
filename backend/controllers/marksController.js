const Marks = require("../models/Marks");
const { recalculateWarning } = require("./warningService");

// @desc Upload marks (faculty)
exports.uploadMarks = async (req, res, next) => {
  try {
    const { student, course, examType, marksObtained, totalMarks } = req.body;
    const record = await Marks.create({
      student, course, examType, marksObtained, totalMarks,
      uploadedBy: req.user._id,
    });
    await recalculateWarning(student);
    res.status(201).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

// @desc Edit marks
exports.updateMarks = async (req, res, next) => {
  try {
    const record = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    await recalculateWarning(record.student);
    res.status(200).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

// @desc Get marks for a student
exports.getStudentMarks = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const records = await Marks.find({ student: studentId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};
