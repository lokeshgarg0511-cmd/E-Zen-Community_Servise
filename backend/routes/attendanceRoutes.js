const express = require("express");
const router = express.Router();
const {
  markAttendance, updateAttendance, getStudentAttendance, getCourseAttendanceReport,
} = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", authorize("faculty"), markAttendance);
router.put("/:id", authorize("faculty"), updateAttendance);
router.get("/report", authorize("faculty", "admin"), getCourseAttendanceReport);
router.get("/student/:studentId", getStudentAttendance);
router.get("/me", getStudentAttendance);

module.exports = router;
