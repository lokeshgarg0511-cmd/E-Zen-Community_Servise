import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBox from "./components/ChatBox";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterParent from "./pages/RegisterParent";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentMarks from "./pages/student/StudentMarks";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSettings from "./pages/student/StudentSettings";
import StudentCourses from "./pages/student/StudentCourses";
import StudentSyllabus from "./pages/student/StudentSyllabus";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentMentorMeetings from "./pages/student/StudentMentorMeetings";

import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyStudents from "./pages/faculty/FacultyStudents";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyMarks from "./pages/faculty/FacultyMarks";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import FacultyReports from "./pages/faculty/FacultyReports";
import FacultySettings from "./pages/faculty/FacultySettings";

import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentMarks from "./pages/parent/ParentMarks";
import ParentAssignments from "./pages/parent/ParentAssignments";
import ParentNotifications from "./pages/parent/ParentNotifications";
import ParentSettings from "./pages/parent/ParentSettings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/parent" element={<RegisterParent />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student/marks" element={<ProtectedRoute role="student"><StudentMarks /></ProtectedRoute>} />
        <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute role="student"><StudentNotifications /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute role="student"><StudentSettings /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>} />
        <Route path="/student/syllabus" element={<ProtectedRoute role="student"><StudentSyllabus /></ProtectedRoute>} />
        <Route path="/student/timetable" element={<ProtectedRoute role="student"><StudentTimetable /></ProtectedRoute>} />
        <Route path="/student/mentor-meetings" element={<ProtectedRoute role="student"><StudentMentorMeetings /></ProtectedRoute>} />

        {/* Faculty */}
        <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/students" element={<ProtectedRoute role="faculty"><FacultyStudents /></ProtectedRoute>} />
        <Route path="/faculty/attendance" element={<ProtectedRoute role="faculty"><FacultyAttendance /></ProtectedRoute>} />
        <Route path="/faculty/marks" element={<ProtectedRoute role="faculty"><FacultyMarks /></ProtectedRoute>} />
        <Route path="/faculty/assignments" element={<ProtectedRoute role="faculty"><FacultyAssignments /></ProtectedRoute>} />
        <Route path="/faculty/reports" element={<ProtectedRoute role="faculty"><FacultyReports /></ProtectedRoute>} />
        <Route path="/faculty/settings" element={<ProtectedRoute role="faculty"><FacultySettings /></ProtectedRoute>} />

        {/* Parent */}
        <Route path="/parent" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
        <Route path="/parent/attendance" element={<ProtectedRoute role="parent"><ParentAttendance /></ProtectedRoute>} />
        <Route path="/parent/marks" element={<ProtectedRoute role="parent"><ParentMarks /></ProtectedRoute>} />
        <Route path="/parent/assignments" element={<ProtectedRoute role="parent"><ParentAssignments /></ProtectedRoute>} />
        <Route path="/parent/notifications" element={<ProtectedRoute role="parent"><ParentNotifications /></ProtectedRoute>} />
        <Route path="/parent/settings" element={<ProtectedRoute role="parent"><ParentSettings /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute role="admin"><AdminFaculty /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute role="admin"><AdminDepartments /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {user && <ChatBox />}
    </>
  );
}

export default App;
