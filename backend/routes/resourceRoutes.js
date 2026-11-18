const express = require("express");
const router = express.Router();
const {
  getResources,
  uploadResource,
  deleteResource,
} = require("../controllers/resourceController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.get("/", getResources);
router.post("/", authorize("faculty", "admin"), uploadResource);
router.delete("/:id", authorize("faculty", "admin"), deleteResource);

module.exports = router;
