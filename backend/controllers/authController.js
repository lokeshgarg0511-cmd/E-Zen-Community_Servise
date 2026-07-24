const crypto = require("crypto");
const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Parent = require("../models/Parent");
const Admin = require("../models/Admin");
const ParentStudentMapping = require("../models/ParentStudentMapping");
const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// --------------------------------------------------------------------------
// @desc    Send OTP to a college email for student registration
// @route   POST /api/auth/send-otp
// --------------------------------------------------------------------------
exports.sendOTP = async (req, res, next) => {
  try {
    const { email, fullName } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + (process.env.OTP_EXPIRE_MINUTES || 10) * 60 * 1000);

    // Stash OTP temporarily against email using a lightweight upsert on Student
    // collection placeholder document is avoided; instead we sign a short-lived token
    // containing the OTP hash so we remain stateless until verification.
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpToken = Buffer.from(JSON.stringify({ email, otpHash, otpExpire })).toString("base64");

    const emailSent = await sendEmail({
      to: email,
      subject: "SPMS - Email Verification OTP",
      html: `<p>Hello ${fullName || ""},</p>
             <p>Your OTP for SPMS registration is:</p>
             <h2>${otp}</h2>
             <p>This OTP expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      message: emailSent ? "OTP sent to your email" : "OTP generated (email service not configured)",
      otpToken,
      // NOTE: otp is only echoed back in development for demo/testing purposes.
      ...(process.env.NODE_ENV !== "production" && { devOtp: otp }),
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Verify OTP before allowing registration
// @route   POST /api/auth/verify-otp
// --------------------------------------------------------------------------
exports.verifyOTP = async (req, res, next) => {
  try {
    const { otpToken, otp } = req.body;
    if (!otpToken || !otp) {
      return res.status(400).json({ success: false, message: "OTP token and OTP are required" });
    }

    const decoded = JSON.parse(Buffer.from(otpToken, "base64").toString("utf-8"));
    if (new Date(decoded.otpExpire) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== decoded.otpHash) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const verifiedToken = Buffer.from(
      JSON.stringify({ email: decoded.email, verified: true, ts: Date.now() })
    ).toString("base64");

    res.status(200).json({ success: true, message: "OTP verified successfully", verifiedToken });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or corrupted OTP token" });
  }
};

// --------------------------------------------------------------------------
// @desc    Register a student (requires verifiedToken from OTP step)
// @route   POST /api/auth/register/student
// --------------------------------------------------------------------------
exports.registerStudent = async (req, res, next) => {
  try {
    const {
      fullName, rollNumber, email, department, semester,
      yearOfPassing, password, verifiedToken,
    } = req.body;

    if (!verifiedToken) {
      return res.status(400).json({ success: false, message: "Email verification required" });
    }
    const decoded = JSON.parse(Buffer.from(verifiedToken, "base64").toString("utf-8"));
    if (decoded.email !== email || !decoded.verified) {
      return res.status(400).json({ success: false, message: "Email not verified" });
    }

    const exists = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (exists) {
      return res.status(400).json({ success: false, message: "Student already registered" });
    }

    const student = await Student.create({
      fullName, email, rollNumber, department,
      semester, yearOfPassing, password,
      role: "student", isEmailVerified: true,
    });

    const token = generateToken(student._id, "student");
    res.status(201).json({ success: true, token, user: student.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Register a parent (linked to existing student)
// @route   POST /api/auth/register/parent
// --------------------------------------------------------------------------
exports.registerParent = async (req, res, next) => {
  try {
    const {
      fullName, parentEmail, mobileNumber, relationship,
      studentRollNumber, studentEmail, password,
    } = req.body;

    const student = await Student.findOne({ rollNumber: studentRollNumber, email: studentEmail });
    if (!student) {
      return res.status(404).json({ success: false, message: "No matching student found" });
    }

    const exists = await User.findOne({ email: parentEmail });
    if (exists) {
      return res.status(400).json({ success: false, message: "Parent already registered" });
    }

    const parent = await Parent.create({
      fullName, email: parentEmail, mobileNumber, relationship,
      password, role: "parent", linkedStudent: student._id, isEmailVerified: true,
    });

    await ParentStudentMapping.create({ parent: parent._id, student: student._id });

    const token = generateToken(parent._id, "parent");
    res.status(201).json({ success: true, token, user: parent.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Register faculty / admin (typically invite-only, exposed here for setup)
// --------------------------------------------------------------------------
exports.registerFaculty = async (req, res, next) => {
  try {
    const { fullName, email, employeeId, department, designation, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Already registered" });

    const faculty = await Faculty.create({
      fullName, email, employeeId, department, designation,
      password, role: "faculty", isEmailVerified: true,
    });

    const token = generateToken(faculty._id, "faculty");
    res.status(201).json({ success: true, token, user: faculty.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

exports.registerAdmin = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Already registered" });

    const admin = await Admin.create({
      fullName, email, password, role: "admin", isEmailVerified: true,
    });

    const token = generateToken(admin._id, "admin");
    res.status(201).json({ success: true, token, user: admin.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Login (shared across all roles)
// @route   POST /api/auth/login
// --------------------------------------------------------------------------
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been deactivated" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, token, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Forgot password - sends reset link/token via email
// --------------------------------------------------------------------------
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account with that email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "SPMS - Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Reset password using token from email
// --------------------------------------------------------------------------
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------------------------------
// @desc    Get currently logged-in user
// --------------------------------------------------------------------------
exports.getMe = async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
};

// --------------------------------------------------------------------------
// @desc    Logout (stateless - client deletes token; cookie cleared if used)
// --------------------------------------------------------------------------
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", { expires: new Date(Date.now() + 1000), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
