import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard, MdEventAvailable, MdOutlineAssignment, MdGrade,
  MdNotificationsNone, MdOutlineAnalytics, MdPeopleAlt, MdSchool,
  MdBusiness, MdMenuBook, MdSettings, MdClose, MdSchedule, MdGroups, MdFactCheck,
} from "react-icons/md";

const NAV = {
  student: [
    { to: "/student", label: "Dashboard", icon: MdSpaceDashboard },
    { to: "/student/attendance", label: "Attendance", icon: MdEventAvailable },
    { to: "/student/marks", label: "Marks", icon: MdGrade },
    { to: "/student/assignments", label: "Assignments", icon: MdOutlineAssignment },
    { to: "/student/courses", label: "My Courses", icon: MdMenuBook },
    { to: "/student/syllabus", label: "Syllabus", icon: MdMenuBook },
    { to: "/student/timetable", label: "Timetable", icon: MdSchedule },
    { to: "/student/mentor-meetings", label: "Mentor Meetings", icon: MdGroups },
    { to: "/student/notifications", label: "Notifications", icon: MdNotificationsNone },
    { to: "/student/settings", label: "Settings", icon: MdSettings },
  ],
  faculty: [
    { to: "/faculty", label: "Dashboard", icon: MdSpaceDashboard },
    { to: "/faculty/students", label: "Students", icon: MdPeopleAlt },
    { to: "/faculty/attendance", label: "Attendance", icon: MdEventAvailable },
    { to: "/faculty/marks", label: "Marks", icon: MdGrade },
    { to: "/faculty/assignments", label: "Assignments", icon: MdOutlineAssignment },
    { to: "/faculty/assessments", label: "Assessments", icon: MdFactCheck },
    { to: "/faculty/reports", label: "Reports", icon: MdOutlineAnalytics },
    { to: "/faculty/settings", label: "Settings", icon: MdSettings },
  ],
  parent: [
    { to: "/parent", label: "Dashboard", icon: MdSpaceDashboard },
    { to: "/parent/attendance", label: "Attendance", icon: MdEventAvailable },
    { to: "/parent/marks", label: "Marks", icon: MdGrade },
    { to: "/parent/assignments", label: "Assignments", icon: MdOutlineAssignment },
    { to: "/parent/notifications", label: "Alerts", icon: MdNotificationsNone },
    { to: "/parent/settings", label: "Settings", icon: MdSettings },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: MdSpaceDashboard },
    { to: "/admin/students", label: "Students", icon: MdSchool },
    { to: "/admin/faculty", label: "Faculty", icon: MdPeopleAlt },
    { to: "/admin/departments", label: "Departments", icon: MdBusiness },
    { to: "/admin/courses", label: "Courses", icon: MdMenuBook },
    { to: "/admin/reports", label: "Analytics", icon: MdOutlineAnalytics },
    { to: "/admin/settings", label: "Settings", icon: MdSettings },
  ],
};

const Sidebar = ({ role, open, onClose }) => {
  const items = NAV[role] || [];

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-40 bg-white dark:bg-navy-900
        border-r border-slate-200 dark:border-white/5 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-display font-bold text-navy-950 text-sm">S</div>
            <span className="font-display font-bold text-slate-900 dark:text-white">SPMS</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400">
            <MdClose size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${isActive
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"}`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-[11px] text-slate-400 border-t border-slate-200 dark:border-white/5">
          SPMS v1.0 &middot; Early Warning System
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
