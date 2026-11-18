// Seed data that mirrors the MongoDB collections described in the spec.
// Used by services/mockApi.js to power a fully working standalone demo
// (no live backend required) and to pre-populate a real backend via the
// provided seed script.

// ─── INSTITUTIONS ─────────────────────────────────────────────────────────────
export const INSTITUTIONS = {
  school: {
    id: "inst_school_01",
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
  college: {
    id: "inst_college_01",
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
};

// ─── SCHOOL CLASSES & SUBJECTS ────────────────────────────────────────────────
export const SCHOOL_CLASSES = [
  { id: "cls_10A", name: "Class 10-A", grade: 10, section: "A", classTeacher: "Sunita Verma", studentCount: 38 },
  { id: "cls_10B", name: "Class 10-B", grade: 10, section: "B", classTeacher: "Rajeshwari Nair", studentCount: 36 },
  { id: "cls_9A", name: "Class 9-A", grade: 9, section: "A", classTeacher: "Vikram Malhotra", studentCount: 40 },
  { id: "cls_9B", name: "Class 9-B", grade: 9, section: "B", classTeacher: "Anjali Gupta", studentCount: 35 },
];

export const SCHOOL_SUBJECTS = [
  { code: "MTH10", name: "Mathematics", grade: 10, teacher: "Sunita Verma" },
  { code: "SCI10", name: "Science & Lab", grade: 10, teacher: "Sunita Verma" },
  { code: "ENG10", name: "English Literature", grade: 10, teacher: "Rajeshwari Nair" },
  { code: "SST10", name: "Social Studies", grade: 10, teacher: "Rajeshwari Nair" },
  { code: "CSC10", name: "Computer Applications", grade: 10, teacher: "Amitabh Sen" },
];

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  { id: "CSE", name: "Computer Science & Engineering", hod: "Dr. Aravind Subramanian" },
  { id: "ECE", name: "Electronics & Communication Engg.", hod: "Dr. Priya Ramaswamy" },
  { id: "MECH", name: "Mechanical Engineering", hod: "Dr. Sanjay Iyer" },
  { id: "CIVIL", name: "Civil Engineering", hod: "Dr. Lakshmi Narayan" },
  { id: "IT", name: "Information Technology", hod: "Dr. Vivek Sharma" },
  { id: "MBA", name: "Master of Business Administration", hod: "Dr. Sunitha Reddy" },
];

// ─── COURSES ──────────────────────────────────────────────────────────────────
export const COURSES = [
  // ── CSE ──
  { code: "CS201", name: "Programming in C", department: "CSE", semester: 1, credits: 4 },
  { code: "CS202", name: "Discrete Mathematics", department: "CSE", semester: 2, credits: 3 },
  { code: "CS301", name: "Data Structures & Algorithms", department: "CSE", semester: 3, credits: 4 },
  { code: "CS302", name: "Database Management Systems", department: "CSE", semester: 3, credits: 4 },
  { code: "CS303", name: "Operating Systems", department: "CSE", semester: 4, credits: 3 },
  { code: "CS304", name: "Computer Networks", department: "CSE", semester: 4, credits: 3 },
  { code: "CS401", name: "Software Engineering", department: "CSE", semester: 5, credits: 4 },
  { code: "CS402", name: "Machine Learning", department: "CSE", semester: 6, credits: 4 },
  { code: "CS403", name: "Compiler Design", department: "CSE", semester: 6, credits: 3 },
  { code: "CS501", name: "Cloud Computing", department: "CSE", semester: 7, credits: 3 },
  { code: "CS502", name: "Cyber Security", department: "CSE", semester: 7, credits: 3 },

  // ── ECE ──
  { code: "EC201", name: "Electronic Devices & Circuits", department: "ECE", semester: 2, credits: 4 },
  { code: "EC301", name: "Digital Signal Processing", department: "ECE", semester: 3, credits: 3 },
  { code: "EC302", name: "Analog Communication", department: "ECE", semester: 4, credits: 3 },
  { code: "EC401", name: "VLSI Design", department: "ECE", semester: 5, credits: 4 },
  { code: "EC402", name: "Embedded Systems", department: "ECE", semester: 6, credits: 3 },
  { code: "EC403", name: "Wireless Communication", department: "ECE", semester: 7, credits: 3 },

  // ── MECH ──
  { code: "ME201", name: "Engineering Mechanics", department: "MECH", semester: 2, credits: 4 },
  { code: "ME301", name: "Thermodynamics", department: "MECH", semester: 3, credits: 4 },
  { code: "ME302", name: "Fluid Mechanics", department: "MECH", semester: 4, credits: 3 },
  { code: "ME401", name: "Machine Design", department: "MECH", semester: 5, credits: 4 },
  { code: "ME402", name: "Robotics & Automation", department: "MECH", semester: 6, credits: 3 },

  // ── CIVIL ──
  { code: "CV301", name: "Structural Analysis", department: "CIVIL", semester: 3, credits: 4 },
  { code: "CV302", name: "Geotechnical Engineering", department: "CIVIL", semester: 4, credits: 3 },
  { code: "CV401", name: "Transportation Engineering", department: "CIVIL", semester: 5, credits: 3 },

  // ── IT ──
  { code: "IT301", name: "Web Technologies", department: "IT", semester: 3, credits: 4 },
  { code: "IT302", name: "System Analysis & Design", department: "IT", semester: 4, credits: 3 },
  { code: "IT401", name: "Artificial Intelligence", department: "IT", semester: 5, credits: 4 },
  { code: "IT402", name: "Big Data Analytics", department: "IT", semester: 6, credits: 3 },

  // ── MBA ──
  { code: "MB101", name: "Management Principles", department: "MBA", semester: 1, credits: 4 },
  { code: "MB201", name: "Financial Management", department: "MBA", semester: 2, credits: 4 },
  { code: "MB301", name: "Marketing Management", department: "MBA", semester: 3, credits: 3 },
];

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
export const STUDENTS = [
  // ── School Students (DPMS - Class 10) ──
  { id: "stu_sch_01", fullName: "Aarav Sharma", rollNumber: "10A-04", email: "aarav.sharma@school.edu", mobile: "+91 9876543210", institutionType: "school", institutionId: "inst_school_01", schoolClass: "Class 10", section: "A", department: "High School", semester: 1, yearOfPassing: 2026, composite: { score: 87.5, riskLevel: "excellent" } },
  { id: "stu_sch_02", fullName: "Diya Sengupta", rollNumber: "10A-12", email: "diya.sengupta@school.edu", mobile: "+91 9876543211", institutionType: "school", institutionId: "inst_school_01", schoolClass: "Class 10", section: "A", department: "High School", semester: 1, yearOfPassing: 2026, composite: { score: 73.2, riskLevel: "normal" } },
  { id: "stu_sch_03", fullName: "Kabir Verma", rollNumber: "10A-18", email: "kabir.verma@school.edu", mobile: "+91 9876543212", institutionType: "school", institutionId: "inst_school_01", schoolClass: "Class 10", section: "A", department: "High School", semester: 1, yearOfPassing: 2026, composite: { score: 56.4, riskLevel: "at-risk" } },
  { id: "stu_sch_04", fullName: "Ananya Chawla", rollNumber: "10B-02", email: "ananya.chawla@school.edu", mobile: "+91 9876543213", institutionType: "school", institutionId: "inst_school_01", schoolClass: "Class 10", section: "B", department: "High School", semester: 1, yearOfPassing: 2026, composite: { score: 91.8, riskLevel: "excellent" } },

  // ── CSE – Sem 5 – Section A ──
  { id: "stu_001", fullName: "Akshaj Mehta", rollNumber: "CSE21B045", email: "akshaj.mehta@university.edu", mobile: "+91 9876543220", institutionType: "college", institutionId: "inst_college_01", department: "CSE", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 88.2, riskLevel: "excellent" } },
  { id: "stu_002", fullName: "Riya Kapoor", rollNumber: "CSE21B012", email: "riya.kapoor@university.edu", mobile: "+91 9876543223", institutionType: "college", institutionId: "inst_college_01", department: "CSE", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 71.4, riskLevel: "normal" } },
  { id: "stu_003", fullName: "Devansh Rao", rollNumber: "CSE21B078", email: "devansh.rao@university.edu", mobile: "+91 9876543224", institutionType: "college", institutionId: "inst_college_01", department: "CSE", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 58.6, riskLevel: "at-risk" } },

  // ── CSE – Sem 5 – Section B ──
  { id: "stu_006", fullName: "Kavya Nair", rollNumber: "CSE21B091", email: "kavya.nair@university.edu", department: "CSE", semester: 5, section: "B", yearOfPassing: 2025, composite: { score: 92.5, riskLevel: "excellent" } },
  { id: "stu_007", fullName: "Harish Iyer", rollNumber: "CSE21B056", email: "harish.iyer@university.edu", department: "CSE", semester: 5, section: "B", yearOfPassing: 2025, composite: { score: 67.3, riskLevel: "normal" } },
  { id: "stu_008", fullName: "Priya Sundaram", rollNumber: "CSE21B034", email: "priya.sundaram@university.edu", department: "CSE", semester: 5, section: "B", yearOfPassing: 2025, composite: { score: 55.8, riskLevel: "at-risk" } },

  // ── CSE – Sem 5 – Section C ──
  { id: "stu_009", fullName: "Vikram Nanda", rollNumber: "CSE21B067", email: "vikram.nanda@university.edu", department: "CSE", semester: 5, section: "C", yearOfPassing: 2025, composite: { score: 82.1, riskLevel: "excellent" } },
  { id: "stu_010", fullName: "Tanvi Desai", rollNumber: "CSE21B023", email: "tanvi.desai@university.edu", department: "CSE", semester: 5, section: "C", yearOfPassing: 2025, composite: { score: 74.6, riskLevel: "normal" } },

  // ── CSE – Sem 3 – Section A ──
  { id: "stu_011", fullName: "Rohan Sharma", rollNumber: "CSE23A011", email: "rohan.sharma@university.edu", department: "CSE", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 79.4, riskLevel: "normal" } },
  { id: "stu_012", fullName: "Anika Patel", rollNumber: "CSE23A029", email: "anika.patel@university.edu", department: "CSE", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 91.0, riskLevel: "excellent" } },
  { id: "stu_013", fullName: "Siddharth Menon", rollNumber: "CSE23A047", email: "siddharth.menon@university.edu", department: "CSE", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 56.2, riskLevel: "at-risk" } },

  // ── ECE – Sem 5 – Section A ──
  { id: "stu_004", fullName: "Sneha Pillai", rollNumber: "ECE21B019", email: "sneha.pillai@university.edu", department: "ECE", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 76.9, riskLevel: "normal" } },
  { id: "stu_014", fullName: "Aditya Krishnan", rollNumber: "ECE21B038", email: "aditya.krishnan@university.edu", department: "ECE", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 85.3, riskLevel: "excellent" } },
  { id: "stu_015", fullName: "Meghna Iyer", rollNumber: "ECE21B062", email: "meghna.iyer@university.edu", department: "ECE", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 60.7, riskLevel: "at-risk" } },

  // ── ECE – Sem 3 – Section A ──
  { id: "stu_016", fullName: "Kiran Reddy", rollNumber: "ECE23A014", email: "kiran.reddy@university.edu", department: "ECE", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 73.5, riskLevel: "normal" } },
  { id: "stu_017", fullName: "Pooja Nagarajan", rollNumber: "ECE23A028", email: "pooja.nagarajan@university.edu", department: "ECE", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 88.9, riskLevel: "excellent" } },

  // ── MECH – Sem 5 – Section A ──
  { id: "stu_005", fullName: "Arjun Verma", rollNumber: "MECH21B033", email: "arjun.verma@university.edu", department: "MECH", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 61.3, riskLevel: "at-risk" } },
  { id: "stu_018", fullName: "Rahul Gupta", rollNumber: "MECH21B051", email: "rahul.gupta@university.edu", department: "MECH", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 77.8, riskLevel: "normal" } },

  // ── MECH – Sem 3 – Section A ──
  { id: "stu_019", fullName: "Anjali Singh", rollNumber: "MECH23A007", email: "anjali.singh@university.edu", department: "MECH", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 83.6, riskLevel: "excellent" } },
  { id: "stu_020", fullName: "Dev Malhotra", rollNumber: "MECH23A022", email: "dev.malhotra@university.edu", department: "MECH", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 59.4, riskLevel: "at-risk" } },

  // ── CIVIL – Sem 5 – Section A ──
  { id: "stu_021", fullName: "Nandini Bose", rollNumber: "CIVIL21B018", email: "nandini.bose@university.edu", department: "CIVIL", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 80.2, riskLevel: "excellent" } },
  { id: "stu_022", fullName: "Suresh Rao", rollNumber: "CIVIL21B042", email: "suresh.rao@university.edu", department: "CIVIL", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 65.8, riskLevel: "normal" } },
  { id: "stu_023", fullName: "Geeta Mishra", rollNumber: "CIVIL21B061", email: "geeta.mishra@university.edu", department: "CIVIL", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 53.1, riskLevel: "at-risk" } },

  // ── IT – Sem 5 – Section A ──
  { id: "stu_024", fullName: "Farhan Ansari", rollNumber: "IT21B025", email: "farhan.ansari@university.edu", department: "IT", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 86.7, riskLevel: "excellent" } },
  { id: "stu_025", fullName: "Ishita Chakraborty", rollNumber: "IT21B039", email: "ishita.chakraborty@university.edu", department: "IT", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 70.2, riskLevel: "normal" } },
  { id: "stu_026", fullName: "Manish Kumar", rollNumber: "IT21B058", email: "manish.kumar@university.edu", department: "IT", semester: 5, section: "A", yearOfPassing: 2025, composite: { score: 57.9, riskLevel: "at-risk" } },

  // ── IT – Sem 3 – Section A ──
  { id: "stu_027", fullName: "Swati Joshi", rollNumber: "IT23A016", email: "swati.joshi@university.edu", department: "IT", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 78.4, riskLevel: "normal" } },
  { id: "stu_028", fullName: "Nikhil Tiwari", rollNumber: "IT23A031", email: "nikhil.tiwari@university.edu", department: "IT", semester: 3, section: "A", yearOfPassing: 2027, composite: { score: 93.1, riskLevel: "excellent" } },

  // ── MBA – Sem 1 ──
  { id: "stu_029", fullName: "Pallavi Sharma", rollNumber: "MBA24A002", email: "pallavi.sharma@university.edu", department: "MBA", semester: 1, section: "A", yearOfPassing: 2026, composite: { score: 81.5, riskLevel: "excellent" } },
  { id: "stu_030", fullName: "Rajendra Kulkarni", rollNumber: "MBA24A015", email: "rajendra.kulkarni@university.edu", department: "MBA", semester: 1, section: "A", yearOfPassing: 2026, composite: { score: 66.3, riskLevel: "normal" } },
];

