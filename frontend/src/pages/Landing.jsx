import React from "react";
import { Link } from "react-router-dom";
import { MdEventAvailable, MdGrade, MdOutlineAssignment, MdWarningAmber, MdArrowForward } from "react-icons/md";
import RiskGauge from "../components/RiskGauge";

const Landing = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 dark:bg-grid-glow overflow-hidden">
      <header className="flex items-center justify-between px-6 sm:px-10 h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-display font-bold text-navy-950">S</div>
          <span className="font-display font-bold text-lg">SPMS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary !border-white/15 !text-slate-200">Sign in</Link>
          <Link to="/register/student" className="btn-primary">Get started</Link>
        </div>
      </header>

      <section className="px-6 sm:px-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center pt-10 pb-24">
        <div>
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">Early Warning, Not Late Regret</p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-[1.1] mb-6">
            Catch academic risk <span className="text-cyan-400">weeks</span>, not weeks-after.
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mb-8">
            SPMS combines attendance, internal marks, and assignment timeliness into one composite score,
            so students, parents, faculty and admins see risk before it becomes a transcript.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register/student" className="btn-primary">
              Register as student <MdArrowForward />
            </Link>
            <Link to="/register/parent" className="btn-secondary !border-white/15 !text-slate-200">Register as parent</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { icon: MdEventAvailable, label: "Attendance", weight: "30%" },
              { icon: MdGrade, label: "Assessments", weight: "40%" },
              { icon: MdOutlineAssignment, label: "Submissions", weight: "30%" },
              { icon: MdWarningAmber, label: "Risk threshold", weight: "<65" },
            ].map(({ icon: Icon, label, weight }) => (
              <div key={label} className="card-surface !bg-white/[0.03] !border-white/10 p-4">
                <Icon className="text-cyan-400 mb-2" size={20} />
                <p className="font-display font-bold text-lg">{weight}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="card-surface !bg-white/[0.03] !border-white/10 p-8 flex flex-col items-center gap-5">
            <p className="text-sm text-slate-400">Live composite score preview</p>
            <RiskGauge score={58.6} riskLevel="at-risk" attendancePct={62} marksPct={48} submissionPct={67} size={170} />
            <p className="text-xs text-slate-500 text-center max-w-xs">
              This student crossed the at-risk threshold - SPMS already notified their faculty advisor and parent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
