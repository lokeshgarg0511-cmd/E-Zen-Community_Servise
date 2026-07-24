const express = require("express");
const router = express.Router();
const {
  sendOTP, verifyOTP, registerStudent, registerParent,
  registerFaculty, registerAdmin, login, forgotPassword,
  resetPassword, getMe, logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register/student", registerStudent);
router.post("/register/parent", registerParent);
router.post("/register/faculty", registerFaculty);
router.post("/register/admin", registerAdmin);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