// ─── FACULTY ──────────────────────────────────────────────────────────────────
export const FACULTY = [
  // ── School Faculty (DPMS) ──
  {
    id: "fac_sch_01", fullName: "Sunita Verma", employeeId: "SCH_FAC01", email: "sunita.verma@school.edu",
    mobile: "+91 9876543213", institutionType: "school", institutionId: "inst_school_01",
    designation: "Senior Mathematics & Science Teacher", subjects: ["Mathematics", "Science & Lab"],
    assignedClasses: ["Class 10-A", "Class 10-B"],
  },
  {
    id: "fac_sch_02", fullName: "Rajeshwari Nair", employeeId: "SCH_FAC02", email: "rajeshwari.nair@school.edu",
    mobile: "+91 9876543214", institutionType: "school", institutionId: "inst_school_01",
    designation: "English & Social Studies Faculty", subjects: ["English Literature", "Social Studies"],
    assignedClasses: ["Class 10-A", "Class 9-A"],
  },

  // ── College Faculty (AITM) ──
  {
    id: "fac_001", fullName: "Dr. Meera Krishnan", employeeId: "FAC1042", email: "meera.krishnan@university.edu",
    mobile: "+91 9876543221", institutionType: "college", institutionId: "inst_college_01",
    department: "CSE", designation: "Associate Professor & Class Mentor", subjects: ["CS301", "CS302", "CS401"],
  },
  {
    id: "fac_002", fullName: "Prof. Ravi Menon", employeeId: "FAC1078", email: "ravi.menon@university.edu",
    department: "CSE", designation: "Assistant Professor", subjects: ["CS303", "CS304", "CS501"],
  },
  {
    id: "fac_003", fullName: "Dr. Ananya Shah", employeeId: "FAC1031", email: "ananya.shah@university.edu",
    department: "CSE", designation: "Professor", subjects: ["CS402", "CS403", "CS502"],
  },
  {
    id: "fac_004", fullName: "Prof. Karthik Rao", employeeId: "FAC1055", email: "karthik.rao@university.edu",
    department: "ECE", designation: "Associate Professor", subjects: ["EC301", "EC302", "EC401"],
  },
  {
    id: "fac_005", fullName: "Dr. Supriya Nair", employeeId: "FAC1088", email: "supriya.nair@university.edu",
    department: "ECE", designation: "Assistant Professor", subjects: ["EC402", "EC403"],
  },
  {
    id: "fac_006", fullName: "Prof. Dinesh Patil", employeeId: "FAC1019", email: "dinesh.patil@university.edu",
    department: "MECH", designation: "Professor", subjects: ["ME201", "ME301", "ME302"],
  },
  {
    id: "fac_007", fullName: "Dr. Lalitha Venkatesh", employeeId: "FAC1067", email: "lalitha.venkatesh@university.edu",
    department: "CIVIL", designation: "Associate Professor", subjects: ["CV301", "CV302", "CV401"],
  },
  {
    id: "fac_008", fullName: "Prof. Amit Kapoor", employeeId: "FAC1094", email: "amit.kapoor@university.edu",
    department: "IT", designation: "Assistant Professor", subjects: ["IT301", "IT302", "IT401", "IT402"],
  },
];

