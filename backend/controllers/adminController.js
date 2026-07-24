const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Parent = require("../models/Parent");
const Department = require("../models/Department");
const Course = require("../models/Course");

// @desc Admin dashboard summary stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalParents = await Parent.countDocuments();
    const atRiskStudents = await Student.countDocuments({ "composite.riskLevel": "at-risk" });

    const departmentStats = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 }, avgScore: { $avg: "$composite.score" } } },
    ]);

    res.status(200).json({
      success: true,
      stats: { totalStudents, totalFaculty, totalParents, atRiskStudents, departmentStats },
    });
  } catch (error) {
    next(error);
  }
};

// @desc CRUD - Departments
exports.createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, department: dept });
  } catch (error) {
    next(error);
  }
};

exports.listDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, department: dept });
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc CRUD - Courses
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

exports.listCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("faculty", "fullName");
    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

// @desc User management - activate/deactivate, delete
exports.listUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
