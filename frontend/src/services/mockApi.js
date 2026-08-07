// Simulated backend layer. Mirrors the real Express/MongoDB API contract
// described in /backend so this frontend runs as a complete, working demo
// with zero setup. Swap calls in this file for the axios client in
// services/api.js to point at a live backend - the function signatures
// returned to components are identical either way.

import {
  STUDENTS, FACULTY, PARENTS, ADMINS, ATTENDANCE, MARKS,
  ASSIGNMENTS, NOTIFICATIONS, WARNING_HISTORY, DEPARTMENTS, COURSES,
  DEMO_PASSWORD,
} from "./seedData";

const STORE_KEY = "spms_db_v2";
const SESSION_KEY = "spms_session_v1";

const seedDB = () => ({
  students: STUDENTS,
  faculty: FACULTY,
  parents: PARENTS,
  admins: ADMINS,
  attendance: ATTENDANCE,
  marks: MARKS,
  assignments: ASSIGNMENTS,
  notifications: NOTIFICATIONS,
  warningHistory: WARNING_HISTORY,
  departments: DEPARTMENTS,
  courses: COURSES,
  assessments: [],
  selfReports: [],
  pendingOtps: {},
});

const loadDB = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const fresh = seedDB();
      localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const db = JSON.parse(raw);
    db.assessments    ||= [];
    db.selfReports    ||= [];
    db.mentorMeetings ||= [];
    return db;
  } catch {
    const fresh = seedDB();
    localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
    return fresh;
  }
};

const saveDB = (db) => localStorage.setItem(STORE_KEY, JSON.stringify(db));

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));
const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const portalFor = (student) => {
  const prefix = student?.department === "ECE" ? "EC" : student?.department === "MECH" ? "ME" : "CS";
  return {
    courses: [
      { code: `${prefix}301`, name: "Data Structures & Algorithms", instructor: "Dr. Meera Krishnan", credits: 4, color: "cyan" },
      { code: `${prefix}302`, name: "Database Management Systems", instructor: "Prof. Ravi Menon", credits: 4, color: "violet" },
      { code: `${prefix}303`, name: "Operating Systems", instructor: "Dr. Ananya Shah", credits: 3, color: "amber" },
      { code: `${prefix}304`, name: "Computer Networks", instructor: "Prof. Karthik Rao", credits: 3, color: "rose" },
    ],
    timetable: {
      Monday: ["09:00–10:00 • Data Structures", "11:00–12:00 • DBMS", "14:00–15:00 • Operating Systems"],
      Tuesday: ["10:00–11:00 • Computer Networks", "12:00–13:00 • DBMS Lab", "15:00–16:00 • Data Structures"],
      Wednesday: ["09:00–10:00 • Operating Systems", "11:00–12:00 • Data Structures", "14:00–16:00 • OS Lab"],
      Thursday: ["10:00–11:00 • DBMS", "12:00–13:00 • Computer Networks", "15:00–16:00 • Tutorial"],
      Friday: ["09:00–10:00 • Data Structures", "11:00–13:00 • Networks Lab", "14:00–15:00 • DBMS"],
    },
    mentor: { name: "Dr. Meera Krishnan", title: "Faculty Mentor", email: "meera.krishnan@university.edu" },
  };
};

// ---------------------------------------------------------------------------
// Composite score formula - identical to backend/utils/calculateWarning.js
// ---------------------------------------------------------------------------
export const calculateComposite = ({ attendancePct, marksPct, submissionPct }) => {
  const score = attendancePct * 0.3 + marksPct * 0.4 + submissionPct * 0.3;
  let riskLevel = "normal";
  if (score >= 80) riskLevel = "excellent";
  else if (score < 65) riskLevel = "at-risk";
  return { score: Math.round(score * 100) / 100, riskLevel };
};

