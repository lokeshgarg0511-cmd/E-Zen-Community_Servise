import React from "react";

const RISK_COLORS = {
  excellent: { ring: "#22d3ee", glow: "rgba(34,211,238,0.35)", label: "Excellent" },
  normal: { ring: "#fbbf24", glow: "rgba(251,191,36,0.30)", label: "Normal" },
  "at-risk": { ring: "#fb7185", glow: "rgba(251,113,133,0.35)", label: "At Risk" },
};

/**
 * Renders the composite early-warning score as three concentric arcs -
 * attendance (30%), assessment marks (40%), submission timeliness (30%) -
 * so the formula itself is visible, not just the final number.
 */
const RiskGauge = ({ score = 0, riskLevel = "normal", attendancePct = 0, marksPct = 0, submissionPct = 0, size = 132 }) => {
  const colors = RISK_COLORS[riskLevel] || RISK_COLORS.normal;
  const r1 = size / 2 - 6;
  const r2 = r1 - 12;
  const r3 = r2 - 12;
  const circumference = (r) => 2 * Math.PI * r;
  const arc = (r, pct) => {
    const c = circumference(r);
    return { strokeDasharray: `${(pct / 100) * c} ${c}` };
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r1} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="8" />
          <circle cx={size / 2} cy={size / 2} r={r1} fill="none" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" style={arc(r1, attendancePct)} />
          <circle cx={size / 2} cy={size / 2} r={r2} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="8" />
          <circle cx={size / 2} cy={size / 2} r={r2} fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" style={arc(r2, marksPct)} />
          <circle cx={size / 2} cy={size / 2} r={r3} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="8" />
          <circle cx={size / 2} cy={size / 2} r={r3} fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" style={arc(r3, submissionPct)} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold" style={{ color: colors.ring }}>{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">{colors.label}</span>
        </div>
      </div>
      <div className="flex gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Attendance</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />Marks</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Submissions</span>
      </div>
    </div>
  );
};

export default RiskGauge;
