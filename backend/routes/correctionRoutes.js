const express = require("express");
const router = express.Router();
const {
  getCorrections,
  requestCorrection,
  reviewCorrection,
} = require("../controllers/correctionController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.get("/", authorize("faculty", "admin"), getCorrections);
router.post("/", authorize("faculty"), requestCorrection);
router.put("/:id/review", authorize("admin"), reviewCorrection);

module.exports = router;