const findUserByEmail = (db, email) => {
  const all = [
    ...db.students.map((u) => ({ ...u, role: "student" })),
    ...db.faculty.map((u) => ({ ...u, role: "faculty" })),
    ...db.parents.map((u) => ({ ...u, role: "parent" })),
    ...db.admins.map((u) => ({ ...u, role: "admin" })),
  ];
  return all.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
export const authApi = {
  async sendOtp(email, fullName) {
    await delay();
    const db = loadDB();
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    db.pendingOtps[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
    saveDB(db);
    // In a real deployment this is emailed via Nodemailer; surfaced here for demo only.
    return { success: true, devOtp: otp, message: "OTP sent to your email (demo mode shows it directly)" };
  },

  async verifyOtp(email, otp) {
    await delay(250);
    const db = loadDB();
    const record = db.pendingOtps[email];
    if (!record) return { success: false, message: "No OTP requested for this email" };
    if (Date.now() > record.expires) return { success: false, message: "OTP expired" };
    if (record.otp !== otp) return { success: false, message: "Invalid OTP" };
    record.verified = true;
    saveDB(db);
    return { success: true, message: "OTP verified" };
  },

  async registerStudent(payload) {
    await delay();
    const db = loadDB();
    const otpRecord = db.pendingOtps[payload.email];
    if (!otpRecord?.verified) return { success: false, message: "Please verify your email OTP first" };
    if (findUserByEmail(db, payload.email)) return { success: false, message: "Email already registered" };

    const student = {
      id: uid("stu"), fullName: payload.fullName, rollNumber: payload.rollNumber,
      email: payload.email, department: payload.department, semester: Number(payload.semester),
      yearOfPassing: Number(payload.yearOfPassing), password: payload.password,
      composite: { score: 75, riskLevel: "normal" },
    };
    db.students.push(student);
    delete db.pendingOtps[payload.email];
    saveDB(db);
    return { success: true, user: { ...student, role: "student" } };
  },

  async registerParent(payload) {
    await delay();
    const db = loadDB();
    const student = db.students.find(
      (s) => s.rollNumber === payload.studentRollNumber && s.email === payload.studentEmail
    );
    if (!student) return { success: false, message: "No matching student found" };
    if (findUserByEmail(db, payload.parentEmail)) return { success: false, message: "Parent already registered" };

    const parent = {
      id: uid("par"), fullName: payload.fullName, email: payload.parentEmail,
      mobileNumber: payload.mobileNumber, relationship: payload.relationship,
      password: payload.password, linkedStudentId: student.id,
    };
    db.parents.push(parent);
    saveDB(db);
    return { success: true, user: { ...parent, role: "parent" } };
  },

  async login(email, password, role) {
    await delay();
    const db = loadDB();
    const user = findUserByEmail(db, email);
    if (!user || user.role !== role) return { success: false, message: "Invalid credentials" };
    if (user.password && user.password !== password && password !== DEMO_PASSWORD) {
      return { success: false, message: "Invalid credentials" };
    }
    const session = { id: user.id, role: user.role, email: user.email, fullName: user.fullName };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session };
  },

  async forgotPassword(email) {
    await delay();
    const db = loadDB();
    if (!findUserByEmail(db, email)) return { success: false, message: "No account with that email" };
    return { success: true, message: "Password reset link sent to your email (demo: link skipped)" };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  },
};

// ---------------------------------------------------------------------------
// SHARED HELPERS
// ---------------------------------------------------------------------------
const studentAttendancePct = (db, studentId) => {
  const records = db.attendance.filter((a) => a.studentId === studentId);
  if (!records.length) return 100;
  const present = records.filter((a) => a.status === "present").length;
  return Math.round((present / records.length) * 10000) / 100;
};

const studentMarksPct = (db, studentId) => {
  const records = db.marks.filter((m) => m.studentId === studentId);
  if (!records.length) return 100;
  const avg = records.reduce((sum, m) => sum + (m.marksObtained / m.totalMarks) * 100, 0) / records.length;
  return Math.round(avg * 100) / 100;
};

const studentSubmissionPct = (db, studentId) => {
  let total = 0, onTime = 0;
  db.assignments.forEach((a) => {
    const sub = a.submissions.find((s) => s.studentId === studentId);
    if (sub) {
      total += 1;
      if (sub.status === "submitted") onTime += 1;
    }
  });
  return total ? Math.round((onTime / total) * 10000) / 100 : 100;
};

// ---------------------------------------------------------------------------
// STUDENT
// ---------------------------------------------------------------------------
export const studentApi = {
  async getProfile(studentId) {
    await delay(200);
    const db = loadDB();
    return db.students.find((s) => s.id === studentId);
  },
  async getDashboard(studentId) {
    await delay();
    const db = loadDB();
    const attendancePct = studentAttendancePct(db, studentId);
    const marksPct = studentMarksPct(db, studentId);
    const submissionPct = studentSubmissionPct(db, studentId);
    const composite = calculateComposite({ attendancePct, marksPct, submissionPct });
    const assignments = db.assignments
      .filter((a) => a.submissions.some((s) => s.studentId === studentId))
      .map((a) => {
        const sub = a.submissions.find((s) => s.studentId === studentId);
        return {
          ...a,
          status: sub?.status,
          marks: sub?.marks ?? null,
          totalMarks: sub?.totalMarks ?? null,
          gradedAt: sub?.gradedAt ?? null,
        };
      });
    return {
      attendancePct, marksPct, submissionPct, composite,
      assignments,
      marks: db.marks.filter((m) => m.studentId === studentId),
      attendanceRecords: db.attendance
        .filter((a) => a.studentId === studentId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
      trend: db.warningHistory[studentId] || [],
      notifications: db.notifications.filter((n) => n.recipientId === studentId),
    };
  },
  async getPortal(studentId) {
    await delay(180);
    const student = loadDB().students.find((s) => s.id === studentId);
    return portalFor(student);
  },
  async submitAssignment(assignmentId, studentId, fileName, fileData = null) {
    await delay(350);
    const db = loadDB();
    const assignment = db.assignments.find((a) => a.id === assignmentId);
    const submission = assignment?.submissions.find((s) => s.studentId === studentId);
    if (!submission) return { success: false, message: "Assignment not found" };
    submission.status = "submitted";
    submission.fileName = fileName;
    submission.submittedAt = new Date().toISOString();
    saveDB(db);
    // Store actual file binary separately so faculty can preview/download it.
    // Uses a dedicated key to keep the main DB payload small.
    if (fileData) {
      try {
        localStorage.setItem(`spms_file_${assignmentId}_${studentId}`, fileData);
      } catch {
        // localStorage quota exceeded — file preview unavailable but submission still recorded
      }
    }
    return { success: true };
  },

  // Returns stored file DataURL for a specific submission, or null if not available.
  getSubmissionFile(assignmentId, studentId) {
    return localStorage.getItem(`spms_file_${assignmentId}_${studentId}`) || null;
  },
  async updateProfile(studentId, payload) {
    await delay(250);
    const db = loadDB();
    const student = db.students.find((s) => s.id === studentId);
    if (!student) return { success: false };
    Object.assign(student, payload);
    saveDB(db);
    return { success: true, student };
  },
  async listAll(filters = {}) {
    await delay();
    const db = loadDB();
    let list = [...db.students];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((s) => s.fullName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q));
    }
    if (filters.riskLevel) list = list.filter((s) => s.composite.riskLevel === filters.riskLevel);
    if (filters.department) list = list.filter((s) => s.department === filters.department);
    if (filters.section) list = list.filter((s) => s.section === filters.section);
    if (filters.course) {
      // Filter students who have attendance or marks records for the given course
      const courseStudentIds = new Set([
        ...db.attendance.filter((a) => a.course === filters.course).map((a) => a.studentId),
        ...db.marks.filter((m) => m.course === filters.course).map((m) => m.studentId),
        ...db.assignments.filter((a) => a.course === filters.course).flatMap((a) => a.submissions.map((s) => s.studentId)),
      ]);
      list = list.filter((s) => courseStudentIds.has(s.id));
    }
    return list;
  },
};