// ─── PARENTS ──────────────────────────────────────────────────────────────────
export const PARENTS = [
  { id: "par_001", fullName: "Rajesh Mehta", email: "rajesh.mehta@gmail.com", mobileNumber: "+91 98200 11223", relationship: "Father", linkedStudentId: "stu_001" },
  { id: "par_002", fullName: "Sunita Kapoor", email: "sunita.kapoor@gmail.com", mobileNumber: "+91 90111 45678", relationship: "Mother", linkedStudentId: "stu_002" },
  { id: "par_003", fullName: "Prakash Rao", email: "prakash.rao@gmail.com", mobileNumber: "+91 91234 56789", relationship: "Father", linkedStudentId: "stu_003" },
  { id: "par_004", fullName: "Leela Pillai", email: "leela.pillai@gmail.com", mobileNumber: "+91 88765 43210", relationship: "Mother", linkedStudentId: "stu_004" },
  { id: "par_005", fullName: "Suresh Verma", email: "suresh.verma@gmail.com", mobileNumber: "+91 97543 21098", relationship: "Father", linkedStudentId: "stu_005" },
  { id: "par_006", fullName: "Radha Nair", email: "radha.nair@gmail.com", mobileNumber: "+91 99001 23456", relationship: "Mother", linkedStudentId: "stu_006" },
];

// ─── ADMINS ───────────────────────────────────────────────────────────────────
export const ADMINS = [
  {
    id: "adm_sch_01",
    fullName: "Dr. R. K. Ramanathan",
    email: "principal@school.edu",
    mobile: "+91 9876543215",
    role: "admin",
    institutionType: "school",
    institutionId: "inst_school_01",
    designation: "Principal & Academic Director",
  },
  {
    id: "adm_001",
    fullName: "Dr. Arvind Swaminathan",
    email: "admin@university.edu",
    mobile: "+91 9876543222",
    role: "admin",
    institutionType: "college",
    institutionId: "inst_college_01",
    designation: "Dean of Academic Affairs",
  },
];

// Demo password used for every seeded account in standalone mode.
export const DEMO_PASSWORD = "Demo@1234";

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
// Each student gets multi-course attendance for the past 45 days
const STUDENT_COURSES = {
  // ── School ──
  stu_sch_01: ["MTH10", "SCI10", "ENG10", "SST10", "CSC10"],
  stu_sch_02: ["MTH10", "SCI10", "ENG10", "SST10", "CSC10"],
  stu_sch_03: ["MTH10", "SCI10", "ENG10", "SST10", "CSC10"],
  stu_sch_04: ["MTH10", "SCI10", "ENG10", "SST10", "CSC10"],

  // ── College ──
  stu_001: ["CS301", "CS302", "CS401"], stu_002: ["CS301", "CS302", "CS401"],
  stu_003: ["CS301", "CS302", "CS401"], stu_006: ["CS303", "CS304", "CS401"],
  stu_007: ["CS303", "CS304", "CS401"], stu_008: ["CS303", "CS304", "CS401"],
  stu_009: ["CS401", "CS402", "CS403"], stu_010: ["CS401", "CS402", "CS403"],
  stu_011: ["CS301", "CS302"], stu_012: ["CS301", "CS302"],
  stu_013: ["CS301", "CS302"], stu_004: ["EC301", "EC302", "EC401"],
  stu_014: ["EC301", "EC302", "EC401"], stu_015: ["EC301", "EC302", "EC401"],
  stu_016: ["EC301", "EC201"], stu_017: ["EC301", "EC201"],
  stu_005: ["ME301", "ME302", "ME401"], stu_018: ["ME301", "ME302", "ME401"],
  stu_019: ["ME201", "ME301"], stu_020: ["ME201", "ME301"],
  stu_021: ["CV301", "CV302", "CV401"], stu_022: ["CV301", "CV302", "CV401"],
  stu_023: ["CV301", "CV302"], stu_024: ["IT301", "IT302", "IT401"],
  stu_025: ["IT301", "IT302", "IT401"], stu_026: ["IT301", "IT302"],
  stu_027: ["IT301", "IT302"], stu_028: ["IT301", "IT302"],
  stu_029: ["MB101"], stu_030: ["MB101"],
};

