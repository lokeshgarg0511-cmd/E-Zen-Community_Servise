const express = require("express");
const router = express.Router();
const {
  getAttendanceTrend, getMarksTrend, getDepartmentStats, getAtRiskAnalysis,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("faculty", "admin"));
router.get("/attendance-trend", getAttendanceTrend);
router.get("/marks-trend", getMarksTrend);
router.get("/department-stats", getDepartmentStats);
router.get("/at-risk-analysis", getAtRiskAnalysis);

module.exports = router;
