import React, { useState } from "react";
import { MdMenu, MdLightMode, MdDarkMode, MdNotificationsNone, MdLogout, MdPerson } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ROLE_LABEL = { student: "Student", faculty: "Faculty", parent: "Parent", admin: "Administrator" };

const Topbar = ({ onMenuClick, unreadCount = 0, notificationsTo }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-navy-900/80 backdrop-blur border-b border-slate-200 dark:border-white/5">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300">
          <MdMenu size={22} />
        </button>
        <div>
          <p className="text-xs text-slate-400">{ROLE_LABEL[user?.role]}</p>
          <p className="font-display font-semibold text-sm text-slate-800 dark:text-white leading-none">
            Welcome back, {user?.fullName?.split(" ")[0]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <MdLightMode size={19} /> : <MdDarkMode size={19} />}
        </button>

        {notificationsTo && (
          <button
            onClick={() => navigate(notificationsTo)}
            className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition"
            aria-label="Notifications"
          >
            <MdNotificationsNone size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral-400" />
            )}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-navy-950 font-bold text-sm"
          >
            {user?.fullName?.charAt(0) || "U"}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 card-surface p-1.5 text-sm">
              <button
                onClick={() => { setMenuOpen(false); navigate(`/${user.role}/settings`); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
              >
                <MdPerson size={17} /> Profile
              </button>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-coral-400"
              >
                <MdLogout size={17} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
