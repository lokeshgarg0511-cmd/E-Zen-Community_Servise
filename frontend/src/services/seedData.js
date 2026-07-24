// Seed data that mirrors the MongoDB collections described in the spec.
// Used by services/mockApi.js to power a fully working standalone demo
// (no live backend required) and to pre-populate a real backend via the
// provided seed script.

export const DEPARTMENTS = [
  { id: "CSE", name: "Computer Science & Engineering", hod: "Dr. Aravind Subramanian" },
  { id: "ECE", name: "Electronics & Communication", hod: "Dr. Priya Ramaswamy" },
  { id: "MECH", name: "Mechanical Engineering", hod: "Dr. Sanjay Iyer" },
  { id: "CIVIL", name: "Civil Engineering", hod: "Dr. Lakshmi Narayan" },
];

export const COURSES = [
  { code: "CS301", name: "Data Structures & Algorithms", department: "CSE", semester: 3, credits: 4 },
  { code: "CS302", name: "Database Management Systems", department: "CSE", semester: 3, credits: 4 },
  { code: "CS303", name: "Operating Systems", department: "CSE", semester: 4, credits: 3 },
  { code: "EC301", name: "Digital Signal Processing", department: "ECE", semester: 3, credits: 3 },
  { code: "ME301", name: "Thermodynamics", department: "MECH", semester: 3, credits: 4 },
];

export const STUDENTS = [
  {
    id: "stu_001", fullName: "Akshaj Mehta", rollNumber: "CSE21B045", email: "akshaj.mehta@university.edu",
    department: "CSE", semester: 5, yearOfPassing: 2027, composite: { score: 88.2, riskLevel: "excellent" },
  },
  {
    id: "stu_002", fullName: "Riya Kapoor", rollNumber: "CSE21B012", email: "riya.kapoor@university.edu",
    department: "CSE", semester: 5, yearOfPassing: 2027, composite: { score: 71.4, riskLevel: "normal" },
  },
  {
    id: "stu_003", fullName: "Devansh Rao", rollNumber: "CSE21B078", email: "devansh.rao@university.edu",
    department: "CSE", semester: 5, yearOfPassing: 2027, composite: { score: 58.6, riskLevel: "at-risk" },
  },
  {
    id: "stu_004", fullName: "Sneha Pillai", rollNumber: "ECE21B019", email: "sneha.pillai@university.edu",
    department: "ECE", semester: 5, yearOfPassing: 2027, composite: { score: 76.9, riskLevel: "normal" },
  },
  {
    id: "stu_005", fullName: "Arjun Verma", rollNumber: "MECH21B033", email: "arjun.verma@university.edu",
    department: "MECH", semester: 5, yearOfPassing: 2027, composite: { score: 61.3, riskLevel: "at-risk" },
  },
  {
    id: "stu_006", fullName: "Kavya Nair", rollNumber: "CSE21B091", email: "kavya.nair@university.edu",
    department: "CSE", semester: 5, yearOfPassing: 2027, composite: { score: 92.5, riskLevel: "excellent" },
  },
];

export const FACULTY = [
  {
    id: "fac_001", fullName: "Dr. Meera Krishnan", employeeId: "FAC1042", email: "meera.krishnan@university.edu",
    department: "CSE", designation: "Associate Professor", subjects: ["CS301", "CS302"],
  },
];

export const PARENTS = [
  {
    id: "par_001", fullName: "Rajesh Mehta", email: "rajesh.mehta@gmail.com",
    mobileNumber: "+91 98200 11223", relationship: "Father", linkedStudentId: "stu_001",
  },
];

export const ADMINS = [
  { id: "adm_001", fullName: "System Administrator", email: "admin@university.edu" },
];

