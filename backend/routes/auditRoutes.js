const express = require("express");
const router = express.Router();
const { getAuditLogs, recordAction } = require("../controllers/auditController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));

router.get("/", getAuditLogs);
router.post("/", recordAction);

module.exports = router;