export const ATTENDANCE = (() => {
  const records = [];
  STUDENTS.forEach((s) => {
    const presentRatio = s.composite.riskLevel === "at-risk" ? 0.55 : s.composite.riskLevel === "normal" ? 0.78 : 0.92;
    const courses = STUDENT_COURSES[s.id] || ["CS301"];
    for (let i = 45; i >= 0; i--) {
      courses.forEach((course) => {
        const rnd = Math.random();
        records.push({
          id: `att_${s.id}_${course}_${i}`,
          studentId: s.id,
          course,
          date: daysAgo(i),
          status: rnd < presentRatio ? "present" : rnd < presentRatio + 0.12 ? "late" : "absent",
        });
      });
    }
  });
  return records;
})();

// ─── MARKS ────────────────────────────────────────────────────────────────────
export const MARKS = [
  // ── School: stu_sch_01 – Aarav Sharma (excellent) ──
  { id: "mk_sch_01", studentId: "stu_sch_01", course: "MTH10", examType: "Periodic Test 1", marksObtained: 46, totalMarks: 50 },
  { id: "mk_sch_02", studentId: "stu_sch_01", course: "SCI10", examType: "Periodic Test 1", marksObtained: 44, totalMarks: 50 },
  { id: "mk_sch_03", studentId: "stu_sch_01", course: "ENG10", examType: "Periodic Test 1", marksObtained: 42, totalMarks: 50 },
  { id: "mk_sch_04", studentId: "stu_sch_01", course: "SST10", examType: "Periodic Test 1", marksObtained: 45, totalMarks: 50 },
  { id: "mk_sch_05", studentId: "stu_sch_01", course: "CSC10", examType: "Practical Exam", marksObtained: 48, totalMarks: 50 },

  // ── School: stu_sch_03 – Kabir Verma (at-risk) ──
  { id: "mk_sch_06", studentId: "stu_sch_03", course: "MTH10", examType: "Periodic Test 1", marksObtained: 22, totalMarks: 50 },
  { id: "mk_sch_07", studentId: "stu_sch_03", course: "SCI10", examType: "Periodic Test 1", marksObtained: 24, totalMarks: 50 },

  // stu_001 – Akshaj (excellent)
  { id: "mk_001", studentId: "stu_001", course: "CS301", examType: "internal1", marksObtained: 44, totalMarks: 50 },
  { id: "mk_002", studentId: "stu_001", course: "CS301", examType: "internal2", marksObtained: 46, totalMarks: 50 },
  { id: "mk_003", studentId: "stu_001", course: "CS302", examType: "internal1", marksObtained: 42, totalMarks: 50 },
  { id: "mk_004", studentId: "stu_001", course: "CS302", examType: "internal2", marksObtained: 45, totalMarks: 50 },
  { id: "mk_005", studentId: "stu_001", course: "CS401", examType: "quiz", marksObtained: 18, totalMarks: 20 },
  { id: "mk_006", studentId: "stu_001", course: "CS401", examType: "assignment", marksObtained: 48, totalMarks: 50 },

  // stu_002 – Riya (normal)
  { id: "mk_007", studentId: "stu_002", course: "CS301", examType: "internal1", marksObtained: 33, totalMarks: 50 },
  { id: "mk_008", studentId: "stu_002", course: "CS301", examType: "internal2", marksObtained: 30, totalMarks: 50 },
  { id: "mk_009", studentId: "stu_002", course: "CS302", examType: "internal1", marksObtained: 36, totalMarks: 50 },
  { id: "mk_010", studentId: "stu_002", course: "CS302", examType: "internal2", marksObtained: 34, totalMarks: 50 },
  { id: "mk_011", studentId: "stu_002", course: "CS401", examType: "quiz", marksObtained: 14, totalMarks: 20 },

  // stu_003 – Devansh (at-risk)
  { id: "mk_012", studentId: "stu_003", course: "CS301", examType: "internal1", marksObtained: 21, totalMarks: 50 },
  { id: "mk_013", studentId: "stu_003", course: "CS301", examType: "internal2", marksObtained: 18, totalMarks: 50 },
  { id: "mk_014", studentId: "stu_003", course: "CS302", examType: "internal1", marksObtained: 24, totalMarks: 50 },
  { id: "mk_015", studentId: "stu_003", course: "CS302", examType: "internal2", marksObtained: 19, totalMarks: 50 },
  { id: "mk_016", studentId: "stu_003", course: "CS401", examType: "quiz", marksObtained: 8, totalMarks: 20 },

  // stu_004 – Sneha ECE (normal)
  { id: "mk_017", studentId: "stu_004", course: "EC301", examType: "internal1", marksObtained: 38, totalMarks: 50 },
  { id: "mk_018", studentId: "stu_004", course: "EC302", examType: "internal1", marksObtained: 36, totalMarks: 50 },
  { id: "mk_019", studentId: "stu_004", course: "EC401", examType: "internal1", marksObtained: 40, totalMarks: 50 },
  { id: "mk_020", studentId: "stu_004", course: "EC401", examType: "quiz", marksObtained: 16, totalMarks: 20 },

  // stu_005 – Arjun MECH (at-risk)
  { id: "mk_021", studentId: "stu_005", course: "ME301", examType: "internal1", marksObtained: 22, totalMarks: 50 },
  { id: "mk_022", studentId: "stu_005", course: "ME302", examType: "internal1", marksObtained: 20, totalMarks: 50 },
  { id: "mk_023", studentId: "stu_005", course: "ME401", examType: "assignment", marksObtained: 25, totalMarks: 50 },

  // stu_006 – Kavya CSE-B (excellent)
  { id: "mk_024", studentId: "stu_006", course: "CS303", examType: "internal1", marksObtained: 48, totalMarks: 50 },
  { id: "mk_025", studentId: "stu_006", course: "CS304", examType: "internal1", marksObtained: 46, totalMarks: 50 },
  { id: "mk_026", studentId: "stu_006", course: "CS401", examType: "internal2", marksObtained: 47, totalMarks: 50 },
  { id: "mk_027", studentId: "stu_006", course: "CS401", examType: "quiz", marksObtained: 19, totalMarks: 20 },

  // stu_007 – Harish CSE-B (normal)
  { id: "mk_028", studentId: "stu_007", course: "CS303", examType: "internal1", marksObtained: 34, totalMarks: 50 },
  { id: "mk_029", studentId: "stu_007", course: "CS304", examType: "internal1", marksObtained: 32, totalMarks: 50 },
  { id: "mk_030", studentId: "stu_007", course: "CS401", examType: "quiz", marksObtained: 13, totalMarks: 20 },

  // stu_008 – Priya CSE-B (at-risk)
  { id: "mk_031", studentId: "stu_008", course: "CS303", examType: "internal1", marksObtained: 20, totalMarks: 50 },
  { id: "mk_032", studentId: "stu_008", course: "CS304", examType: "internal1", marksObtained: 18, totalMarks: 50 },

  // stu_009 – Vikram CSE-C (excellent)
  { id: "mk_033", studentId: "stu_009", course: "CS401", examType: "internal1", marksObtained: 43, totalMarks: 50 },
  { id: "mk_034", studentId: "stu_009", course: "CS402", examType: "internal1", marksObtained: 41, totalMarks: 50 },
  { id: "mk_035", studentId: "stu_009", course: "CS403", examType: "quiz", marksObtained: 17, totalMarks: 20 },

  // stu_010 – Tanvi CSE-C (normal)
  { id: "mk_036", studentId: "stu_010", course: "CS401", examType: "internal1", marksObtained: 37, totalMarks: 50 },
  { id: "mk_037", studentId: "stu_010", course: "CS402", examType: "internal1", marksObtained: 35, totalMarks: 50 },

  // stu_011 – Rohan CSE-3A (normal)
  { id: "mk_038", studentId: "stu_011", course: "CS301", examType: "internal1", marksObtained: 39, totalMarks: 50 },
  { id: "mk_039", studentId: "stu_011", course: "CS302", examType: "internal1", marksObtained: 37, totalMarks: 50 },

  // stu_012 – Anika CSE-3A (excellent)
  { id: "mk_040", studentId: "stu_012", course: "CS301", examType: "internal1", marksObtained: 47, totalMarks: 50 },
  { id: "mk_041", studentId: "stu_012", course: "CS301", examType: "quiz", marksObtained: 19, totalMarks: 20 },
  { id: "mk_042", studentId: "stu_012", course: "CS302", examType: "internal1", marksObtained: 45, totalMarks: 50 },

  // stu_013 – Siddharth CSE-3A (at-risk)
  { id: "mk_043", studentId: "stu_013", course: "CS301", examType: "internal1", marksObtained: 22, totalMarks: 50 },
  { id: "mk_044", studentId: "stu_013", course: "CS302", examType: "internal1", marksObtained: 19, totalMarks: 50 },

  // stu_014 – Aditya ECE (excellent)
  { id: "mk_045", studentId: "stu_014", course: "EC301", examType: "internal1", marksObtained: 44, totalMarks: 50 },
  { id: "mk_046", studentId: "stu_014", course: "EC302", examType: "internal1", marksObtained: 42, totalMarks: 50 },
  { id: "mk_047", studentId: "stu_014", course: "EC401", examType: "internal1", marksObtained: 43, totalMarks: 50 },

  // stu_015 – Meghna ECE (at-risk)
  { id: "mk_048", studentId: "stu_015", course: "EC301", examType: "internal1", marksObtained: 23, totalMarks: 50 },
  { id: "mk_049", studentId: "stu_015", course: "EC302", examType: "internal1", marksObtained: 21, totalMarks: 50 },

  // stu_018 – Rahul MECH (normal)
  { id: "mk_050", studentId: "stu_018", course: "ME301", examType: "internal1", marksObtained: 38, totalMarks: 50 },
  { id: "mk_051", studentId: "stu_018", course: "ME302", examType: "internal1", marksObtained: 36, totalMarks: 50 },
  { id: "mk_052", studentId: "stu_018", course: "ME401", examType: "quiz", marksObtained: 15, totalMarks: 20 },

  // stu_021 – Nandini CIVIL (excellent)
  { id: "mk_053", studentId: "stu_021", course: "CV301", examType: "internal1", marksObtained: 42, totalMarks: 50 },
  { id: "mk_054", studentId: "stu_021", course: "CV302", examType: "internal1", marksObtained: 40, totalMarks: 50 },
  { id: "mk_055", studentId: "stu_021", course: "CV401", examType: "quiz", marksObtained: 17, totalMarks: 20 },

  // stu_022 – Suresh CIVIL (normal)
  { id: "mk_056", studentId: "stu_022", course: "CV301", examType: "internal1", marksObtained: 32, totalMarks: 50 },
  { id: "mk_057", studentId: "stu_022", course: "CV302", examType: "internal1", marksObtained: 34, totalMarks: 50 },

  // stu_023 – Geeta CIVIL (at-risk)
  { id: "mk_058", studentId: "stu_023", course: "CV301", examType: "internal1", marksObtained: 18, totalMarks: 50 },
  { id: "mk_059", studentId: "stu_023", course: "CV302", examType: "internal1", marksObtained: 15, totalMarks: 50 },

  // stu_024 – Farhan IT (excellent)
  { id: "mk_060", studentId: "stu_024", course: "IT301", examType: "internal1", marksObtained: 44, totalMarks: 50 },
  { id: "mk_061", studentId: "stu_024", course: "IT302", examType: "internal1", marksObtained: 43, totalMarks: 50 },
  { id: "mk_062", studentId: "stu_024", course: "IT401", examType: "internal1", marksObtained: 45, totalMarks: 50 },
  { id: "mk_063", studentId: "stu_024", course: "IT401", examType: "quiz", marksObtained: 18, totalMarks: 20 },

  // stu_025 – Ishita IT (normal)
  { id: "mk_064", studentId: "stu_025", course: "IT301", examType: "internal1", marksObtained: 35, totalMarks: 50 },
  { id: "mk_065", studentId: "stu_025", course: "IT302", examType: "internal1", marksObtained: 34, totalMarks: 50 },

  // stu_026 – Manish IT (at-risk)
  { id: "mk_066", studentId: "stu_026", course: "IT301", examType: "internal1", marksObtained: 22, totalMarks: 50 },
  { id: "mk_067", studentId: "stu_026", course: "IT302", examType: "internal1", marksObtained: 20, totalMarks: 50 },

  // stu_029 – Pallavi MBA (excellent)
  { id: "mk_068", studentId: "stu_029", course: "MB101", examType: "internal1", marksObtained: 41, totalMarks: 50 },
  { id: "mk_069", studentId: "stu_029", course: "MB101", examType: "quiz", marksObtained: 17, totalMarks: 20 },

  // stu_030 – Rajendra MBA (normal)
  { id: "mk_070", studentId: "stu_030", course: "MB101", examType: "internal1", marksObtained: 32, totalMarks: 50 },
];

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────
export const ASSIGNMENTS = [
  // ── School Assignments (DPMS Class 10) ──
  {
    id: "asg_sch_1", title: "Quadratic Equations Practice Set", course: "MTH10",
    className: "Class 10-A", semester: 1,
    description: "Solve problems 1 through 25 on quadratic formula and discriminant analysis from NCERT Chapter 4.",
    dueDate: daysAgo(-2),
    submissions: [
      { studentId: "stu_sch_01", status: "submitted", marks: 48, totalMarks: 50, gradedAt: daysAgo(0) },
      { studentId: "stu_sch_02", status: "submitted", marks: 38, totalMarks: 50, gradedAt: daysAgo(0) },
      { studentId: "stu_sch_03", status: "pending" },
    ],
  },
  {
    id: "asg_sch_2", title: "Chemical Reactions & Equations Lab Record", course: "SCI10",
    className: "Class 10-A", semester: 1,
    description: "Submit written observations of displacement reactions and redox titrations conducted in Science Lab.",
    dueDate: daysAgo(-4),
    submissions: [
      { studentId: "stu_sch_01", status: "submitted", marks: 45, totalMarks: 50, gradedAt: daysAgo(-1) },
      { studentId: "stu_sch_02", status: "late", marks: 32, totalMarks: 50, gradedAt: daysAgo(-1) },
      { studentId: "stu_sch_03", status: "missing" },
    ],
  },
  {
    id: "asg_1", title: "Binary Search Trees Implementation", course: "CS301",
    className: "CSE-A", semester: 5,
    description: "Implement a self-balancing BST with insert, delete and traversal operations.",
    dueDate: daysAgo(-3),
    submissions: [
      { studentId: "stu_001", status: "submitted", marks: 44, totalMarks: 50, gradedAt: daysAgo(-1) },
      { studentId: "stu_002", status: "submitted", marks: 32, totalMarks: 50, gradedAt: daysAgo(-1) },
      { studentId: "stu_003", status: "pending" },
      { studentId: "stu_011", status: "submitted", marks: 38, totalMarks: 50, gradedAt: daysAgo(-1) },
      { studentId: "stu_012", status: "submitted", marks: 48, totalMarks: 50, gradedAt: daysAgo(-1) },
      { studentId: "stu_013", status: "missing" },
    ],
  },
  {
    id: "asg_2", title: "Normalization Case Study", course: "CS302",
    className: "CSE-A", semester: 5,
    description: "Normalize the given university schema up to BCNF with justification.",
    dueDate: daysAgo(-7),
    submissions: [
      { studentId: "stu_001", status: "submitted", marks: 43, totalMarks: 50, gradedAt: daysAgo(-5) },
      { studentId: "stu_002", status: "late", marks: 30, totalMarks: 50, gradedAt: daysAgo(-5) },
      { studentId: "stu_003", status: "missing" },
      { studentId: "stu_011", status: "submitted" },
      { studentId: "stu_012", status: "submitted", marks: 47, totalMarks: 50, gradedAt: daysAgo(-5) },
    ],
  },
  {
    id: "asg_3", title: "OS Process Scheduling Simulator", course: "CS303",
    className: "CSE-B", semester: 5,
    description: "Simulate FCFS, SJF, Priority and Round-Robin scheduling algorithms in Python.",
    dueDate: daysAgo(-5),
    submissions: [
      { studentId: "stu_006", status: "submitted", marks: 48, totalMarks: 50, gradedAt: daysAgo(-3) },
      { studentId: "stu_007", status: "submitted", marks: 35, totalMarks: 50, gradedAt: daysAgo(-3) },
      { studentId: "stu_008", status: "pending" },
    ],
  },
  {
    id: "asg_4", title: "Computer Networks – Subnetting Lab", course: "CS304",
    className: "CSE-B", semester: 5,
    description: "Design and document IP subnetting for a given enterprise network topology.",
    dueDate: daysAgo(-2),
    submissions: [
      { studentId: "stu_006", status: "submitted", marks: 46, totalMarks: 50, gradedAt: daysAgo(0) },
      { studentId: "stu_007", status: "late" },
      { studentId: "stu_008", status: "missing" },
    ],
  },
  {
    id: "asg_5", title: "DSP Filter Design Report", course: "EC301",
    className: "ECE-A", semester: 5,
    description: "Design a low-pass FIR filter and analyze its frequency response using MATLAB.",
    dueDate: daysAgo(-4),
    submissions: [
      { studentId: "stu_004", status: "submitted", marks: 40, totalMarks: 50, gradedAt: daysAgo(-2) },
      { studentId: "stu_014", status: "submitted", marks: 45, totalMarks: 50, gradedAt: daysAgo(-2) },
      { studentId: "stu_015", status: "pending" },
    ],
  },
  {
    id: "asg_6", title: "Thermodynamics: Carnot Cycle Analysis", course: "ME301",
    className: "MECH-A", semester: 5,
    description: "Analyse the efficiency of a Carnot cycle for given temperature conditions.",
    dueDate: daysAgo(-6),
    submissions: [
      { studentId: "stu_005", status: "late", marks: 22, totalMarks: 50, gradedAt: daysAgo(-4) },
      { studentId: "stu_018", status: "submitted", marks: 38, totalMarks: 50, gradedAt: daysAgo(-4) },
    ],
  },
  {
    id: "asg_7", title: "Structural Analysis: Beam Bending", course: "CV301",
    className: "CIVIL-A", semester: 5,
    description: "Solve shear force and bending moment diagrams for statically determinate beams.",
    dueDate: daysAgo(-1),
    submissions: [
      { studentId: "stu_021", status: "submitted", marks: 43, totalMarks: 50, gradedAt: daysAgo(0) },
      { studentId: "stu_022", status: "submitted", marks: 34, totalMarks: 50, gradedAt: daysAgo(0) },
      { studentId: "stu_023", status: "missing" },
    ],
  },
  {
    id: "asg_8", title: "Web App – Student Portal (React)", course: "IT301",
    className: "IT-A", semester: 5,
    description: "Build a responsive student portal using React with routing and local state.",
    dueDate: daysAgo(-8),
    submissions: [
      { studentId: "stu_024", status: "submitted", marks: 47, totalMarks: 50, gradedAt: daysAgo(-6) },
      { studentId: "stu_025", status: "submitted", marks: 36, totalMarks: 50, gradedAt: daysAgo(-6) },
      { studentId: "stu_026", status: "late", marks: 25, totalMarks: 50, gradedAt: daysAgo(-6) },
    ],
  },
  {
    id: "asg_9", title: "Management Case Study: SWOT Analysis", course: "MB101",
    className: "MBA-A", semester: 1,
    description: "Perform a SWOT analysis on a Fortune 500 company of your choice.",
    dueDate: daysAgo(-10),
    submissions: [
      { studentId: "stu_029", status: "submitted", marks: 42, totalMarks: 50, gradedAt: daysAgo(-8) },
      { studentId: "stu_030", status: "submitted", marks: 33, totalMarks: 50, gradedAt: daysAgo(-8) },
    ],
  },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: "ntf_01", recipientId: "stu_003", title: "At-Risk Warning Issued", message: "Your composite score has dropped to 58.6. Please meet your faculty advisor immediately.", type: "at-risk", isRead: false, createdAt: daysAgo(1) },
  { id: "ntf_02", recipientId: "stu_003", title: "Missing Assignment", message: "Normalization Case Study (CS302) submission is missing. Submit before end of day.", type: "missing-assignment", isRead: false, createdAt: daysAgo(2) },
  { id: "ntf_03", recipientId: "par_001", title: "Attendance Update", message: "Akshaj's overall attendance is at 93% this month — excellent progress!", type: "general", isRead: true, createdAt: daysAgo(4) },
  { id: "ntf_04", recipientId: "stu_001", title: "Faculty Announcement", message: "Mid-semester exam timetable has been published on the notice board.", type: "announcement", isRead: false, createdAt: daysAgo(0) },
  { id: "ntf_05", recipientId: "stu_008", title: "At-Risk Warning Issued", message: "Your composite score is 55.8. Attendance and submissions need immediate improvement.", type: "at-risk", isRead: false, createdAt: daysAgo(1) },
  { id: "ntf_06", recipientId: "stu_013", title: "Missing Assignment", message: "Binary Search Trees (CS301) has not been submitted. This is a missing submission.", type: "missing-assignment", isRead: false, createdAt: daysAgo(1) },
  { id: "ntf_07", recipientId: "stu_015", title: "Low Attendance Warning", message: "Your attendance in EC302 has dropped below 70%. Please attend classes regularly.", type: "at-risk", isRead: false, createdAt: daysAgo(2) },
  { id: "ntf_08", recipientId: "par_004", title: "Student At-Risk", message: "Sneha's composite score has triggered a review. Please contact the faculty advisor.", type: "at-risk", isRead: false, createdAt: daysAgo(1) },
  { id: "ntf_09", recipientId: "stu_005", title: "At-Risk Warning Issued", message: "Composite score 61.3 — below threshold. Schedule a meeting with your mentor soon.", type: "at-risk", isRead: true, createdAt: daysAgo(3) },
  { id: "ntf_10", recipientId: "stu_023", title: "Missing Assignment Deadline", message: "Structural Analysis beam bending assignment is marked as missing.", type: "missing-assignment", isRead: false, createdAt: daysAgo(0) },
  { id: "ntf_11", recipientId: "stu_026", title: "Late Submission Recorded", message: "Your Web App React assignment was submitted late and will be penalised accordingly.", type: "general", isRead: true, createdAt: daysAgo(6) },
  { id: "ntf_12", recipientId: "stu_001", title: "Grade Released", message: "Your Binary Search Tree assignment grade: 44/50 (88%). Great work!", type: "announcement", isRead: false, createdAt: daysAgo(1) },
  { id: "ntf_13", recipientId: "stu_012", title: "Grade Released", message: "Your CS301 Internal 1 score: 47/50 — excellent performance!", type: "announcement", isRead: false, createdAt: daysAgo(0) },
  { id: "ntf_14", recipientId: "stu_020", title: "At-Risk Warning Issued", message: "Your composite score is 59.4. Immediate attention is required to improve performance.", type: "at-risk", isRead: false, createdAt: daysAgo(2) },
];

