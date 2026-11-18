import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdMenu,
  MdNotificationsNone,
  MdLogout,
  MdPerson,
  MdSchool,
  MdVerified,
  MdSwapHoriz,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const ROLE_LABEL = {
  student: "Student",
  faculty: "Faculty",
  parent: "Parent",
  admin: "Administrator",
};

const Topbar = ({ onMenuClick, unreadCount = 0, notificationsTo }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const instType = user?.institutionType || (user?.schoolClass ? "school" : "college");
  const instName = user?.institution?.name || (instType === "school" ? "Delhi Public Model School" : "Apex Institute of Tech");

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 bg-[#06030C]/90 backdrop-blur-xl border-b border-white/10">
      {/* Left: Mobile hamburger & Institutional info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          <MdMenu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-[#8E4585]/20 border border-[#8E4585]/40 text-[#C476BB]">
            <MdSchool size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-xs sm:text-sm text-white">
                {instName}
              </span>
              <span className="badge-cyan text-[9px] uppercase px-1.5 py-0.2">
                {instType}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Welcome back, <strong className="text-slate-200">{user?.fullName?.split(" ")[0] || "User"}</strong>
              {user?.rollNumber ? ` (${user.rollNumber})` : user?.schoolClass ? ` • ${user.schoolClass}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Notifications, Role Switcher shortcut, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch Role shortcut */}
        <Link
          to="/login"
          title="Switch Demo Role"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#00E5FF]/40 text-xs text-slate-300 hover:text-white transition"
        >
          <MdSwapHoriz size={15} className="text-[#00E5FF]" />
          <span>Switch Role</span>
        </Link>

        {/* Notifications */}
        {notificationsTo && (
          <button
            onClick={() => navigate(notificationsTo)}
            className="relative p-2 rounded-xl text-slate-300 hover:bg-white/5 transition"
            aria-label="Notifications"
          >
            <MdNotificationsNone size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF] shadow-glow" />
            )}
          </button>
        )}

        {/* User avatar menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow"
          >
            <div className="w-full h-full bg-[#0D0819] rounded-full flex items-center justify-center text-white font-bold text-xs">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 card-surface p-2 shadow-card z-50 text-xs border border-white/15">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 capitalize">{ROLE_LABEL[user?.role] || user?.role}</p>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/${user.role}/settings`);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-200 transition"
              >
                <MdPerson size={16} /> Profile &amp; Settings
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-[#00E5FF] transition"
              >
                <MdSwapHoriz size={16} /> Switch Role (Demo)
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition"
              >
                <MdLogout size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
