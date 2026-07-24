const express = require("express");
const router = express.Router();
const {
  createAssignment, updateSubmissionStatus, getStudentAssignments, getFacultyAssignments,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", authorize("faculty"), createAssignment);
router.put("/submission-status", authorize("faculty"), updateSubmissionStatus);
router.get("/faculty/mine", authorize("faculty"), getFacultyAssignments);
router.get("/student/:studentId", getStudentAssignments);
router.get("/me", getStudentAssignments);

module.exports = router;
