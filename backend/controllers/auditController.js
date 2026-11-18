const AuditLog = require("../models/AuditLog");

// @desc    Get immutable audit logs
// @route   GET /api/audit
// @access  Private (Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const { role, action, search } = req.query;
    let query = {};

    if (role && role !== "all") query.actorRole = role;
    if (action && action !== "all") query.action = new RegExp(action, "i");

    if (search) {
      query.$or = [
        { actorName: new RegExp(search, "i") },
        { action: new RegExp(search, "i") },
        { resourceType: new RegExp(search, "i") },
        { resourceId: new RegExp(search, "i") },
      ];
    }

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record manual or administrative compliance action
// @route   POST /api/audit
// @access  Private (Admin)
exports.recordAction = async (req, res) => {
  try {
    const { action, resourceType, resourceId, details } = req.body;

    const log = await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.fullName || "Administrator",
      actorRole: req.user.role || "admin",
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
