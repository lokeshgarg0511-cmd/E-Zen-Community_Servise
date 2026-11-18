/**
 * Seeds a connected MongoDB Atlas database with demo users, attendance,
 * marks and assignments matching the same dataset used in the frontend's
 * standalone mock mode - so the live backend "feels" identical on first run.
 *
 * Usage: npm run seed   (after configuring MONGO_URI in .env)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Parent = require("../models/Parent");
const Admin = require("../models/Admin");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");
const ParentStudentMapping = require("../models/ParentStudentMapping");
const Institution = require("../models/Institution");
const Fee = require("../models/Fee");
const StudyResource = require("../models/StudyResource");
const AuditLog = require("../models/AuditLog");

const DEMO_PASSWORD = "Demo@1234";

const run = async () => {
  await connectDB();
  console.log("Clearing existing demo collections...");
  await Promise.all([
    Student.deleteMany({}), Faculty.deleteMany({}), Parent.deleteMany({}), Admin.deleteMany({}),
    Department.deleteMany({}), Course.deleteMany({}), Attendance.deleteMany({}),
    Marks.deleteMany({}), Assignment.deleteMany({}), ParentStudentMapping.deleteMany({}),
    Institution.deleteMany({}), Fee.deleteMany({}), StudyResource.deleteMany({}), AuditLog.deleteMany({}),
  ]);

  const departments = await Department.insertMany([
    { name: "Computer Science & Engineering", code: "CSE", headOfDepartment: "Dr. Aravind Subramanian" },
    { name: "Electronics & Communication", code: "ECE", headOfDepartment: "Dr. Priya Ramaswamy" },
    { name: "Mechanical Engineering", code: "MECH", headOfDepartment: "Dr. Sanjay Iyer" },
    { name: "Civil Engineering", code: "CIVIL", headOfDepartment: "Dr. Lakshmi Narayan" },
  ]);

  const courses = await Course.insertMany([
    { name: "Data Structures & Algorithms", code: "CS301", department: "CSE", semester: 3, credits: 4 },
    { name: "Database Management Systems", code: "CS302", department: "CSE", semester: 3, credits: 4 },
    { name: "Digital Signal Processing", code: "EC301", department: "ECE", semester: 3, credits: 3 },
    { name: "Thermodynamics", code: "ME301", department: "MECH", semester: 3, credits: 4 },
  ]);

  const [schoolInst, collegeInst] = await Institution.insertMany([
    {
      name: "Delhi Public Model School",
      type: "school",
      code: "DPMS-DELHI",
      tagline: "One Future. One Goal. A Million Dreams.",
      address: "Sector 14, Rohini Educational Enclave, New Delhi, 110085",
      phone: "+91 11 2786 4321",
      email: "info@dpms.edu.in",
      supportEmail: "support@dpms.edu.in",
      helpline: "1800-112-9988",
      website: "https://dpms.edu.in",
      principalOrDean: "Dr. R. K. Ramanathan",
    },
    {
      name: "Apex Institute of Technology & Management",
      type: "college",
      code: "AITM-UNIV",
      tagline: "One Future. One Goal. A Million Dreams.",
      address: "Knowledge Park III, Institutional Area, Greater Noida, UP 201310",
      phone: "+91 120 4567 890",
      email: "admissions@aitm.edu.in",
      supportEmail: "helpdesk@aitm.edu.in",
      helpline: "1800-200-4567",
      website: "https://aitm.edu.in",
      principalOrDean: "Dr. Arvind Swaminathan",
    },
  ]);

  const faculty = await Faculty.create({
    fullName: "Dr. Meera Krishnan", email: "meera.krishnan@university.edu", employeeId: "FAC1042",
    department: "CSE", designation: "Associate Professor", subjects: ["CS301", "CS302"],
    password: DEMO_PASSWORD, role: "faculty", isEmailVerified: true, institutionType: "college", institution: collegeInst._id,
  });

  const schoolFaculty = await Faculty.create({
    fullName: "Sunita Verma", email: "sunita.verma@school.edu", employeeId: "SCH101",
    designation: "Senior Mathematics Teacher", subjects: ["Mathematics", "Science"],
    schoolClass: "Class 10-A", password: DEMO_PASSWORD, role: "faculty", isEmailVerified: true, institutionType: "school", institution: schoolInst._id,
  });

  const admin = await Admin.create({
    fullName: "Dr. Arvind Swaminathan", email: "admin@university.edu",
    password: DEMO_PASSWORD, role: "admin", isEmailVerified: true, institutionType: "college", institution: collegeInst._id,
  });

  const schoolAdmin = await Admin.create({
    fullName: "Dr. R. K. Ramanathan", email: "principal@school.edu",
    password: DEMO_PASSWORD, role: "admin", isEmailVerified: true, institutionType: "school", institution: schoolInst._id,
  });

  const studentSeed = [
    { fullName: "Akshaj Mehta", rollNumber: "CSE21B045", email: "akshaj.mehta@university.edu", department: "CSE" },
    { fullName: "Riya Kapoor", rollNumber: "CSE21B012", email: "riya.kapoor@university.edu", department: "CSE" },
    { fullName: "Devansh Rao", rollNumber: "CSE21B078", email: "devansh.rao@university.edu", department: "CSE" },
    { fullName: "Sneha Pillai", rollNumber: "ECE21B019", email: "sneha.pillai@university.edu", department: "ECE" },
    { fullName: "Arjun Verma", rollNumber: "MECH21B033", email: "arjun.verma@university.edu", department: "MECH" },
    { fullName: "Kavya Nair", rollNumber: "CSE21B091", email: "kavya.nair@university.edu", department: "CSE" },
  ];

  const students = await Student.insertMany(
    studentSeed.map((s) => ({
      ...s, semester: 5, yearOfPassing: 2027, password: DEMO_PASSWORD,
      role: "student", isEmailVerified: true, institutionType: "college", institution: collegeInst._id,
    })),
    { runValidators: false }
  );

  const schoolStudent = await Student.create({
    fullName: "Aarav Sharma", rollNumber: "SCH2026-1001", email: "aarav.sharma@school.edu",
    schoolClass: "Class 10-A", section: "A", yearOfPassing: 2027, password: DEMO_PASSWORD,
    role: "student", isEmailVerified: true, institutionType: "school", institution: schoolInst._id,
  });

  // insertMany bypasses pre-save hooks, so hash passwords manually as a follow-up.
  const bcrypt = require("bcryptjs");
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  await Student.updateMany({}, { password: hashed });
  await Faculty.updateMany({}, { password: hashed });
  await Admin.updateMany({}, { password: hashed });

  const parent = await Parent.create({
    fullName: "Rajesh Mehta", email: "rajesh.mehta@gmail.com", mobileNumber: "+91 98200 11223",
    relationship: "Father", password: hashed, role: "parent",
    linkedStudent: students[0]._id, isEmailVerified: true,
  });
  await ParentStudentMapping.create({ parent: parent._id, student: students[0]._id });

  // Seed sample Fee documents
  await Fee.create([
    {
      student: students[0]._id,
      institution: collegeInst._id,
      institutionType: "college",
      academicYear: "2026-2027",
      semesterOrClass: "B.Tech CSE - Semester 5",
      totalAssessed: 85000,
      totalPaid: 50000,
      totalPending: 35000,
      items: [
        { title: "Semester 5 Tuition Fee", category: "Tuition Fee", amount: 65000, status: "partially_paid", dueDate: new Date(Date.now() + 30 * 86400000) },
        { title: "Computer Science Laboratory & Cloud Labs", category: "Laboratory Fee", amount: 20000, status: "paid", dueDate: new Date() },
      ],
      transactions: [
        { txnId: "TXN_INIT912", amount: 50000, method: "UPI", status: "successful", receiptId: "REC-2026-1001", paidAt: new Date(Date.now() - 5 * 86400000) },
      ],
    },
    {
      student: schoolStudent._id,
      institution: schoolInst._id,
      institutionType: "school",
      academicYear: "2026-2027",
      semesterOrClass: "Class 10-A",
      totalAssessed: 48000,
      totalPaid: 48000,
      totalPending: 0,
      items: [
        { title: "Term 2 Tuition & Activity Fee", category: "Tuition Fee", amount: 48000, status: "paid", dueDate: new Date() },
      ],
      transactions: [
        { txnId: "TXN_SCH001", amount: 48000, method: "Credit/Debit Card", status: "successful", receiptId: "REC-SCH-2026-01", paidAt: new Date(Date.now() - 10 * 86400000) },
      ],
    },
  ]);

  // Seed Study Resources
  await StudyResource.create([
    {
      title: "CBSE Class 10 Mathematics - Formula Handbook & Exemplar Solutions",
      description: "Comprehensive formula sheet, solved NCERT exemplars, and theorem proofs for Term 2 Board Exams.",
      institutionType: "school",
      courseOrClass: "Class 10-A",
      subject: "Mathematics",
      fileUrl: "https://ezen-storage.edu/resources/Class10_Maths_Handbook.pdf",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadedBy: schoolFaculty._id,
      uploadedByName: "Sunita Verma",
    },
    {
      title: "CS301 - Data Structures Algorithms Handbook & Practice Sets",
      description: "Balanced binary search trees, red-black trees, heap structures, and amortized complexity notes.",
      institutionType: "college",
      courseOrClass: "CS301",
      subject: "Data Structures",
      fileUrl: "https://ezen-storage.edu/resources/CS301_DSA_Notes.pdf",
      fileType: "PDF",
      fileSize: "3.8 MB",
      uploadedBy: faculty._id,
      uploadedByName: "Dr. Meera Krishnan",
    },
  ]);

  // Attendance: 30 days per student with risk-tier-appropriate ratios
  const attendanceDocs = [];
  students.forEach((s, idx) => {
    const presentRatio = idx % 3 === 2 ? 0.6 : idx % 3 === 1 ? 0.78 : 0.92;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      attendanceDocs.push({
        student: s._id, course: "CS301", date,
        status: Math.random() < presentRatio ? "present" : Math.random() < 0.4 ? "late" : "absent",
        markedBy: faculty._id,
      });
    }
  });
  await Attendance.insertMany(attendanceDocs);

  await Marks.insertMany(
    students.map((s, idx) => ({
      student: s._id, course: "CS301", examType: "internal1",
      marksObtained: idx % 3 === 2 ? 21 : idx % 3 === 1 ? 33 : 45, totalMarks: 50,
      uploadedBy: faculty._id,
    }))
  );

  await Assignment.create({
    title: "Binary Search Trees Implementation", course: "CS301",
    description: "Implement a self-balancing BST with insert, delete and traversal operations.",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdBy: faculty._id,
    submissions: students.map((s, idx) => ({ student: s._id, status: idx % 3 === 2 ? "pending" : "submitted" })),
  });

  console.log("Seed complete:");
  console.log(`  ${departments.length} departments, ${courses.length} courses`);
  console.log(`  ${students.length} students, 1 faculty, 1 parent, 1 admin`);
  console.log(`  Demo password for all accounts: ${DEMO_PASSWORD}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
