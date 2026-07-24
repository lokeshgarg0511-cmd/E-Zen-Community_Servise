import React from "react";

const STYLES = {
  excellent: "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400",
  normal: "bg-amber-400/10 text-amber-500 dark:text-amber-400",
  "at-risk": "bg-coral-400/10 text-coral-400",
  submitted: "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400",
  present: "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400",
  late: "bg-amber-400/10 text-amber-500 dark:text-amber-400",
  pending: "bg-amber-400/10 text-amber-500 dark:text-amber-400",
  absent: "bg-coral-400/10 text-coral-400",
  missing: "bg-coral-400/10 text-coral-400",
};

const LABELS = {
  "at-risk": "At Risk",
};

const Badge = ({ status }) => (
  <span className={`badge ${STYLES[status] || "bg-slate-200 text-slate-600 dark:bg-white/5 dark:text-slate-300"}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {LABELS[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "—")}
  </span>
);

export default Badge;
