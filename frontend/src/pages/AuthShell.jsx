import React from "react";
import { Link } from "react-router-dom";

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-navy-950 dark:bg-grid-glow flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-md">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-display font-bold text-navy-950">S</div>
        <span className="font-display font-bold text-lg text-white">SPMS</span>
      </Link>
      <div className="card-surface !bg-navy-900 !border-white/10 p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mb-6">{subtitle}</p>}
        {children}
      </div>
      {footer && <p className="text-center text-sm text-slate-400 mt-5">{footer}</p>}
    </div>
  </div>
);

export default AuthShell;
