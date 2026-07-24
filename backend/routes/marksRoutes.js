const express = require("express");
const router = express.Router();
const { uploadMarks, updateMarks, getStudentMarks } = require("../controllers/marksController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", authorize("faculty"), uploadMarks);
router.put("/:id", authorize("faculty"), updateMarks);
router.get("/student/:studentId", getStudentMarks);
router.get("/me", getStudentMarks);

module.exports = router;