// ---------------------------------------------------------------------------
// FACULTY
// ---------------------------------------------------------------------------
export const facultyApi = {
  async getDashboardStats() {
    await delay();
    const db = loadDB();
    const pendingAssignments = db.assignments.reduce(
      (sum, a) => sum + a.submissions.filter((s) => s.status === "pending").length, 0
    );
    return {
      totalStudents: db.students.length,
      attendanceEntries: db.attendance.length,
      pendingAssignments,
      atRiskStudents: db.students.filter((s) => s.composite.riskLevel === "at-risk").length,
    };
  },
  async markAttendance(studentId, course, status, details = {}) {
    await delay(200);
    const db = loadDB();
    db.attendance.push({ id: uid("att"), studentId, course, date: details.date || new Date().toISOString(), status, ...details });
    saveDB(db);
    return { success: true };
  },
  async uploadMarks(studentId, course, examType, marksObtained, totalMarks, details = {}) {
    await delay(200);
    const db = loadDB();
    db.marks.push({ id: uid("mk"), studentId, course, examType, marksObtained: Number(marksObtained), totalMarks: Number(totalMarks), ...details });
    saveDB(db);
    return { success: true };
  },
  async updateMarks(markId, fields) {
    await delay(200);
    const db = loadDB();
    const record = db.marks.find((m) => m.id === markId);
    if (!record) return { success: false, message: "Record not found" };
    if (fields.marksObtained !== undefined) record.marksObtained = Number(fields.marksObtained);
    if (fields.totalMarks !== undefined) record.totalMarks = Number(fields.totalMarks);
    if (fields.examType !== undefined) record.examType = fields.examType;
    if (fields.course !== undefined) record.course = fields.course;
    saveDB(db);
    return { success: true, record };
  },
  async getMarks(studentId = null) {
    await delay(150);
    const db = loadDB();
    return studentId ? db.marks.filter((m) => m.studentId === studentId) : db.marks;
  },
  async updateSubmission(assignmentId, studentId, status) {
    await delay(200);
    const db = loadDB();
    const assignment = db.assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      const sub = assignment.submissions.find((s) => s.studentId === studentId);
      if (sub) sub.status = status;
    }
    saveDB(db);
    return { success: true };
  },

  // Grade a student's assignment submission
  async setAssignmentMarks(assignmentId, studentId, marks, totalMarks) {
    await delay(200);
    const db = loadDB();
    const assignment = db.assignments.find((a) => a.id === assignmentId);
    if (!assignment) return { success: false, message: "Assignment not found" };
    const sub = assignment.submissions.find((s) => s.studentId === studentId);
    if (!sub) return { success: false, message: "Submission not found" };
    sub.marks = Number(marks);
    sub.totalMarks = Number(totalMarks);
    sub.gradedAt = new Date().toISOString();
    saveDB(db);
    return { success: true };
  },
  async createAssignment(payload) {
    await delay(250);
    const db = loadDB();
    db.assignments.push({
      id: uid("asg"), ...payload,
      submissions: payload.studentIds.map((id) => ({ studentId: id, status: "pending" })),
    });
    saveDB(db);
    return { success: true };
  },
  async listAssignments() {
    await delay();
    const db = loadDB();
    return db.assignments;
  },
  async createAssessment(payload) {
    await delay(250);
    const db = loadDB();
    db.assessments.push({ id: uid("asm"), createdAt: new Date().toISOString(), ...payload });
    saveDB(db);
    return { success: true };
  },
  async listAssessments() {
    await delay(150);
    return loadDB().assessments;
  },
  async createSelfReport(payload) {
    await delay(250);
    const db = loadDB();
    db.selfReports.unshift({ id: uid("rpt"), createdAt: new Date().toISOString(), ...payload });
    saveDB(db);
    return { success: true };
  },
  async listSelfReports(facultyId) {
    await delay(150);
    return loadDB().selfReports.filter((report) => report.facultyId === facultyId);
  },
  async getProfile(facultyId) {
    await delay(150);
    return loadDB().faculty.find((faculty) => faculty.id === facultyId);
  },
  async updateProfile(facultyId, payload) {
    await delay(200);
    const db = loadDB();
    const faculty = db.faculty.find((item) => item.id === facultyId);
    if (!faculty) return { success: false };
    Object.assign(faculty, payload);
    saveDB(db);
    return { success: true, faculty };
  },

  // ── Meeting Requests (Faculty side) ─────────────────────────────────────
  async getMeetingRequests(facultyId) {
    await delay(200);
    const db = loadDB();
    db.mentorMeetings ||= [];
    // Return meetings addressed to this faculty (or all if no facultyId set, for backwards-compat)
    return db.mentorMeetings.filter(
      (m) => m.facultyId === facultyId || (!m.facultyId && m.status === "pending")
    );
  },

  // action: "accepted" | "declined" | "postponed"
  async respondToMeeting(meetingId, action, payload = {}) {
    await delay(250);
    const db = loadDB();
    db.mentorMeetings ||= [];
    const meeting = db.mentorMeetings.find((m) => m.id === meetingId);
    if (!meeting) return { success: false, message: "Meeting not found" };
    meeting.status = action;
    meeting.facultyResponse = payload.note || null;
    if (action === "postponed") {
      meeting.postponedDate = payload.newDate || null;
      meeting.postponedTime = payload.newTime || null;
    }
    meeting.respondedAt = new Date().toISOString();
    saveDB(db);
    return { success: true, meeting };
  },
};

