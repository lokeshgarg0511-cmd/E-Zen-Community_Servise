import React from "react";
import { Link } from "react-router-dom";
import { MdHelpOutline, MdLogin, MdSchool } from "react-icons/md";

const HomeFooter = ({ onGetStarted }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#04020A] text-slate-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 lg:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-xs">
        {/* Brand & Tagline */}
        <div className="space-y-3.5">
          <a href="#home" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow">
              <div className="w-full h-full bg-[#0D0819] rounded-[9px] flex items-center justify-center font-display font-black text-sm text-[#00E5FF]">
                EZ
              </div>
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-[#00E5FF] transition">
              E-Zen
            </span>
          </a>
          <p className="text-slate-200 font-medium leading-relaxed">
            &ldquo;One Future. One Goal. A Million Dreams.&rdquo;
          </p>
          <p className="text-slate-400 leading-relaxed">
            Integrated academic management and intelligent learning support for schools and colleges.
          </p>
        </div>

        {/* Platform Navigation */}
        <div>
          <p className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3.5">
            Explore Platform
          </p>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <a href="#home" className="hover:text-[#00E5FF] transition">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#00E5FF] transition">
                About E-Zen
              </a>
            </li>
            <li>
              <a href="#platform-overview" className="hover:text-[#00E5FF] transition">
                Connected Ecosystem
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-[#00E5FF] transition">
                Key Features
              </a>
            </li>
            <li>
              <a href="#institutions" className="hover:text-[#00E5FF] transition">
                Schools &amp; Colleges
              </a>
            </li>
            <li>
              <a href="#why-ezen" className="hover:text-[#00E5FF] transition">
                Why Choose E-Zen
              </a>
            </li>
          </ul>
        </div>

        {/* Portal Access */}
        <div>
          <p className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3.5">
            Portal Access
          </p>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <Link to="/login" className="inline-flex items-center gap-1.5 hover:text-[#00E5FF] transition">
                <MdLogin size={14} aria-hidden="true" />
                <span>Sign In</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-1.5 hover:text-[#00E5FF] transition text-left"
              >
                <MdSchool size={14} aria-hidden="true" />
                <span>Get Started (Role Selector)</span>
              </button>
            </li>
            <li>
              <Link to="/register/student" className="hover:text-[#00E5FF] transition">
                Student Registration
              </Link>
            </li>
            <li>
              <Link to="/register/parent" className="hover:text-[#00E5FF] transition">
                Parent Registration
              </Link>
            </li>
            <li>
              <Link to="/forgot-password" className="hover:text-[#00E5FF] transition">
                Forgot Password
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Institutional Info */}
        <div className="space-y-3">
          <p className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3.5">
            Help &amp; Support
          </p>
          <a
            href="#support"
            className="inline-flex items-center gap-2 text-[#00E5FF] font-semibold hover:underline"
          >
            <MdHelpOutline size={16} aria-hidden="true" />
            <span>Visit Help &amp; Support</span>
          </a>
          <p className="text-slate-400 leading-relaxed">
            Direct public support ticketing is not configured in this environment. Institutional contact channels are
            available inside your institution&rsquo;s authenticated portal once configured.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-[#030107] py-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-slate-500 text-center sm:text-left">
          <p>&copy; {year} E-Zen. All rights reserved.</p>
          <p className="text-slate-400">One Future. One Goal. A Million Dreams.</p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
