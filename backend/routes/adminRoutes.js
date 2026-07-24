const express = require("express");
const router = express.Router();
const {
  getDashboardStats, createDepartment, listDepartments, updateDepartment,
  deleteDepartment, createCourse, listCourses, listUsers,
  toggleUserStatus, deleteUser,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));
router.get("/dashboard-stats", getDashboardStats);
router.route("/departments").get(listDepartments).post(createDepartment);
router.route("/departments/:id").put(updateDepartment).delete(deleteDepartment);
router.route("/courses").get(listCourses).post(createCourse);
router.get("/users", listUsers);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

module.exports = router;