// ─── WARNING HISTORY ──────────────────────────────────────────────────────────
export const WARNING_HISTORY = {
  stu_001: [62, 68, 74, 79, 83, 88.2].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_002: [60, 63, 65, 69, 70, 71.4].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_003: [74, 70, 66, 62, 60, 58.6].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_004: [70, 71, 73, 75, 76, 76.9].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_005: [68, 66, 64, 63, 62, 61.3].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_006: [85, 87, 88, 90, 91, 92.5].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_007: [55, 58, 61, 64, 66, 67.3].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_008: [65, 62, 60, 57, 56, 55.8].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_009: [72, 74, 77, 79, 81, 82.1].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_010: [65, 67, 69, 71, 73, 74.6].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_011: [70, 72, 74, 76, 78, 79.4].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_012: [80, 83, 85, 87, 89, 91.0].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_013: [70, 66, 62, 59, 57, 56.2].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_014: [75, 77, 79, 81, 83, 85.3].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_015: [72, 69, 67, 63, 62, 60.7].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_016: [65, 67, 70, 71, 73, 73.5].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_017: [78, 80, 83, 85, 87, 88.9].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_018: [68, 70, 72, 74, 76, 77.8].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_019: [74, 76, 78, 81, 82, 83.6].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_020: [70, 67, 64, 61, 60, 59.4].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_021: [72, 74, 76, 78, 79, 80.2].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_022: [58, 60, 62, 64, 65, 65.8].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_023: [62, 59, 56, 54, 53, 53.1].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_024: [78, 80, 82, 84, 85, 86.7].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_025: [63, 65, 67, 68, 69, 70.2].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_026: [66, 63, 61, 59, 58, 57.9].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_027: [70, 71, 73, 75, 77, 78.4].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_028: [85, 87, 89, 91, 92, 93.1].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_029: [73, 75, 77, 79, 80, 81.5].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_030: [60, 61, 63, 64, 65, 66.3].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_sch_01: [80, 82, 84, 85, 87, 87.5].map((score, i) => ({ month: `M${i + 1}`, score })),
  stu_sch_03: [72, 68, 64, 61, 58, 56.4].map((score, i) => ({ month: `M${i + 1}`, score })),
};

