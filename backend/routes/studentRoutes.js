const express = require("express");
const router = express.Router();
const {
  getProfile, getWarningHistory, getNotifications,
  updateProfile, listStudents, getAtRiskStudents,
} = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.get("/me/profile", getProfile);
router.put("/me/profile", updateProfile);
router.get("/me/warnings", getWarningHistory);
router.get("/me/notifications", getNotifications);
router.get("/", authorize("faculty", "admin"), listStudents);
router.get("/at-risk", authorize("faculty", "admin"), getAtRiskStudents);
router.get("/:id/profile", authorize("faculty", "admin", "parent"), getProfile);
router.get("/:id/warnings", authorize("faculty", "admin", "parent"), getWarningHistory);

module.exports = router;
