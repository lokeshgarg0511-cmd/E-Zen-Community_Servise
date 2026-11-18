const QrSession = require("../models/QrSession");
const Attendance = require("../models/Attendance");
const crypto = require("crypto");

// Helper to generate a rotating dynamic token
const generateRotatingToken = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EZEN-QR-${rand}-SEC`;
};

// @desc    Start or retrieve active QR attendance session
// @route   POST /api/qr/session
// @access  Private (Faculty)
exports.createOrGetSession = async (req, res) => {
  try {
    const { courseOrSubject, classOrSection } = req.body;
    let session = await QrSession.findOne({
      faculty: req.user._id,
      isActive: true,
      sessionExpiresAt: { $gt: new Date() },
    }).populate("verifiedStudents.student", "fullName email rollNumber");

    if (!session) {
      const secret = crypto.randomBytes(16).toString("hex");
      const currentToken = generateRotatingToken();
      session = await QrSession.create({
        courseOrSubject: courseOrSubject || "CS301 - Data Structures & Algorithms",
        classOrSection: classOrSection || "CSE-A (Sem 5)",
        faculty: req.user._id,
        secretToken: secret,
        currentToken,
        tokenExpiresAt: new Date(Date.now() + 5000), // 5s validity
        sessionExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour session
        isActive: true,
        verifiedStudents: [],
      });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rotate 5-second dynamic QR token
// @route   POST /api/qr/session/:id/rotate
// @access  Private (Faculty)
exports.rotateToken = async (req, res) => {
  try {
    const session = await QrSession.findById(req.params.id);
    if (!session || !session.isActive) {
      return res.status(404).json({ success: false, message: "Active session not found" });
    }

    session.currentToken = generateRotatingToken();
    session.tokenExpiresAt = new Date(Date.now() + 5000);
    await session.save();

    res.json({
      success: true,
      currentToken: session.currentToken,
      expiresInSeconds: 5,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify student token scan
// @route   POST /api/qr/verify
// @access  Private (Student)
exports.verifyScan = async (req, res) => {
  try {
    const { sessionId, token } = req.body;
    const session = await QrSession.findById(sessionId);

    if (!session || !session.isActive || new Date() > session.sessionExpiresAt) {
      return res.status(400).json({ success: false, message: "Attendance session is closed or expired" });
    }

    if (!token || token.trim() !== session.currentToken) {
      return res.status(400).json({
        success: false,
        message: "Dynamic token expired or invalid. Please scan the current code on screen.",
      });
    }

    // Check duplicate
    const alreadyScanned = session.verifiedStudents.some(
      (v) => String(v.student) === String(req.user._id)
    );
    if (alreadyScanned) {
      return res.status(400).json({
        success: false,
        message: "Attendance has already been marked for this session.",
      });
    }

    session.verifiedStudents.push({
      student: req.user._id,
      scannedAt: new Date(),
      ipAddress: req.ip,
    });
    await session.save();

    // Create or update attendance record
    await Attendance.create({
      student: req.user._id,
      course: session.courseOrSubject.split(" ")[0] || "CS301",
      date: new Date(),
      status: "present",
      method: "QR",
    });

    res.json({
      success: true,
      message: `Verified! Attendance recorded for ${req.user.fullName}.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Close active QR session
// @route   POST /api/qr/session/:id/close
// @access  Private (Faculty)
exports.closeSession = async (req, res) => {
  try {
    const session = await QrSession.findById(req.params.id);
    if (session) {
      session.isActive = false;
      await session.save();
    }
    res.json({ success: true, message: "Session closed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
