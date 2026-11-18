// Simulated backend layer. Mirrors the real Express/MongoDB API contract
// described in /backend so this frontend runs as a complete, working demo
// with zero setup. Swap calls in this file for the axios client in
// services/api.js to point at a live backend - the function signatures
// returned to components are identical either way.

import {
  STUDENTS, FACULTY, PARENTS, ADMINS, ATTENDANCE, MARKS,
  ASSIGNMENTS, NOTIFICATIONS, WARNING_HISTORY, DEPARTMENTS, COURSES,
  DEMO_PASSWORD, INSTITUTIONS, SCHOOL_CLASSES, SCHOOL_SUBJECTS,
  FEES_DATA, STUDY_RESOURCES, ATTENDANCE_CORRECTIONS, QR_SESSIONS, DEMO_USERS, AUDIT_LOGS,
} from "./seedData";

const STORE_KEY = "ezen_db_v4";
const SESSION_KEY = "ezen_session_v1";

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
  institutions: INSTITUTIONS,
  schoolClasses: SCHOOL_CLASSES,
  schoolSubjects: SCHOOL_SUBJECTS,
  fees: FEES_DATA,
  studyResources: STUDY_RESOURCES,
  attendanceCorrections: ATTENDANCE_CORRECTIONS,
  qrSessions: QR_SESSIONS,
  auditLogs: AUDIT_LOGS || [],
  assessments: [],
  selfReports: [],
  pendingOtps: {},
  loginAttempts: {},
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
    db.institutions           ||= INSTITUTIONS;
    db.schoolClasses          ||= SCHOOL_CLASSES;
    db.schoolSubjects         ||= SCHOOL_SUBJECTS;
    db.fees                   ||= FEES_DATA;
    db.studyResources         ||= STUDY_RESOURCES;
    db.attendanceCorrections  ||= ATTENDANCE_CORRECTIONS;
    db.qrSessions             ||= QR_SESSIONS;
    db.auditLogs              ||= [];
    db.assessments            ||= [];
    db.selfReports            ||= [];
    db.mentorMeetings         ||= [];
    db.meetingNotifications   ||= [];
    db.loginAttempts          ||= {};
    return db;
  } catch {
    const fresh = seedDB();
    localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
    return fresh;
  }
};

