import React from "react";

const ACCENTS = {
  cyan: "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400",
  violet: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
  amber: "bg-amber-400/10 text-amber-500 dark:text-amber-400",
  coral: "bg-coral-400/10 text-coral-400",
};

const Card = ({ icon, label, value, sub, accent = "cyan" }) => (
  <div className="card-surface p-5 flex items-center gap-4">
    {icon && (
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${ACCENTS[accent]}`}>
        {icon}
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
      <p className="font-display text-2xl font-bold mt-0.5 text-slate-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default Card;