// ─── FEES & TRANSACTIONS ──────────────────────────────────────────────────────
export const FEES_DATA = {
  stu_sch_01: {
    studentId: "stu_sch_01",
    studentName: "Aarav Sharma",
    institutionType: "school",
    academicYear: "2026-2027",
    semesterOrClass: "Class 10",
    totalAssessed: 45000,
    totalPaid: 35000,
    totalPending: 10000,
    items: [
      { id: "fee_s1", title: "Tuition Fee (Term 1)", category: "Tuition Fee", amount: 25000, status: "paid", dueDate: "2026-08-15" },
      { id: "fee_s2", title: "Science & Lab Charges", category: "Laboratory Fee", amount: 5000, status: "paid", dueDate: "2026-08-15" },
      { id: "fee_s3", title: "School Transport (Q1 & Q2)", category: "Transport Fees", amount: 5000, status: "paid", dueDate: "2026-09-01" },
      { id: "fee_s4", title: "Tuition Fee (Term 2)", category: "Tuition Fee", amount: 10000, status: "pending", dueDate: "2026-11-20" },
    ],
    transactions: [
      { txnId: "TXN_SCH_0921", amount: 35000, method: "UPI", status: "successful", receiptId: "REC-2026-0042", paidAt: "2026-08-12T10:30:00Z" },
    ],
  },
  stu_001: {
    studentId: "stu_001",
    studentName: "Akshaj Mehta",
    institutionType: "college",
    academicYear: "2026-2027",
    semesterOrClass: "Semester 5 (B.Tech CSE)",
    totalAssessed: 85000,
    totalPaid: 65000,
    totalPending: 20000,
    items: [
      { id: "fee_c1", title: "Semester Tuition Fee", category: "Semester Fees", amount: 50000, status: "paid", dueDate: "2026-08-10" },
      { id: "fee_c2", title: "Hostel & Maintenance Charges", category: "Hostel Fees", amount: 15000, status: "paid", dueDate: "2026-08-10" },
      { id: "fee_c3", title: "Library & Digital Access Fee", category: "Library Charges", amount: 2000, status: "paid", dueDate: "2026-08-10" },
      { id: "fee_c4", title: "Semester Examination Fee", category: "Other Authorized Charges", amount: 8000, status: "pending", dueDate: "2026-11-25" },
      { id: "fee_c5", title: "Transport/Campus Bus Access", category: "Transport Fees", amount: 10000, status: "pending", dueDate: "2026-12-05" },
    ],
    transactions: [
      { txnId: "TXN_COL_8831", amount: 65000, method: "Net Banking", status: "successful", receiptId: "REC-2026-0189", paidAt: "2026-08-08T14:15:00Z" },
    ],
  },
};