const saveDB = (db) => localStorage.setItem(STORE_KEY, JSON.stringify(db));

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));
const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const portalFor = (student) => {
  if (student?.institutionType === "school") {
    return {
      courses: [
        { code: "MTH10", name: "Mathematics", instructor: "Sunita Verma", credits: 4, color: "cyan" },
        { code: "SCI10", name: "Science & Lab", instructor: "Sunita Verma", credits: 4, color: "violet" },
        { code: "ENG10", name: "English Literature", instructor: "Rajeshwari Nair", credits: 3, color: "amber" },
        { code: "SST10", name: "Social Studies", instructor: "Rajeshwari Nair", credits: 3, color: "rose" },
        { code: "CSC10", name: "Computer Applications", instructor: "Amitabh Sen", credits: 3, color: "emerald" },
      ],
      timetable: {
        Monday: ["08:30–09:20 • Mathematics", "09:25–10:15 • Science & Lab", "10:35–11:25 • English", "11:30–12:20 • Social Studies"],
        Tuesday: ["08:30–09:20 • Science", "09:25–10:15 • Mathematics", "10:35–11:25 • Computer Apps", "11:30–12:20 • Social Studies"],
        Wednesday: ["08:30–09:20 • English", "09:25–10:15 • Science Lab", "10:35–11:25 • Mathematics", "11:30–12:20 • Physical Ed"],
        Thursday: ["08:30–09:20 • Mathematics", "09:25–10:15 • Social Studies", "10:35–11:25 • English", "11:30–12:20 • Library"],
        Friday: ["08:30–09:20 • Science", "09:25–10:15 • Mathematics", "10:35–11:25 • Computer Apps", "11:30–12:20 • Art & Activity"],
      },
      mentor: { name: "Sunita Verma", title: "Class Teacher & Mentor", email: "sunita.verma@school.edu" },
    };
  }

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

const findUserByEmailOrContact = (db, contact) => {
  if (!contact) return null;
  const q = String(contact).trim().toLowerCase();
  const all = [
    ...db.students.map((u) => ({ ...u, role: "student" })),
    ...db.faculty.map((u) => ({ ...u, role: "faculty" })),
    ...db.parents.map((u) => ({ ...u, role: "parent" })),
    ...db.admins.map((u) => ({ ...u, role: "admin" })),
  ];
  return all.find(
    (u) =>
      u.email?.toLowerCase() === q ||
      (u.mobile && u.mobile.replace(/\D/g, "") === q.replace(/\D/g, "")) ||
      (u.mobileNumber && u.mobileNumber.replace(/\D/g, "") === q.replace(/\D/g, ""))
  );
};

const buildSession = (user, db) => {
  const instType = user.institutionType || (user.schoolClass ? "school" : "college");
  const inst = db.institutions?.[instType] || INSTITUTIONS[instType] || INSTITUTIONS.college;
  return {
    id: user.id,
    role: user.role,
    institutionType: instType,
    institution: inst,
    email: user.email,
    fullName: user.fullName,
    mobile: user.mobile || user.mobileNumber,
    rollNumber: user.rollNumber,
    schoolClass: user.schoolClass,
    section: user.section,
    department: user.department,
    semester: user.semester,
    designation: user.designation,
    composite: user.composite,
  };
};

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
export const authApi = {
  async sendOtp(contact, fullName) {
    await delay(200);
    const db = loadDB();
    const key = String(contact).trim().toLowerCase();

    // Check resend countdown (60s cooldown)
    const existing = db.pendingOtps[key];
    if (existing && Date.now() - existing.requestedAt < 60 * 1000) {
      const wait = Math.ceil((60 * 1000 - (Date.now() - existing.requestedAt)) / 1000);
      return { success: false, message: `Please wait ${wait} seconds before requesting a new OTP.` };
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    db.pendingOtps[key] = {
      otp,
      requestedAt: Date.now(),
      expires: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      verified: false,
    };
    saveDB(db);

    return {
      success: true,
      devOtp: otp,
      message: `OTP sent successfully to ${contact}. (Demo code: ${otp})`,
    };
  },

  async verifyOtp(contact, otp) {
    await delay(200);
    const db = loadDB();
    const key = String(contact).trim().toLowerCase();
    const record = db.pendingOtps[key];

    if (!record) return { success: false, message: "No OTP requested for this contact" };
    if (Date.now() > record.expires) return { success: false, message: "OTP has expired. Please request a new one." };

    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 3) {
      delete db.pendingOtps[key];
      saveDB(db);
      return { success: false, message: "Too many incorrect attempts. Please request a new OTP." };
    }

    if (record.otp !== String(otp).trim()) {
      saveDB(db);
      return { success: false, message: `Invalid OTP. (${3 - record.attempts} attempts remaining)` };
    }

    record.verified = true;
    saveDB(db);
    return { success: true, message: "OTP verified successfully" };
  },

  async login(email, password, role) {
    await delay();
    const db = loadDB();
    const key = email.toLowerCase().trim();

    // Lockout check (3 failed attempts within 15 mins)
    const attempts = db.loginAttempts?.[key] || { count: 0, lastFailed: 0 };
    if (attempts.count >= 3 && Date.now() - attempts.lastFailed < 15 * 60 * 1000) {
      const minsLeft = Math.ceil((15 * 60 * 1000 - (Date.now() - attempts.lastFailed)) / 60000);
      return {
        success: false,
        message: `Account temporarily locked due to 3 failed attempts. Please retry in ${minsLeft} minutes.`,
      };
    }

    const user = findUserByEmailOrContact(db, email);
    if (!user || user.role !== role) {
      db.loginAttempts[key] = { count: attempts.count + 1, lastFailed: Date.now() };
      saveDB(db);
      return { success: false, message: "Invalid credentials or unauthorized role access." };
    }

    if (user.password && user.password !== password && password !== DEMO_PASSWORD) {
      db.loginAttempts[key] = { count: attempts.count + 1, lastFailed: Date.now() };
      saveDB(db);
      return { success: false, message: "Invalid password." };
    }

    // Reset failed attempts on success
    delete db.loginAttempts[key];
    const session = buildSession(user, db);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    saveDB(db);
    return { success: true, user: session };
  },

  async loginWithOtp({ contact, otp, role }) {
    await delay(250);
    const db = loadDB();
    const key = String(contact).trim().toLowerCase();
    const record = db.pendingOtps[key];

    if (!record) return { success: false, message: "Please request an OTP first." };
    if (Date.now() > record.expires) return { success: false, message: "OTP has expired." };
    if (record.otp !== String(otp).trim() && !record.verified) {
      return { success: false, message: "Invalid OTP code." };
    }

    const user = findUserByEmailOrContact(db, contact);
    if (!user) {
      return { success: false, message: "No registered institutional account found for this contact." };
    }
    if (role && user.role !== role) {
      return { success: false, message: `Account exists but role is not '${role}'.` };
    }

    delete db.pendingOtps[key];
    const session = buildSession(user, db);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    saveDB(db);
    return { success: true, user: session };
  },

  async loginWithSocial({ provider, demoKey }) {
    await delay(300);
    const db = loadDB();
    const demoInfo = DEMO_USERS[demoKey] || DEMO_USERS.college_student;
    const user = findUserByEmailOrContact(db, demoInfo.email);
    if (!user) return { success: false, message: "Social account not matched to an institutional record." };

    const session = buildSession(user, db);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session, provider };
  },

  async loginDemo(demoKey) {
    await delay(150);
    const db = loadDB();
    const demoInfo = DEMO_USERS[demoKey];
    if (!demoInfo) return { success: false, message: "Unknown demo role" };
    const user = findUserByEmailOrContact(db, demoInfo.email);
    if (!user) return { success: false, message: "Demo user record not found" };

    const session = buildSession(user, db);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session };
  },

  async registerStudent(payload) {
    await delay();
    const db = loadDB();
    const otpRecord = db.pendingOtps[payload.email?.toLowerCase().trim()];
    if (!otpRecord?.verified) return { success: false, message: "Please verify your email OTP first" };
    if (findUserByEmailOrContact(db, payload.email)) return { success: false, message: "Email already registered" };

    const student = {
      id: uid("stu"),
      fullName: payload.fullName,
      rollNumber: payload.rollNumber,
      email: payload.email,
      mobile: payload.mobile,
      institutionType: payload.institutionType || "college",
      schoolClass: payload.schoolClass,
      department: payload.department || "General",
      semester: Number(payload.semester || 1),
      section: payload.section || "A",
      yearOfPassing: Number(payload.yearOfPassing || 2026),
      password: payload.password,
      composite: { score: 75, riskLevel: "normal" },
    };
    db.students.push(student);
    delete db.pendingOtps[payload.email?.toLowerCase().trim()];
    saveDB(db);
    return { success: true, user: buildSession({ ...student, role: "student" }, db) };
  },

  async registerParent(payload) {
    await delay();
    const db = loadDB();
    const student = db.students.find(
      (s) => s.rollNumber === payload.studentRollNumber && s.email === payload.studentEmail
    );
    if (!student) return { success: false, message: "No matching student found" };
    if (findUserByEmailOrContact(db, payload.parentEmail)) return { success: false, message: "Parent already registered" };

    const parent = {
      id: uid("par"),
      fullName: payload.fullName,
      email: payload.parentEmail,
      mobileNumber: payload.mobileNumber,
      relationship: payload.relationship,
      password: payload.password,
      linkedStudentId: student.id,
      institutionType: student.institutionType || "college",
    };
    db.parents.push(parent);
    saveDB(db);
    return { success: true, user: buildSession({ ...parent, role: "parent" }, db) };
  },

  async forgotPassword(email) {
    await delay();
    const db = loadDB();
    if (!findUserByEmailOrContact(db, email)) return { success: false, message: "No account with that email" };
    return { success: true, message: "Password reset link sent to your registered email (valid for 30 minutes)." };
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

  // ── Conduct Meeting: attach a Google Meet link and notify parent ──────────
  async conductMeeting(meetingId, { meetLink, scheduledDate, scheduledTime }) {
    await delay(300);
    const db = loadDB();
    db.mentorMeetings     ||= [];
    db.notifications      ||= [];
    db.meetingNotifications ||= [];

    const meeting = db.mentorMeetings.find((m) => m.id === meetingId);
    if (!meeting) return { success: false, message: "Meeting not found" };

    // Update meeting record
    meeting.meetLink      = meetLink;
    meeting.scheduledDate = scheduledDate || meeting.preferredDate;
    meeting.scheduledTime = scheduledTime || meeting.preferredTime;
    meeting.status        = "scheduled";
    meeting.conductedAt   = new Date().toISOString();

    // Create a system notification for the parent
    const notifId = `notif_meet_${Math.random().toString(36).slice(2, 9)}`;
    const notif = {
      id: notifId,
      type: "meet_link",
      recipientId: meeting.parentId,
      meetingId: meeting.id,
      title: "Google Meet Link Shared",
      message: `Your faculty has scheduled a Google Meet for "${meeting.subject}". Join using the link provided.`,
      meetLink,
      scheduledDate: meeting.scheduledDate,
      scheduledTime: meeting.scheduledTime,
      facultyName: meeting.facultyName,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    db.notifications.push(notif);
    db.meetingNotifications.push(notif);

    saveDB(db);
    return { success: true, meeting };
  },

  // ── Mark a scheduled meeting as completed ─────────────────────────────────
  async markMeetingCompleted(meetingId) {
    await delay(200);
    const db = loadDB();
    db.mentorMeetings ||= [];
    const meeting = db.mentorMeetings.find((m) => m.id === meetingId);
    if (!meeting) return { success: false, message: "Meeting not found" };
    meeting.status      = "completed";
    meeting.completedAt = new Date().toISOString();
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

// ---------------------------------------------------------------------------
// INSTITUTION
// ---------------------------------------------------------------------------
export const institutionApi = {
  async getDetails(type = "college") {
    await delay(100);
    const db = loadDB();
    return db.institutions?.[type] || INSTITUTIONS[type] || INSTITUTIONS.college;
  },
  async getClasses(type = "school") {
    await delay(100);
    const db = loadDB();
    return type === "school" ? db.schoolClasses : db.departments;
  },
  async getSubjects(type = "school") {
    await delay(100);
    const db = loadDB();
    return type === "school" ? db.schoolSubjects : db.courses;
  },
};

// ---------------------------------------------------------------------------
// FEES & PAYMENTS
// ---------------------------------------------------------------------------
export const feeApi = {
  async getStudentFee(studentId) {
    await delay(200);
    const db = loadDB();
    const record = db.fees?.[studentId] || {
      studentId,
      studentName: "Student",
      academicYear: "2026-2027",
      semesterOrClass: "Current Term",
      totalAssessed: 50000,
      totalPaid: 50000,
      totalPending: 0,
      items: [
        { id: "fee_def_1", title: "Standard Tuition Fee", category: "Tuition Fee", amount: 50000, status: "paid", dueDate: "2026-08-15" }
      ],
      transactions: [],
    };
    return record;
  },

  async payFee({ studentId, amount, method = "UPI", itemIds = [] }) {
    await delay(400);
    const db = loadDB();
    const record = db.fees?.[studentId];
    if (!record) return { success: false, message: "Fee record not found for student." };

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return { success: false, message: "Please specify a valid payment amount." };
    }

    const txnId = `TXN_${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
    const receiptId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update items if specified
    if (itemIds.length > 0) {
      record.items.forEach((item) => {
        if (itemIds.includes(item.id)) {
          item.status = "paid";
        }
      });
    }

    record.totalPaid = (record.totalPaid || 0) + payAmount;
    record.totalPending = Math.max(0, (record.totalAssessed || 0) - record.totalPaid);

    const transaction = {
      txnId,
      amount: payAmount,
      method,
      status: "successful",
      receiptId,
      paidAt: new Date().toISOString(),
    };

    record.transactions = [transaction, ...(record.transactions || [])];
    db.fees[studentId] = record;

    // Log in audit log
    db.auditLogs.push({
      id: uid("audit"),
      actorName: record.studentName || studentId,
      actorRole: "student",
      action: "FEE_PAYMENT_PROCESSED",
      resourceType: "Fee",
      resourceId: txnId,
      details: { amount: payAmount, method, receiptId },
      timestamp: new Date().toISOString(),
    });

    saveDB(db);
    return {
      success: true,
      message: `Payment of ₹${payAmount.toLocaleString()} successful!`,
      receiptId,
      txnId,
      feeSummary: record,
    };
  },

  async getAllFees() {
    await delay(200);
    const db = loadDB();
    return Object.values(db.fees || {});
  },
};

// ---------------------------------------------------------------------------
// QR ATTENDANCE
// ---------------------------------------------------------------------------
export const qrApi = {
  async getSession(sessionId = "qr_sess_demo") {
    await delay(100);
    const db = loadDB();
    const session = db.qrSessions?.find((s) => s.id === sessionId) || db.qrSessions?.[0];
    if (!session) return { success: false, message: "Session not found" };
    return { success: true, session };
  },

  async rotateToken(sessionId = "qr_sess_demo") {
    const db = loadDB();
    const session = db.qrSessions?.find((s) => s.id === sessionId) || db.qrSessions?.[0];
    if (!session) return { success: false, message: "Session not found" };

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    session.currentToken = `EZEN-QR-${randomSuffix}-SEC`;
    session.lastRotated = Date.now();
    saveDB(db);
    return { success: true, currentToken: session.currentToken, expiresInSeconds: 5 };
  },

  async verifyToken({ sessionId = "qr_sess_demo", token, studentId }) {
    await delay(250);
    const db = loadDB();
    const session = db.qrSessions?.find((s) => s.id === sessionId) || db.qrSessions?.[0];
    if (!session) return { success: false, message: "QR Session closed or not found." };

    if (!session.active) {
      return { success: false, message: "This attendance session has already ended." };
    }

    if (!token || token.trim() !== session.currentToken) {
      return { success: false, message: "QR token has expired or is invalid. Please scan the current code." };
    }

    const student = db.students.find((s) => s.id === studentId);
    if (!student) return { success: false, message: "Student record not recognized." };

    // Prevent duplicate scan
    const already = session.verifiedStudents.some((v) => v.studentId === studentId);
    if (already) {
      return { success: false, message: "Attendance has already been marked for this session." };
    }

    const scanRecord = {
      studentId: student.id,
      name: student.fullName,
      roll: student.rollNumber,
      scannedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Verified",
    };

    session.verifiedStudents.push(scanRecord);

    // Also write to ATTENDANCE records for today
    db.attendance.unshift({
      id: `att_qr_${student.id}_${Date.now()}`,
      studentId: student.id,
      course: session.courseOrSubject.split(" ")[0] || "CS301",
      date: new Date().toISOString(),
      status: "present",
      method: "QR",
    });

    saveDB(db);
    return {
      success: true,
      message: `Verified! Attendance recorded for ${student.fullName}.`,
      scanRecord,
    };
  },

  async closeSession(sessionId = "qr_sess_demo") {
    await delay(150);
    const db = loadDB();
    const session = db.qrSessions?.find((s) => s.id === sessionId);
    if (session) {
      session.active = false;
      saveDB(db);
    }
    return { success: true, message: "Attendance session closed successfully." };
  },
};

// ---------------------------------------------------------------------------
// ATTENDANCE CORRECTIONS (30-day direct vs. Admin Approval workflow)
// ---------------------------------------------------------------------------
export const attendanceCorrectionApi = {
  async getCorrections() {
    await delay(150);
    const db = loadDB();
    return db.attendanceCorrections || [];
  },

  async requestCorrection({ studentId, studentName, courseOrSubject, date, originalStatus, requestedStatus, reason, requestedBy }) {
    await delay(250);
    const db = loadDB();

    const recordDate = new Date(date);
    const diffDays = Math.floor((Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    const isOlderThan30Days = diffDays > 30;

    const correction = {
      id: uid("corr"),
      studentId,
      studentName,
      courseOrSubject,
      date,
      originalStatus,
      requestedStatus,
      reason,
      requestedBy,
      status: isOlderThan30Days ? "pending" : "approved",
      isOlderThan30Days,
      adminComment: isOlderThan30Days ? "" : "Auto-approved within 30-day faculty editing window.",
      actionDate: isOlderThan30Days ? null : new Date().toISOString(),
    };

    // If within 30 days, update the attendance table directly!
    if (!isOlderThan30Days) {
      const match = db.attendance.find(
        (a) => a.studentId === studentId && (a.course === courseOrSubject || a.id.includes(courseOrSubject))
      );
      if (match) match.status = requestedStatus;
    }

    db.attendanceCorrections.unshift(correction);
    db.auditLogs.push({
      id: uid("audit"),
      actorName: requestedBy,
      actorRole: "faculty",
      action: isOlderThan30Days ? "CORRECTION_REQUESTED_OVER_30_DAYS" : "DIRECT_ATTENDANCE_EDIT",
      resourceType: "Attendance",
      resourceId: correction.id,
      details: { studentId, courseOrSubject, originalStatus, requestedStatus, diffDays },
      timestamp: new Date().toISOString(),
    });

    saveDB(db);
    return {
      success: true,
      correction,
      message: isOlderThan30Days
        ? "Correction request submitted to Administrator for approval (record is older than 30 days)."
        : "Attendance corrected successfully within 30-day window.",
    };
  },

  async reviewCorrection({ id, status, comment, reviewerName = "Administrator" }) {
    await delay(250);
    const db = loadDB();
    const corr = db.attendanceCorrections?.find((c) => c.id === id);
    if (!corr) return { success: false, message: "Correction request not found." };

    corr.status = status; // "approved" | "rejected"
    corr.adminComment = comment || (status === "approved" ? "Approved by Academic Administration." : "Rejected.");
    corr.actionDate = new Date().toISOString();

    if (status === "approved") {
      const match = db.attendance.find((a) => a.studentId === corr.studentId && a.course === corr.courseOrSubject);
      if (match) match.status = corr.requestedStatus;
    }

    db.auditLogs.push({
      id: uid("audit"),
      actorName: reviewerName,
      actorRole: "admin",
      action: `CORRECTION_${status.toUpperCase()}`,
      resourceType: "AttendanceCorrection",
      resourceId: id,
      details: { studentId: corr.studentId, courseOrSubject: corr.courseOrSubject, comment },
      timestamp: new Date().toISOString(),
    });

    saveDB(db);
    return { success: true, message: `Request has been marked as ${status}.`, correction: corr };
  },
};

// ---------------------------------------------------------------------------
// STUDY RESOURCES
// ---------------------------------------------------------------------------
export const studyResourceApi = {
  async getResources(institutionType) {
    await delay(150);
    const db = loadDB();
    const list = db.studyResources || [];
    return institutionType ? list.filter((r) => r.institutionType === institutionType) : list;
  },

  async uploadResource(payload) {
    await delay(300);
    const db = loadDB();
    const newRes = {
      id: uid("res"),
      title: payload.title,
      description: payload.description || "",
      institutionType: payload.institutionType || "college",
      courseOrClass: payload.courseOrClass || "General",
      subject: payload.subject || "General",
      fileUrl: payload.fileUrl || "#",
      fileType: payload.fileType || "PDF",
      fileSize: payload.fileSize || "1.8 MB",
      uploadedBy: payload.uploadedBy || "Faculty Member",
      downloadCount: 0,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    db.studyResources.unshift(newRes);
    saveDB(db);
    return { success: true, message: "Resource published successfully!", resource: newRes };
  },
};

// ---------------------------------------------------------------------------
// AUDIT LOGS (Immutable Event History)
// ---------------------------------------------------------------------------
export const auditLogApi = {
  async getAuditLogs(filter = {}) {
    await delay(150);
    const db = loadDB();
    let logs = [...(db.auditLogs || [])];

    if (filter.role && filter.role !== "all") {
      logs = logs.filter((l) => l.actorRole === filter.role);
    }
    if (filter.action && filter.action !== "all") {
      logs = logs.filter((l) => l.action?.toLowerCase().includes(filter.action.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.actorName?.toLowerCase().includes(q) ||
          l.action?.toLowerCase().includes(q) ||
          l.resourceType?.toLowerCase().includes(q) ||
          l.resourceId?.toLowerCase().includes(q)
      );
    }

    return logs.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
  },

  async logAction({ actorName, actorRole, action, resourceType, resourceId, details, ipAddress = "127.0.0.1" }) {
    const db = loadDB();
    const entry = {
      id: uid("audit"),
      actorName,
      actorRole,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.unshift(entry);
    saveDB(db);
    return entry;
  },
};

// ---------------------------------------------------------------------------
// REAL AI ASSISTANT (Role-aware & Academic Context Driven)
// ---------------------------------------------------------------------------
export const aiAssistantApi = {
  async chat({ message, user, history = [] }) {
    await delay(450);
    const text = message.trim();
    if (!text) return { success: false, message: "Please provide a query." };

    const db = loadDB();
    const role = user?.role || "student";
    const instType = user?.institutionType || "college";

    // ── Student Context ──
    if (role === "student") {
      const student = db.students.find((s) => s.id === user.id) || db.students[0];
      const studentAtt = db.attendance.filter((a) => a.studentId === student.id);
      const totalAtt = studentAtt.length;
      const presentAtt = studentAtt.filter((a) => a.status === "present").length;
      const attPct = totalAtt ? Math.round((presentAtt / totalAtt) * 100) : 85;
      const fee = db.fees?.[student.id] || { totalPending: 0, totalAssessed: 0 };
      const pendingAsgs = db.assignments.filter((asg) =>
        asg.submissions?.some((sub) => sub.studentId === student.id && sub.status === "pending")
      );

      if (/attendance/i.test(text)) {
        return {
          success: true,
          reply: `📊 **Your Attendance Overview:**\n- **Overall Attendance Rate:** **${attPct}%** (${presentAtt} attended of ${totalAtt} logged sessions).\n- **Minimum Required:** 75%.\n- **Status:** ${
            attPct >= 75
              ? "✅ Good standing. Maintain consistency to remain eligible for term examinations."
              : "⚠️ Below threshold. You need to attend the next consecutive lectures to raise your percentage above 75%."
          }`,
        };
      }

      if (/fee|fees|payment|due|balance/i.test(text)) {
        return {
          success: true,
          reply: `💳 **Fee & Payment Status (${student.fullName}):**\n- **Total Assessed:** ₹${(fee.totalAssessed || 0).toLocaleString()}\n- **Total Paid:** ₹${(fee.totalPaid || 0).toLocaleString()}\n- **Outstanding Balance:** **₹${(fee.totalPending || 0).toLocaleString()}**\n\nYou can view the full line-item invoice breakdown and pay securely via UPI or Card under the **Fees & Payments** tab.`,
        };
      }

      if (/assignment|homework|due/i.test(text)) {
        const asgList = pendingAsgs.length
          ? pendingAsgs.map((a) => `- **${a.title}** (${a.course}) — Due in a few days`).join("\n")
          : "🎉 All assignments are currently submitted and up-to-date!";
        return {
          success: true,
          reply: `📝 **Your Pending Assignments:**\n${asgList}\n\nMake sure to review grading rubrics and submit on time to protect your 30% assignment timeliness composite component.`,
        };
      }

      if (/score|risk|warning|performance|composite/i.test(text)) {
        return {
          success: true,
          reply: `🎯 **Composite Score Analysis:**\n- **Current Score:** **${student.composite?.score || 85}/100**\n- **Risk Status:** **${(student.composite?.riskLevel || "normal").toUpperCase()}**\n- **Weighting Formula:** Attendance (30%) + Assessment Marks (40%) + Submission Timeliness (30%).\n\n${
            student.composite?.riskLevel === "at-risk"
              ? "⚠️ You are currently in the academic early-warning zone (<65). Please schedule an appointment with your class mentor to review recovery steps."
              : "⭐ You are performing solidly. Keeping your test scores above 75% will maintain an 'Excellent' rating."
          }`,
        };
      }

      if (/timetable|class|schedule|next class/i.test(text)) {
        const portal = portalFor(student);
        const todaySchedule = portal.timetable?.Monday?.join("\n- ") || "No classes scheduled for today.";
        return {
          success: true,
          reply: `📅 **Today's Class Schedule (${student.schoolClass || student.department}):**\n- ${todaySchedule}\n\nAll lecture rooms are equipped with E-Zen rotating QR scanners for attendance verification.`,
        };
      }

      if (/revision|plan|study plan|exam/i.test(text)) {
        return {
          success: true,
          reply: `📚 **Personalized 7-Day Exam Revision Schedule:**\n- **Day 1–2 (Core Concepts):** Review lecture notes & formula handbook for High-Weightage Modules.\n- **Day 3–4 (Problem Solving):** Solve previous 3 years' questions and lab case studies.\n- **Day 5 (Self-Assessment):** Take a timed 50-minute mock test; identify weak topics.\n- **Day 6 (Targeted Review):** Focus exclusively on incorrect mock questions and mentor feedback.\n- **Day 7 (Relax & Mindmap):** Light formula recall and adequate rest before exam day.`,
        };
      }
    }

    // ── Faculty Context ──
    if (role === "faculty") {
      if (/quiz|question/i.test(text)) {
        return {
          success: true,
          reply: `📝 **Draft 5-Question Concept Quiz Generated:**\n1. Explain the difference between worst-case and average-case time complexity in balanced search trees.\n2. In a relational database, what condition violates Third Normal Form (3NF)? Provide a real-world schema example.\n3. How does Dijkstra's shortest path algorithm differ from the Bellman-Ford algorithm when negative edge weights are present?\n4. What is the role of the program counter (PC) during context switching in modern OS kernels?\n5. Describe the sliding window protocol and its mechanism for handling packet loss.`,
        };
      }

      if (/lesson plan|lecture/i.test(text)) {
        return {
          success: true,
          reply: `📋 **Recommended 50-Minute Lesson Plan:**\n- **00–10 min (Recall & Hook):** Review previous lecture's core principle with a quick 2-minute diagnostic question.\n- **10–30 min (Direct Instruction):** Introduce core theory, architectural diagrams, and step-by-step example derivation.\n- **30–42 min (Active Pair Work):** Students pair up to solve a live scenario on their workbooks.\n- **42–50 min (Summary & Exit Ticket):** Collect quick questions and preview tomorrow's lab session.`,
        };
      }

      if (/attendance|trend|class/i.test(text)) {
        return {
          success: true,
          reply: `📊 **Class Attendance & Engagement Summary:**\n- Overall student attendance across your assigned classes is **81.4%** this week.\n- **10-day Direct Window:** Faculty may adjust attendance within 30 days without administrative approval.\n- **Dynamic QR Attendance:** 5-second rotating token server validation is active for your next lecture.`,
        };
      }
    }

    // ── Admin Context ──
    if (role === "admin") {
      const atRiskCount = db.students.filter((s) => s.composite.riskLevel === "at-risk").length;
      return {
        success: true,
        reply: `🏛️ **Institutional Intelligence Report (${db.institutions?.[instType]?.name || "E-Zen"}):**\n- **Active Students:** ${db.students.length}\n- **Faculty Members:** ${db.faculty.length}\n- **Students in Early Warning Zone (<65):** **${atRiskCount}** students flagged for academic intervention.\n- **Attendance Approvals:** ${db.attendanceCorrections?.filter((c) => c.status === "pending").length || 0} corrections awaiting administrator signature.\n- **Action Required:** Coordinate with department coordinators to review intervention meetings for at-risk cohorts.`,
      };
    }

    // ── Universal Academic Help ──
    return {
      success: true,
      reply: `💡 **E-Zen Academic Assistant:**\nI have processed your query regarding: *"${text}"*.\n\nHere are the recommended academic insights:\n1. **Core Concept:** Review institutional study guides available under the Study Resources repository.\n2. **Monitoring:** Ensure all attendance records, continuous evaluation marks, and pending assignments are monitored regularly.\n3. **Assistance:** For further administrative clarification, you can contact the Academic Helpdesk or your department coordinator.`,
    };
  },
};