// ---------------------------------------------------------------------------
// PARENT
// ---------------------------------------------------------------------------
export const parentApi = {
  async getChildDashboard(parentId) {
    await delay();
    const db = loadDB();
    const parent = db.parents.find((p) => p.id === parentId);
    const student = db.students.find((s) => s.id === parent?.linkedStudentId);
    if (!student) return null;
    const attendancePct = studentAttendancePct(db, student.id);
    const marksPct = studentMarksPct(db, student.id);
    const submissionPct = studentSubmissionPct(db, student.id);
    return {
      student, attendancePct, marksPct, submissionPct,
      assignments: db.assignments
        .filter((a) => a.submissions.some((s) => s.studentId === student.id))
        .map((a) => {
          const sub = a.submissions.find((s) => s.studentId === student.id);
          return {
            ...a,
            status: sub?.status,
            marks: sub?.marks ?? null,
            totalMarks: sub?.totalMarks ?? null,
            gradedAt: sub?.gradedAt ?? null,
          };
        }),
      marks: db.marks.filter((m) => m.studentId === student.id),
      attendanceRecords: db.attendance
        .filter((a) => a.studentId === student.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
      trend: db.warningHistory[student.id] || [],
      notifications: db.notifications.filter((n) => n.recipientId === parentId || n.recipientId === student.id),
    };
  },

  // List all faculty (for the meeting-request faculty-selection dropdown)
  async listFaculty() {
    await delay(150);
    return loadDB().faculty.map((f) => ({
      id: f.id,
      fullName: f.fullName,
      designation: f.designation || "Faculty",
      department: f.department,
      subjects: f.subjects || [],
      email: f.email,
    }));
  },

  // ── Mentor Meeting Requests ──────────────────────────────────────────────
  async getMentorMeetings(parentId) {
    await delay(200);
    const db = loadDB();
    db.mentorMeetings ||= [];
    return db.mentorMeetings.filter((m) => m.parentId === parentId);
  },

  async requestMentorMeeting(parentId, payload) {
    await delay(300);
    const db = loadDB();
    db.mentorMeetings ||= [];
    const parent = db.parents.find((p) => p.id === parentId);
    const meeting = {
      id: `mtg_${Math.random().toString(36).slice(2, 9)}`,
      parentId,
      parentName: parent?.fullName || "Parent",
      facultyId: payload.facultyId || null,
      facultyName: payload.facultyName || null,
      subject: payload.subject,
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
      message: payload.message,
      status: "pending", // pending | accepted | declined | postponed | cancelled
      createdAt: new Date().toISOString(),
      facultyResponse: null,
      postponedDate: null,
      postponedTime: null,
    };
    db.mentorMeetings.push(meeting);
    saveDB(db);
    return { success: true, meeting };
  },

  async cancelMeetingRequest(meetingId) {
    await delay(200);
    const db = loadDB();
    db.mentorMeetings ||= [];
    const meeting = db.mentorMeetings.find((m) => m.id === meetingId);
    if (!meeting) return { success: false };
    meeting.status = "cancelled";
    saveDB(db);
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------
export const adminApi = {
  async getDashboardStats() {
    await delay();
    const db = loadDB();
    const deptStats = db.departments.map((d) => {
      const studs = db.students.filter((s) => s.department === d.id);
      const avg = studs.length ? studs.reduce((sum, s) => sum + s.composite.score, 0) / studs.length : 0;
      return { department: d.id, count: studs.length, avgScore: Math.round(avg * 100) / 100 };
    });
    return {
      totalStudents: db.students.length,
      totalFaculty: db.faculty.length,
      totalParents: db.parents.length,
      atRiskStudents: db.students.filter((s) => s.composite.riskLevel === "at-risk").length,
      departmentStats: deptStats,
    };
  },
  async listUsers(role) {
    await delay();
    const db = loadDB();
    const map = { student: db.students, faculty: db.faculty, parent: db.parents, admin: db.admins };
    return role ? map[role] || [] : [...db.students, ...db.faculty, ...db.parents, ...db.admins];
  },
  async listDepartments() {
    await delay(150);
    return loadDB().departments;
  },
  async listCourses() {
    await delay(150);
    return loadDB().courses;
  },
};

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------
export const notificationApi = {
  async getMine(recipientId) {
    await delay(150);
    const db = loadDB();
    return db.notifications.filter((n) => n.recipientId === recipientId);
  },
  async markAllRead(recipientId) {
    await delay(100);
    const db = loadDB();
    db.notifications.forEach((n) => {
      if (n.recipientId === recipientId) n.isRead = true;
    });
    saveDB(db);
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// REPORTS
// ---------------------------------------------------------------------------
export const reportApi = {
  async getAtRiskAnalysis() {
    await delay();
    const db = loadDB();
    return db.students.filter((s) => s.composite.riskLevel === "at-risk");
  },
};
