const Assignment = require("../models/Assignment");
const { recalculateWarning } = require("./warningService");

// @desc Faculty creates an assignment for a set of students
exports.createAssignment = async (req, res, next) => {
  try {
    const { title, course, description, dueDate, studentIds } = req.body;
    const assignment = await Assignment.create({
      title, course, description, dueDate,
      createdBy: req.user._id,
      submissions: studentIds.map((id) => ({ student: id, status: "pending" })),
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

// @desc Faculty updates a student's submission status
exports.updateSubmissionStatus = async (req, res, next) => {
  try {
    const { assignmentId, studentId, status } = req.body;
    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, "submissions.student": studentId },
      {
        $set: {
          "submissions.$.status": status,
          "submissions.$.submittedAt": status === "submitted" ? new Date() : null,
        },
      },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment/submission not found" });
    await recalculateWarning(studentId);
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

// @desc Student views their assignments
exports.getStudentAssignments = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const assignments = await Assignment.find({ "submissions.student": studentId }).sort({ dueDate: 1 });
    const mapped = assignments.map((a) => ({
      _id: a._id,
      title: a.title,
      course: a.course,
      description: a.description,
      dueDate: a.dueDate,
      status: a.submissions.find((s) => String(s.student) === String(studentId))?.status || "pending",
    }));
    res.status(200).json({ success: true, assignments: mapped });
  } catch (error) {
    next(error);
  }
};

// @desc Faculty views all assignments they created
exports.getFacultyAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user._id }).populate(
      "submissions.student",
      "fullName rollNumber"
    );
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    next(error);
  }
};
