import React from "react";
import { Link } from "react-router-dom";
import { MdPhone, MdMailOutline, MdLocationOn, MdHelpCenter } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { INSTITUTIONS } from "../services/seedData";

const Footer = () => {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  // Pick institution details dynamically based on authenticated user context
  const instType = user?.institutionType || (user?.schoolClass ? "school" : "college");
  const institution =
    user?.institution ||
    (user ? INSTITUTIONS[instType] : null) || {
      name: "E-Zen Academic Platform",
      tagline: "One Future. One Goal. A Million Dreams.",
      address: "Institutional Tech Corridor, Knowledge Enclave, New Delhi 110001",
      phone: "+91 11 4000 8900",
      helpline: "1800-200-4567",
      email: "info@ezen.edu",
      supportEmail: "support@ezen.edu",
      principalOrDean: "Academic Board & Direction",
    };

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#06030C] text-slate-300">
      {/* Upper Footer: Institution Details & Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        {/* Brand & Tagline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow">
              <div className="w-full h-full bg-[#0D0819] rounded-[7px] flex items-center justify-center font-display font-black text-sm text-[#00E5FF]">
                EZ
              </div>
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-white">E-Zen</span>
          </div>
          <p className="font-semibold text-slate-200 text-sm">{institution.name}</p>
          <p className="text-slate-400 italic">"{institution.tagline || 'One Future. One Goal. A Million Dreams.'}"</p>
          <p className="text-[11px] text-[#00E5FF] font-medium">Head of Institution: {institution.principalOrDean}</p>
        </div>

        {/* Contact & Helpline */}
        <div className="space-y-2.5">
          <p className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3">Institutional Contact</p>
          <div className="flex items-start gap-2 text-slate-400">
            <MdLocationOn size={16} className="text-[#00E5FF] shrink-0 mt-0.5" />
            <span className="leading-snug">{institution.address}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MdPhone size={15} className="text-[#00E5FF] shrink-0" />
            <span>Helpline: <strong className="text-slate-200">{institution.helpline}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MdMailOutline size={15} className="text-[#C476BB] shrink-0" />
            <span>Support: {institution.supportEmail || institution.email}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3">Academic Navigation</p>
          <ul className="space-y-2 text-slate-400">
            <li><Link to="/student" className="hover:text-[#00E5FF] transition">Student Portal</Link></li>
            <li><Link to="/faculty" className="hover:text-[#00E5FF] transition">Faculty Portal</Link></li>
            <li><Link to="/admin" className="hover:text-[#00E5FF] transition">Administration Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-[#00E5FF] transition">6-Role Demo Selector</Link></li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <p className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3">Legal &amp; Privacy</p>
          <ul className="space-y-2 text-slate-400">
            <li><span className="hover:text-[#00E5FF] cursor-pointer">Privacy &amp; Data Protection Policy</span></li>
            <li><span className="hover:text-[#00E5FF] cursor-pointer">Institutional Terms &amp; Conditions</span></li>
            <li><span className="hover:text-[#00E5FF] cursor-pointer">Continuous Evaluation Guidelines</span></li>
            <li><span className="hover:text-[#00E5FF] cursor-pointer">Immutable Audit Log Governance</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-[#040208] py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {year} {institution.name} &middot; Powered by E-Zen Intelligent Academic Management.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Smart Academic Monitoring</span>
            <span>&middot;</span>
            <span className="text-[#00E5FF]">Obsidian &amp; Amethyst Design</span>
            <span>&middot;</span>
            <span className="text-emerald-400">Active v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
