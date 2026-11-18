import React from "react";
import { Link } from "react-router-dom";

const AuthShell = ({ title, subtitle, children, footer, maxWidth = "max-w-lg" }) => (
  <div className="min-h-screen bg-[#06030C] bg-grid-glow flex items-center justify-center px-4 py-10 selection:bg-[#00E5FF]/30">
    <div className={`w-full ${maxWidth}`}>
      {/* Brand Header */}
      <Link to="/" className="flex flex-col items-center justify-center gap-1.5 mb-8 group">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-glow">
            <div className="w-full h-full bg-[#0D0819] rounded-[10px] flex items-center justify-center font-display font-black text-lg text-[#00E5FF]">
              EZ
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight text-white">E-Zen</span>
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          One Future. One Goal. A Million Dreams.
        </p>
      </Link>

      {/* Main Card */}
      <div className="card-surface p-6 sm:p-8 border border-white/15 shadow-card">
        {title && <h1 className="font-display text-2xl font-bold text-white mb-1">{title}</h1>}
        {subtitle && <p className="text-sm text-slate-400 mb-6">{subtitle}</p>}
        {children}
      </div>

      {footer && <div className="text-center text-sm text-slate-400 mt-5">{footer}</div>}
    </div>
  </div>
);

export default AuthShell;