// Demo password used for every seeded account in standalone mode.
export const DEMO_PASSWORD = "Demo@1234";

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const ATTENDANCE = (() => {
  const records = [];
  STUDENTS.forEach((s) => {
    const presentRatio = s.composite.riskLevel === "at-risk" ? 0.58 : s.composite.riskLevel === "normal" ? 0.78 : 0.93;
    for (let i = 30; i >= 0; i--) {
      records.push({
        id: `att_${s.id}_${i}`,
        studentId: s.id,
        course: "CS301",
        date: daysAgo(i),
        status: Math.random() < presentRatio ? "present" : Math.random() < 0.4 ? "late" : "absent",
      });
    }
  });
  return records;
})();

export const MARKS = [
  { id: "mk_1", studentId: "stu_001", course: "CS301", examType: "internal1", marksObtained: 42, totalMarks: 50 },
  { id: "mk_2", studentId: "stu_001", course: "CS302", examType: "internal2", marksObtained: 45, totalMarks: 50 },
  { id: "mk_3", studentId: "stu_002", course: "CS301", examType: "internal1", marksObtained: 33, totalMarks: 50 },
  { id: "mk_4", studentId: "stu_002", course: "CS302", examType: "internal2", marksObtained: 36, totalMarks: 50 },
  { id: "mk_5", studentId: "stu_003", course: "CS301", examType: "internal1", marksObtained: 21, totalMarks: 50 },
  { id: "mk_6", studentId: "stu_003", course: "CS302", examType: "internal2", marksObtained: 24, totalMarks: 50 },
  { id: "mk_7", studentId: "stu_004", course: "EC301", examType: "internal1", marksObtained: 38, totalMarks: 50 },
  { id: "mk_8", studentId: "stu_005", course: "ME301", examType: "internal1", marksObtained: 22, totalMarks: 50 },
  { id: "mk_9", studentId: "stu_006", course: "CS301", examType: "internal1", marksObtained: 48, totalMarks: 50 },
];

export const ASSIGNMENTS = [
  {
    id: "asg_1", title: "Binary Search Trees Implementation", course: "CS301",
    description: "Implement a self-balancing BST with insert, delete and traversal operations.",
    dueDate: daysAgo(-3),
    submissions: [
      { studentId: "stu_001", status: "submitted" },
      { studentId: "stu_002", status: "submitted" },
      { studentId: "stu_003", status: "pending" },
      { studentId: "stu_006", status: "submitted" },
    ],
  },
  {
    id: "asg_2", title: "Normalization Case Study", course: "CS302",
    description: "Normalize the given university schema up to BCNF with justification.",
    dueDate: daysAgo(-7),
    submissions: [
      { studentId: "stu_001", status: "submitted" },
      { studentId: "stu_002", status: "late" },
      { studentId: "stu_003", status: "missing" },
    ],
  },
];

export const NOTIFICATIONS = [
  {
    id: "ntf_1", recipientId: "stu_003", title: "At-Risk Warning Issued",
    message: "Your composite score has dropped to 58.6. Please meet your faculty advisor.",
    type: "at-risk", isRead: false, createdAt: daysAgo(1),
  },
  {
    id: "ntf_2", recipientId: "stu_003", title: "Missing Assignment",
    message: "Normalization Case Study (CS302) submission is missing.",
    type: "missing-assignment", isRead: false, createdAt: daysAgo(2),
  },
  {
    id: "ntf_3", recipientId: "par_001", title: "Attendance Update",
    message: "Akshaj's attendance for CS301 is at 93% this month - excellent progress.",
    type: "general", isRead: true, createdAt: daysAgo(4),
  },
  {
    id: "ntf_4", recipientId: "stu_001", title: "Faculty Announcement",
    message: "Mid-semester exam timetable has been published on the notice board.",
    type: "announcement", isRead: false, createdAt: daysAgo(0),
  },
];

export const WARNING_HISTORY = {
  stu_001: [62, 68, 74, 79, 83, 88.2].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_002: [60, 63, 65, 69, 70, 71.4].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_003: [74, 70, 66, 62, 60, 58.6].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_004: [70, 71, 73, 75, 76, 76.9].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_005: [68, 66, 64, 63, 62, 61.3].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_006: [85, 87, 88, 90, 91, 92.5].map((score, i) => ({ month: `M${i + 1}`, score })),
};