// ─── STUDY RESOURCES ──────────────────────────────────────────────────────────
export const STUDY_RESOURCES = [
  {
    id: "res_01",
    title: "Class 10 CBSE Mathematics Handbook & Formula Sheet",
    institutionType: "school",
    courseOrClass: "Class 10",
    subject: "Mathematics",
    description: "Complete chapter-wise formulas, theorems, and solved standard board exam patterns.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "Sunita Verma",
    downloadCount: 142,
    updatedAt: "2026-10-15",
  },
  {
    id: "res_02",
    title: "Class 10 Physics: Ray Optics & Electric Circuits Mindmaps",
    institutionType: "school",
    courseOrClass: "Class 10",
    subject: "Science & Lab",
    description: "Illustrated diagrams, ray diagrams, Ohm's law experiments, and numerical cheatsheets.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "3.1 MB",
    uploadedBy: "Sunita Verma",
    downloadCount: 98,
    updatedAt: "2026-10-20",
  },
  {
    id: "res_03",
    title: "CS301 Data Structures & Algorithms Complete Lecture Notes",
    institutionType: "college",
    courseOrClass: "CSE-Sem5",
    subject: "Data Structures & Algorithms",
    description: "B-Trees, AVL Trees, Graph Algorithms (Dijkstra, Bellman-Ford, Kruskal), Dynamic Programming.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "5.8 MB",
    uploadedBy: "Dr. Meera Krishnan",
    downloadCount: 265,
    updatedAt: "2026-10-10",
  },
  {
    id: "res_04",
    title: "CS302 DBMS Relational Algebra & SQL Cheatsheet",
    institutionType: "college",
    courseOrClass: "CSE-Sem5",
    subject: "Database Management Systems",
    description: "Normalization (1NF to BCNF) proofs, concurrency control, and index structures.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "1.9 MB",
    uploadedBy: "Prof. Ravi Menon",
    downloadCount: 194,
    updatedAt: "2026-10-18",
  },
];

