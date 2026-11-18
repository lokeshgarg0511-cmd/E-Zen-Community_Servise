import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdEventAvailable,
  MdOutlineAssignment,
  MdGrade,
  MdNotificationsNone,
  MdOutlineAnalytics,
  MdPeopleAlt,
  MdSchool,
  MdBusiness,
  MdMenuBook,
  MdSettings,
  MdClose,
  MdSchedule,
  MdGroups,
  MdPayment,
  MdQrCodeScanner,
  MdAssignmentTurnedIn,
  MdFolderZip,
  MdHistory,
  MdClass,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || "student";
  const instType = user?.institutionType || (user?.schoolClass ? "school" : "college");

  // Build role & institution specific navigation items
  let items = [];

  if (role === "student") {
    if (instType === "school") {
      items = [
        { to: "/student", label: "Dashboard", icon: MdSpaceDashboard },
        { to: "/student/attendance", label: "Attendance", icon: MdEventAvailable },
        { to: "/student/marks", label: "Report Card & Marks", icon: MdGrade },
        { to: "/student/assignments", label: "Assignments", icon: MdOutlineAssignment },
        { to: "/student/resources", label: "Study Resources", icon: MdMenuBook },
        { to: "/student/timetable", label: "Timetable", icon: MdSchedule },
        { to: "/student/fees", label: "Fees & Payments", icon: MdPayment },
        { to: "/student/mentor-meetings", label: "Teacher Meetings", icon: MdGroups },
        { to: "/student/notifications", label: "Notifications", icon: MdNotificationsNone },
        { to: "/student/settings", label: "Settings", icon: MdSettings },
      ];
    } else {
      items = [
        { to: "/student", label: "Dashboard", icon: MdSpaceDashboard },
        { to: "/student/attendance", label: "Attendance", icon: MdEventAvailable },
        { to: "/student/marks", label: "Internal Marks", icon: MdGrade },
        { to: "/student/assignments", label: "Assignments", icon: MdOutlineAssignment },
        { to: "/student/courses", label: "My Courses", icon: MdClass },
        { to: "/student/resources", label: "Study Resources", icon: MdMenuBook },
        { to: "/student/timetable", label: "Timetable", icon: MdSchedule },
        { to: "/student/qr-scanner", label: "QR Attendance Scan", icon: MdQrCodeScanner },
        { to: "/student/fees", label: "Fees & Payments", icon: MdPayment },
        { to: "/student/mentor-meetings", label: "Mentor Meetings", icon: MdGroups },
        { to: "/student/notifications", label: "Notifications", icon: MdNotificationsNone },
        { to: "/student/settings", label: "Settings", icon: MdSettings },
      ];
    }
  } else if (role === "faculty") {
    if (instType === "school") {
      items = [
        { to: "/faculty", label: "Dashboard", icon: MdSpaceDashboard },
        { to: "/faculty/students", label: "Class Students", icon: MdPeopleAlt },
        { to: "/faculty/attendance", label: "Daily Attendance", icon: MdEventAvailable },
        { to: "/faculty/assignments", label: "Assignments", icon: MdOutlineAssignment },
        { to: "/faculty/marks", label: "Periodic Test Marks", icon: MdGrade },
        { to: "/faculty/meetings", label: "PTM & Meetings", icon: MdGroups },
        { to: "/faculty/resources", label: "Study Resources", icon: MdMenuBook },
        { to: "/faculty/reports", label: "Class Analytics", icon: MdOutlineAnalytics },
        { to: "/faculty/settings", label: "Settings", icon: MdSettings },
      ];
    } else {
      items = [
        { to: "/faculty", label: "Dashboard", icon: MdSpaceDashboard },
        { to: "/faculty/students", label: "Assigned Students", icon: MdPeopleAlt },
        { to: "/faculty/attendance", label: "Mark Attendance", icon: MdEventAvailable },
        { to: "/faculty/qr-session", label: "Dynamic QR Attendance", icon: MdQrCodeScanner },
        { to: "/faculty/corrections", label: "Attendance Correction", icon: MdAssignmentTurnedIn },
        { to: "/faculty/assignments", label: "Assignments", icon: MdOutlineAssignment },
        { to: "/faculty/marks", label: "Internal Marks", icon: MdGrade },
        { to: "/faculty/meetings", label: "Student Meetings", icon: MdGroups },
        { to: "/faculty/resources", label: "Study Resources", icon: MdMenuBook },
        { to: "/faculty/reports", label: "Course Reports", icon: MdOutlineAnalytics },
        { to: "/faculty/settings", label: "Settings", icon: MdSettings },
      ];
    }
  } else if (role === "admin") {
    if (instType === "school") {
      items = [
        { to: "/admin", label: "Dashboard", icon: MdSpaceDashboard },
        { to: "/admin/students", label: "Student Directory", icon: MdSchool },
        { to: "/admin/faculty", label: "Faculty Directory", icon: MdPeopleAlt },
        { to: "/admin/departments", label: "Classes & Sections", icon: MdBusiness },
        { to: "/admin/fees", label: "Fee Management", icon: MdPayment },
        { to: "/admin/reports", label: "Academic Reports", icon: MdOutlineAnalytics },
        { to: "/admin/audit-logs", label: "Audit Logs", icon: MdHistory },
        { to: "/admin/settings", label: "School Settings", icon: MdSettings },
      ];
    } else {
      items = [
        { to: "/admin", label: "Dashboard", icon: MdSpaceDashboard },
        { to: "/admin/students", label: "Student Directory", icon: MdSchool },
        { to: "/admin/faculty", label: "Faculty Directory", icon: MdPeopleAlt },
        { to: "/admin/departments", label: "Departments", icon: MdBusiness },
        { to: "/admin/courses", label: "Courses & Curricula", icon: MdMenuBook },
        { to: "/admin/corrections", label: "Attendance Approvals", icon: MdAssignmentTurnedIn },
        { to: "/admin/fees", label: "Fee Management", icon: MdPayment },
        { to: "/admin/reports", label: "Early Warning Analytics", icon: MdOutlineAnalytics },
        { to: "/admin/audit-logs", label: "Audit Logs", icon: MdHistory },
        { to: "/admin/settings", label: "Institutional Settings", icon: MdSettings },
      ];
    }
  } else if (role === "parent") {
    items = [
      { to: "/parent", label: "Dashboard", icon: MdSpaceDashboard },
      { to: "/parent/attendance", label: "Attendance", icon: MdEventAvailable },
      { to: "/parent/marks", label: "Marks & Progress", icon: MdGrade },
      { to: "/parent/assignments", label: "Assignments", icon: MdOutlineAssignment },
      { to: "/parent/mentor-meeting", label: "Mentor Meetings", icon: MdGroups },
      { to: "/parent/notifications", label: "Alerts & Warnings", icon: MdNotificationsNone },
      { to: "/parent/settings", label: "Settings", icon: MdSettings },
    ];
  }

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden" />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-40 bg-[#06030C] border-r border-white/10
        transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow">
              <div className="w-full h-full bg-[#0D0819] rounded-[7px] flex items-center justify-center font-display font-black text-sm text-[#00E5FF]">
                EZ
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-white text-base tracking-tight">E-Zen</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium capitalize">
                {instType} {role}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white" aria-label="Close sidebar">
            <MdClose size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === `/${role}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 shadow-glow"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-white/10 text-[11px] text-slate-400 bg-white/[0.01]">
          <p className="font-semibold text-slate-300 truncate">
            {user?.institution?.name || (instType === "school" ? "Delhi Public Model School" : "Apex Institute of Tech")}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">E-Zen Intelligent Academic Management</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
