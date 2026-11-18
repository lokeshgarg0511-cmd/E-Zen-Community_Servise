const express = require("express");
const router = express.Router();
const { getStudentFee, payFee, getAllFees } = require("../controllers/feeController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.get("/student/:studentId?", getStudentFee);
router.post("/pay", payFee);
router.get("/", authorize("admin"), getAllFees);

module.exports = router;
