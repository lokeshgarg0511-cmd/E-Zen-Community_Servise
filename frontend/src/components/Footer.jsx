import React from "react";
import { MdSchool } from "react-icons/md";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-white/5 bg-white dark:bg-navy-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shrink-0">
            <MdSchool size={14} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">SPMS</span>
          <span className="text-xs">·</span>
          <span className="text-xs">Student Performance Monitoring System</span>
        </div>

        {/* Center links */}
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span>Early Warning System</span>
          <span>·</span>
          <span>v1.0</span>
          <span>·</span>
          <span>Academic Portal</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {year} University Administration. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
