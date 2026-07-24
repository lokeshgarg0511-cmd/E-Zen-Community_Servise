const express = require("express");
const router = express.Router();
const {
  getChildProfile, getChildAttendance, getChildMarks,
  getChildAssignments, getChildWarnings, getNotifications,
} = require("../controllers/parentController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("parent"));
router.get("/child/profile", getChildProfile);
router.get("/child/attendance", getChildAttendance);
router.get("/child/marks", getChildMarks);
router.get("/child/assignments", getChildAssignments);
router.get("/child/warnings", getChildWarnings);
router.get("/notifications", getNotifications);

module.exports = router;
