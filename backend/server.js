require("dotenv").config();
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
console.log("MongoDB URI configured:", mongoUri ? "Yes (defined)" : "No (undefined)");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const parentRoutes = require("./routes/parentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const marksRoutes = require("./routes/marksRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const feeRoutes = require("./routes/feeRoutes");
const qrRoutes = require("./routes/qrRoutes");
const correctionRoutes = require("./routes/correctionRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

// --- Core middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// --- Rate limiting (protects auth endpoints from brute force) ---
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use("/api/auth", authLimiter);

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/corrections", correctionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/audit", auditRoutes);

app.get("/api/health", (req, res) => res.json({ success: true, message: "E-Zen API is running" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`SPMS server running on port ${PORT}`));
};

start();

module.exports = app;
