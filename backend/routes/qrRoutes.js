const express = require("express");
const router = express.Router();
const {
  createOrGetSession,
  rotateToken,
  verifyScan,
  closeSession,
} = require("../controllers/qrController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.post("/session", authorize("faculty", "admin"), createOrGetSession);
router.post("/session/:id/rotate", authorize("faculty", "admin"), rotateToken);
router.post("/session/:id/close", authorize("faculty", "admin"), closeSession);
router.post("/verify", authorize("student"), verifyScan);

module.exports = router;