// ─── ATTENDANCE CORRECTIONS ───────────────────────────────────────────────────
export const ATTENDANCE_CORRECTIONS = [
  {
    id: "corr_01",
    studentId: "stu_001",
    studentName: "Akshaj Mehta",
    courseOrSubject: "CS301",
    date: daysAgo(5),
    originalStatus: "absent",
    requestedStatus: "present",
    reason: "Attended Inter-College Smart India Hackathon finals with faculty permission letter.",
    requestedBy: "meera.krishnan@university.edu",
    status: "approved",
    isOlderThan30Days: false,
    actionDate: daysAgo(4),
  },
  {
    id: "corr_02",
    studentId: "stu_003",
    studentName: "Devansh Rao",
    courseOrSubject: "CS302",
    date: daysAgo(38),
    originalStatus: "absent",
    requestedStatus: "present",
    reason: "Medical leave for 3 days; hospital discharge summary submitted to academic dean.",
    requestedBy: "ravi.menon@university.edu",
    status: "pending",
    isOlderThan30Days: true,
    adminComment: "",
    actionDate: null,
  },
];

// ─── QR ATTENDANCE SESSIONS ───────────────────────────────────────────────────
export const QR_SESSIONS = [
  {
    id: "qr_sess_demo",
    courseOrSubject: "CS301 - Data Structures & Algorithms",
    classOrSection: "CSE-A (Sem 5)",
    facultyId: "fac_001",
    facultyName: "Dr. Meera Krishnan",
    currentToken: "EZEN-QR-9821-SEC",
    expiresInSeconds: 5,
    active: true,
    verifiedStudents: [
      { studentId: "stu_001", name: "Akshaj Mehta", roll: "CSE21B045", scannedAt: "10:04 AM", status: "Verified" },
      { studentId: "stu_002", name: "Riya Kapoor", roll: "CSE21B012", scannedAt: "10:05 AM", status: "Verified" },
    ],
  },
];

// ─── IMMUTABLE AUDIT LOGS ─────────────────────────────────────────────────────
export const AUDIT_LOGS = [
  {
    id: "audit_01",
    actorName: "Dr. Meera Krishnan",
    actorRole: "faculty",
    action: "DIRECT_ATTENDANCE_EDIT",
    resourceType: "Attendance",
    resourceId: "att_001",
    details: { studentId: "stu_001", studentName: "Akshaj Mehta", course: "CS301", originalStatus: "absent", requestedStatus: "present", diffDays: 4 },
    ipAddress: "192.168.1.45",
    timestamp: daysAgo(4),
  },
  {
    id: "audit_02",
    actorName: "Dr. Arvind Swaminathan",
    actorRole: "admin",
    action: "CORRECTION_APPROVED",
    resourceType: "AttendanceCorrection",
    resourceId: "corr_01",
    details: { studentId: "stu_001", courseOrSubject: "CS301", comment: "Verified medical certificate from campus clinic." },
    ipAddress: "192.168.1.10",
    timestamp: daysAgo(3),
  },
  {
    id: "audit_03",
    actorName: "Akshaj Mehta",
    actorRole: "student",
    action: "FEE_PAYMENT_PROCESSED",
    resourceType: "Fee",
    resourceId: "TXN_98721XA",
    details: { amount: 35000, method: "UPI", receiptId: "REC-2026-8912" },
    ipAddress: "172.56.21.90",
    timestamp: daysAgo(2),
  },
  {
    id: "audit_04",
    actorName: "Sunita Verma",
    actorRole: "faculty",
    action: "DIRECT_ATTENDANCE_EDIT",
    resourceType: "Attendance",
    resourceId: "att_sch_003",
    details: { studentId: "stu_sch_01", studentName: "Aarav Sharma", course: "Mathematics", originalStatus: "absent", requestedStatus: "present", diffDays: 2 },
    ipAddress: "192.168.1.88",
    timestamp: daysAgo(2),
  },
  {
    id: "audit_05",
    actorName: "Dr. R. K. Ramanathan",
    actorRole: "admin",
    action: "TERM_FEE_ASSESSED",
    resourceType: "Fee",
    resourceId: "FEE_ASSESS_TERM2",
    details: { class: "Class 10-A", totalStudents: 38, term: "Quarterly Tuition Q3" },
    ipAddress: "192.168.1.2",
    timestamp: daysAgo(1),
  },
  {
    id: "audit_06",
    actorName: "Dr. Meera Krishnan",
    actorRole: "faculty",
    action: "QR_SESSION_CREATED",
    resourceType: "QrSession",
    resourceId: "qr_sess_demo",
    details: { courseOrSubject: "CS301", tokenRotationInterval: "5s" },
    ipAddress: "192.168.1.45",
    timestamp: new Date().toISOString(),
  },
];

// ─── OFFICIAL DEMO USERS (6 ROLES + PARENT) ──────────────────────────────────
export const DEMO_USERS = {
  school_student: {
    email: "aarav.sharma@school.edu",
    role: "student",
    institutionType: "school",
    name: "Aarav Sharma",
    subtitle: "Class 10-A • Delhi Public Model School",
  },
  school_faculty: {
    email: "sunita.verma@school.edu",
    role: "faculty",
    institutionType: "school",
    name: "Sunita Verma",
    subtitle: "Senior Teacher • Delhi Public Model School",
  },
  school_admin: {
    email: "principal@school.edu",
    role: "admin",
    institutionType: "school",
    name: "Dr. R. K. Ramanathan",
    subtitle: "Principal • Delhi Public Model School",
  },
  college_student: {
    email: "akshaj.mehta@university.edu",
    role: "student",
    institutionType: "college",
    name: "Akshaj Mehta",
    subtitle: "B.Tech CSE (Sem 5) • Apex Institute of Tech",
  },
  college_faculty: {
    email: "meera.krishnan@university.edu",
    role: "faculty",
    institutionType: "college",
    name: "Dr. Meera Krishnan",
    subtitle: "Assoc. Professor CSE • Apex Institute of Tech",
  },
  college_admin: {
    email: "admin@university.edu",
    role: "admin",
    institutionType: "college",
    name: "Dr. Arvind Swaminathan",
    subtitle: "Dean of Academic Affairs • Apex Institute of Tech",
  },
  parent: {
    email: "rajesh.mehta@gmail.com",
    role: "parent",
    institutionType: "college",
    name: "Rajesh Mehta",
    subtitle: "Parent of Akshaj Mehta",
  },
};