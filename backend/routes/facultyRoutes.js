const express = require("express");
const router = express.Router();
const { getDashboardStats, sendNotification, getProfile } = require("../controllers/facultyController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("faculty"));
router.get("/dashboard-stats", getDashboardStats);
router.post("/notify", sendNotification);
router.get("/profile", getProfile);

module.exports = router;
