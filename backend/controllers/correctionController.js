const AttendanceCorrection = require("../models/AttendanceCorrection");
const Attendance = require("../models/Attendance");
const AuditLog = require("../models/AuditLog");

// @desc    Get attendance correction requests
// @route   GET /api/corrections
// @access  Private (Faculty, Admin)
exports.getCorrections = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "faculty") {
      query.requestedBy = req.user._id;
    }

    const corrections = await AttendanceCorrection.find(query)
      .populate("student", "fullName email rollNumber schoolClass department")
      .populate("requestedBy", "fullName email")
      .populate("approvedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: corrections.length, corrections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit attendance correction (Enforces 30-day direct edit vs. admin approval rule)
// @route   POST /api/corrections
// @access  Private (Faculty)
exports.requestCorrection = async (req, res) => {
  try {
    const { studentId, courseOrSubject, date, originalStatus, requestedStatus, reason } = req.body;

    const recordDate = new Date(date);
    const diffDays = Math.floor((Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    const isOlderThan30Days = diffDays > 30;

    const correction = await AttendanceCorrection.create({
      student: studentId,
      courseOrSubject,
      date: recordDate,
      originalStatus,
      requestedStatus,
      reason,
      requestedBy: req.user._id,
      status: isOlderThan30Days ? "pending" : "approved",
      isOlderThan30Days,
      adminComment: isOlderThan30Days ? "" : "Auto-approved within 30-day faculty editing window.",
      actionDate: isOlderThan30Days ? null : new Date(),
    });

    // If within 30 days, apply change directly
    if (!isOlderThan30Days) {
      await Attendance.findOneAndUpdate(
        { student: studentId, course: courseOrSubject },
        { status: requestedStatus }
      );
    }

    // Immutable Audit Log
    await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.fullName,
      actorRole: "faculty",
      action: isOlderThan30Days ? "CORRECTION_REQUESTED_OVER_30_DAYS" : "DIRECT_ATTENDANCE_EDIT",
      resourceType: "Attendance",
      resourceId: String(correction._id),
      details: { studentId, courseOrSubject, originalStatus, requestedStatus, diffDays },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      correction,
      message: isOlderThan30Days
        ? "Correction request submitted to Administrator for approval (record is older than 30 days)."
        : "Attendance corrected successfully within 30-day window.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject attendance correction
// @route   PUT /api/corrections/:id/review
// @access  Private (Admin)
exports.reviewCorrection = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const correction = await AttendanceCorrection.findById(req.params.id);

    if (!correction) {
      return res.status(404).json({ success: false, message: "Correction request not found" });
    }

    correction.status = status; // "approved" | "rejected"
    correction.approvedBy = req.user._id;
    correction.adminComment = adminComment || (status === "approved" ? "Approved by Academic Administration." : "Rejected.");
    correction.actionDate = new Date();

    if (status === "approved") {
      await Attendance.findOneAndUpdate(
        { student: correction.student, course: correction.courseOrSubject },
        { status: correction.requestedStatus }
      );
    }

    await correction.save();

    // Immutable Audit Log
    await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.fullName,
      actorRole: "admin",
      action: `CORRECTION_${status.toUpperCase()}`,
      resourceType: "AttendanceCorrection",
      resourceId: String(correction._id),
      details: { studentId: correction.student, courseOrSubject: correction.courseOrSubject, adminComment },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Request has been marked as ${status}.`,
      correction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
