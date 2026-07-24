const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");
const Warning = require("../models/Warning");
const Notification = require("../models/Notification");
const ParentStudentMapping = require("../models/ParentStudentMapping");
const sendEmail = require("../utils/sendEmail");
const calculateComposite = require("../utils/calculateWarning");

/**
 * Recalculates a student's composite early-warning score whenever attendance,
 * marks, or assignment submission data changes, then fires notifications
 * to student / parent / faculty / admin if the student becomes at-risk.
 */
const recalculateWarning = async (studentId) => {
  const attendanceRecords = await Attendance.find({ student: studentId });
  const attendancePct = attendanceRecords.length
    ? (attendanceRecords.filter((a) => a.status === "present").length / attendanceRecords.length) * 100
    : 100;

  const marksRecords = await Marks.find({ student: studentId });
  const marksPct = marksRecords.length
    ? (marksRecords.reduce((sum, m) => sum + (m.marksObtained / m.totalMarks) * 100, 0) / marksRecords.length)
    : 100;

  const assignments = await Assignment.find({ "submissions.student": studentId });
  let submissionPct = 100;
  if (assignments.length) {
    let onTime = 0;
    let totalCount = 0;
    assignments.forEach((a) => {
      a.submissions
        .filter((s) => String(s.student) === String(studentId))
        .forEach((s) => {
          totalCount += 1;
          if (s.status === "submitted") onTime += 1;
        });
    });
    submissionPct = totalCount ? (onTime / totalCount) * 100 : 100;
  }

  const result = calculateComposite({ attendancePct, marksPct, submissionPct });

  await Student.findByIdAndUpdate(studentId, {
    composite: {
      score: result.score,
      riskLevel: result.riskLevel,
      lastCalculated: new Date(),
    },
  });

  await Warning.create({
    student: studentId,
    compositeScore: result.score,
    riskLevel: result.riskLevel,
    breakdown: result.breakdown,
  });

  if (result.riskLevel === "at-risk") {
    await notifyAtRisk(studentId, result);
  }

  return result;
};

const notifyAtRisk = async (studentId, result) => {
  const student = await Student.findById(studentId);
  if (!student) return;

  const message = `Composite score dropped to ${result.score}. Immediate attention required.`;

  await Notification.create({
    recipient: studentId,
    title: "At-Risk Warning Issued",
    message,
    type: "at-risk",
  });

  await sendEmail({
    to: student.email,
    subject: "SPMS - At-Risk Academic Warning",
    html: `<p>Dear ${student.fullName},</p><p>${message}</p>`,
  });

  const mappings = await ParentStudentMapping.find({ student: studentId }).populate("parent");
  for (const m of mappings) {
    if (!m.parent) continue;
    await Notification.create({
      recipient: m.parent._id,
      title: "Your child has been flagged At-Risk",
      message,
      type: "at-risk",
    });
    await sendEmail({
      to: m.parent.email,
      subject: "SPMS - Student At-Risk Alert",
      html: `<p>Dear ${m.parent.fullName},</p><p>${student.fullName} (${student.rollNumber}): ${message}</p>`,
    });
  }
};

module.exports = { recalculateWarning };
