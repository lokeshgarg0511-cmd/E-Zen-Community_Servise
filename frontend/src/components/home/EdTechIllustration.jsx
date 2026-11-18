import React, { useId } from "react";
import {
  MdAutoAwesome,
  MdCalendarMonth,
  MdCheckCircleOutline,
  MdMenuBook,
  MdOutlineAssignment,
  MdPause,
  MdPlayArrow,
  MdSchool,
  MdTrendingUp,
} from "react-icons/md";

const CALENDAR_STATES = [
  "present", "present", "present", "present", "event",
  "present", "present", "present", "present", "present",
  "present", "event", "present", "present", "upcoming",
];

/**
 * Custom futuristic Books & Graduation Cap vector illustration
 * rendered in Official E-Zen Royal Amethyst (#8E4585) and Electric Cyan (#00E5FF).
 */
const BooksAndCapArt = ({ gradIdPrefix }) => (
  <svg
    viewBox="0 0 160 120"
    className="w-28 h-20 sm:w-32 sm:h-24 shrink-0 drop-shadow-[0_0_18px_rgba(0,229,255,0.28)]"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`${gradIdPrefix}-cap`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#8E4585" />
      </linearGradient>
      <linearGradient id={`${gradIdPrefix}-book1`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8E4585" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#C476BB" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`${gradIdPrefix}-book2`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00B8CC" stopOpacity="0.4" />
      </linearGradient>
    </defs>

    {/* Ambient halo */}
    <ellipse cx="80" cy="98" rx="56" ry="10" fill="#00E5FF" opacity="0.12" />

    {/* Bottom Book */}
    <rect x="28" y="80" width="104" height="18" rx="5" fill="#130D24" stroke="#8E4585" strokeWidth="1.5" />
    <rect x="34" y="84" width="66" height="4" rx="2" fill={`url(#${gradIdPrefix}-book1)`} />
    <line x1="108" y1="84" x2="124" y2="84" stroke="#C476BB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

    {/* Top Book */}
    <rect x="36" y="60" width="90" height="18" rx="5" fill="#1A1132" stroke="#00E5FF" strokeWidth="1.5" />
    <rect x="42" y="64" width="54" height="4" rx="2" fill={`url(#${gradIdPrefix}-book2)`} />
    <circle cx="114" cy="69" r="2.5" fill="#00E5FF" />

    {/* Graduation Cap Mortarboard */}
    <path
      d="M80 14 L132 34 L80 54 L28 34 Z"
      fill="#160E2B"
      stroke={`url(#${gradIdPrefix}-cap)`}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M52 43 V56 C52 60 64 63 80 63 C96 63 108 60 108 56 V43"
      fill="#100921"
      stroke="#8E4585"
      strokeWidth="1.5"
    />
    {/* Cap center button & tassel */}
    <circle cx="80" cy="34" r="3.5" fill="#00E5FF" />
    <path d="M80 34 L120 42 V58" fill="none" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="120" cy="60" r="3" fill="#C476BB" />
  </svg>
);

const AttendanceCalendarCard = ({ className = "" }) => (
  <div className={`ezen-glass rounded-2xl border border-[#00E5FF]/30 p-4 ${className}`}>
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/35 flex items-center justify-center text-[#00E5FF]">
          <MdCalendarMonth size={16} aria-hidden="true" />
        </span>
        <span className="font-display font-semibold text-xs text-white">Attendance Calendar</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-glow" aria-hidden="true" />
    </div>

    <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
      {CALENDAR_STATES.map((state, idx) => (
        <div
          key={idx}
          className={`h-5 rounded-md border flex items-center justify-center ${state === "present"
              ? "bg-[#00E5FF]/15 border-[#00E5FF]/35"
              : state === "event"
                ? "bg-[#8E4585]/25 border-[#C476BB]/45"
                : "bg-white/[0.03] border-white/10"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${state === "present"
                ? "bg-[#00E5FF]"
                : state === "event"
                  ? "bg-[#C476BB]"
                  : "bg-slate-600"
              }`}
          />
        </div>
      ))}
    </div>

    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" aria-hidden="true" /> Present
      </span>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C476BB]" aria-hidden="true" /> Academic Event
      </span>
    </div>
  </div>
);

const PerformanceGraphCard = ({ gradIdPrefix, className = "" }) => (
  <div className={`ezen-glass rounded-2xl border border-[#8E4585]/45 p-4 ${className}`}>
    <div className="flex items-center justify-between gap-2 mb-2.5">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-[#8E4585]/25 border border-[#8E4585]/50 flex items-center justify-center text-[#C476BB]">
          <MdTrendingUp size={16} aria-hidden="true" />
        </span>
        <span className="font-display font-semibold text-xs text-white">Performance Trends</span>
      </div>
      <span className="text-[10px] font-medium text-[#00E5FF]">Growth Curve</span>
    </div>

    <svg viewBox="0 0 220 78" className="w-full h-16 overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${gradIdPrefix}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8E4585" />
          <stop offset="55%" stopColor="#C476BB" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>
        <linearGradient id={`${gradIdPrefix}-area`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8E4585" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Subtle horizontal grid lines */}
      <line x1="0" y1="20" x2="220" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
      <line x1="0" y1="45" x2="220" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
      <line x1="0" y1="68" x2="220" y2="68" stroke="rgba(255,255,255,0.08)" />

      {/* Area fill */}
      <path
        d="M 8 58 C 44 54, 62 36, 98 40 C 134 44, 156 18, 212 12 L 212 68 L 8 68 Z"
        fill={`url(#${gradIdPrefix}-area)`}
      />
      {/* Trend curve */}
      <path
        d="M 8 58 C 44 54, 62 36, 98 40 C 134 44, 156 18, 212 12"
        fill="none"
        stroke={`url(#${gradIdPrefix}-line)`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Data points */}
      <circle cx="8" cy="58" r="3.5" fill="#8E4585" stroke="#06030C" strokeWidth="1.5" />
      <circle cx="98" cy="40" r="3.5" fill="#C476BB" stroke="#06030C" strokeWidth="1.5" />
      <circle cx="158" cy="24" r="3.5" fill="#00E5FF" stroke="#06030C" strokeWidth="1.5" />
      <circle cx="212" cy="12" r="4.5" fill="#00E5FF" stroke="#06030C" strokeWidth="1.5" />
    </svg>
  </div>
);

const AssignmentsStackCard = ({ className = "" }) => (
  <div className={`ezen-glass rounded-2xl border border-white/15 p-4 ${className}`}>
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/35 flex items-center justify-center text-[#00E5FF]">
          <MdOutlineAssignment size={16} aria-hidden="true" />
        </span>
        <span className="font-display font-semibold text-xs text-white">Assignments &amp; Resources</span>
      </div>
      <MdMenuBook size={15} className="text-[#C476BB]" aria-hidden="true" />
    </div>

    <div className="space-y-2" aria-hidden="true">
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <MdCheckCircleOutline size={14} className="text-[#00E5FF] shrink-0" />
          <span className="h-2 w-24 rounded-full bg-slate-300/35" />
        </div>
        <span className="h-2 w-8 rounded-full bg-[#00E5FF]/40 shrink-0" />
      </div>
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-3.5 h-3.5 rounded-full border border-[#C476BB]/70 shrink-0" />
          <span className="h-2 w-20 rounded-full bg-slate-400/30" />
        </div>
        <span className="h-2 w-10 rounded-full bg-[#8E4585]/50 shrink-0" />
      </div>
    </div>
  </div>
);

const AiAssistantNode = ({ className = "" }) => (
  <div className={`ezen-glass rounded-2xl border border-[#00E5FF]/35 p-4 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
        <span
          className="ezen-anim-pulse absolute inset-0 rounded-full border border-[#00E5FF]/50 bg-[#00E5FF]/10"
          aria-hidden="true"
        />
        <span
          className="absolute inset-1.5 rounded-full border border-[#C476BB]/50 bg-[#8E4585]/20"
          aria-hidden="true"
        />
        <MdAutoAwesome size={20} className="relative z-10 text-[#00E5FF]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-display font-semibold text-xs text-white">AI Learning Support</p>
        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
          Concept clarity, revision plans &amp; study guidance
        </p>
      </div>
    </div>
  </div>
);

const CentralDashboardHub = ({ gradIdPrefix }) => (
  <div className="ezen-glass rounded-3xl border border-white/20 p-5 sm:p-6 shadow-glow relative overflow-hidden">
    {/* Subtle top cyan-amethyst gradient bar */}
    <div
      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8E4585] to-[#00E5FF]"
      aria-hidden="true"
    />

    {/* Window chrome */}
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow">
          <div className="w-full h-full bg-[#0D0819] rounded-[6px] flex items-center justify-center font-display font-black text-xs text-[#00E5FF]">
            EZ
          </div>
        </div>
        <div>
          <p className="font-display font-bold text-sm text-white leading-none">E-Zen Academic Hub</p>
          <p className="text-[10px] text-slate-400 mt-1">Connected Campus Workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF]/70" />
        <span className="w-2 h-2 rounded-full bg-[#C476BB]/70" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>

    {/* Visual centerpiece combining Books/Cap + Abstract Module Blocks */}
    <div className="py-5 flex flex-col sm:flex-row items-center gap-5">
      <div className="flex items-center justify-center rounded-2xl bg-[#090514] border border-white/10 p-3 w-full sm:w-auto">
        <BooksAndCapArt gradIdPrefix={gradIdPrefix} />
      </div>

      <div className="flex-1 w-full space-y-2.5" aria-hidden="true">
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <MdSchool size={14} className="text-[#00E5FF]" /> Academic Workspace
          </span>
          <span className="text-[#C476BB]">Synced</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden p-0.5">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8E4585]" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <span className="block w-5 h-1.5 rounded-full bg-[#00E5FF]/60 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-300 font-medium">Students</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <span className="block w-5 h-1.5 rounded-full bg-[#C476BB]/70 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-300 font-medium">Faculty</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <span className="block w-5 h-1.5 rounded-full bg-white/50 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-300 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom ecosystem connection strip */}
    <div className="pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" aria-hidden="true" />
        Attendance &amp; Progress
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C476BB]" aria-hidden="true" />
        Study Resources
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" aria-hidden="true" />
        AI Guidance
      </span>
    </div>
  </div>
);

const EdTechIllustration = ({ paused = false, onTogglePause }) => {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={`relative rounded-3xl border border-white/10 bg-[#090514]/90 p-5 sm:p-8 lg:p-10 overflow-hidden shadow-card ${paused ? "ezen-motion-paused" : ""
        }`}
    >
      {/* Ambient Royal Amethyst & Electric Cyan lighting */}
      <div
        className="ezen-anim-aura pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-[#8E4585]/25 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="ezen-anim-aura pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#00E5FF]/20 blur-[110px]"
        aria-hidden="true"
      />
      <div className="ezen-hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      {/* Top Stage Header + Accessible Motion Toggle */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 lg:mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" aria-hidden="true" />
          <span className="font-medium">Interactive Ecosystem Architecture</span>
        </div>

        {onTogglePause && (
          <button
            type="button"
            onClick={onTogglePause}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.05] border border-white/15 text-slate-200 hover:border-[#00E5FF]/45 hover:text-white transition"
          >
            {paused ? <MdPlayArrow size={15} aria-hidden="true" /> : <MdPause size={15} aria-hidden="true" />}
            <span>{paused ? "Play animation" : "Pause animation"}</span>
          </button>
        )}
      </div>

      {/* Desktop / Laptop Stage (lg+): Connected Spatial Layout with SVG Beams */}
      <div className="hidden lg:block relative z-10">
        <div className="relative min-h-[500px] grid grid-cols-12 items-center gap-6">
          {/* SVG Connection Lines linking Floating Modules to Central Hub */}
          <svg
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${uid}-beam1`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#8E4585" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id={`${uid}-beam2`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8E4585" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.65" />
              </linearGradient>
            </defs>

            {/* Top-left (Attendance) to Center Hub */}
            <path
              d="M 245 120 C 310 120, 315 210, 365 225"
              fill="none"
              stroke={`url(#${uid}-beam1)`}
              strokeWidth="2"
              strokeDasharray="6 6"
              className="ezen-anim-flow"
            />
            {/* Bottom-left (Assignments) to Center Hub */}
            <path
              d="M 245 385 C 310 385, 315 300, 365 280"
              fill="none"
              stroke={`url(#${uid}-beam1)`}
              strokeWidth="2"
              strokeDasharray="6 6"
              className="ezen-anim-flow"
            />
            {/* Top-right (Performance) to Center Hub */}
            <path
              d="M 755 125 C 690 125, 685 210, 635 225"
              fill="none"
              stroke={`url(#${uid}-beam2)`}
              strokeWidth="2"
              strokeDasharray="6 6"
              className="ezen-anim-flow"
            />
            {/* Bottom-right (AI Support) to Center Hub */}
            <path
              d="M 755 375 C 690 375, 685 300, 635 280"
              fill="none"
              stroke={`url(#${uid}-beam2)`}
              strokeWidth="2"
              strokeDasharray="6 6"
              className="ezen-anim-flow"
            />

            {/* Luminous connection nodes */}
            <circle cx="365" cy="225" r="4" fill="#00E5FF" />
            <circle cx="365" cy="280" r="4" fill="#C476BB" />
            <circle cx="635" cy="225" r="4" fill="#C476BB" />
            <circle cx="635" cy="280" r="4" fill="#00E5FF" />
          </svg>

          {/* Left Column: Attendance Calendar & Assignments Stack */}
          <div className="col-span-3 flex flex-col justify-between gap-12 relative z-10">
            <div className="ezen-anim-float-slow">
              <AttendanceCalendarCard />
            </div>
            <div className="ezen-anim-float-delayed">
              <AssignmentsStackCard />
            </div>
          </div>

          {/* Center Column: Floating Academic Dashboard + Books & Graduation Cap */}
          <div className="col-span-6 relative z-10">
            <div className="ezen-anim-float-med">
              <CentralDashboardHub gradIdPrefix={`${uid}-desktop`} />
            </div>
          </div>

          {/* Right Column: Performance Graph & AI Learning Assistant */}
          <div className="col-span-3 flex flex-col justify-between gap-12 relative z-10">
            <div className="ezen-anim-float-delayed">
              <PerformanceGraphCard gradIdPrefix={`${uid}-desktop-graph`} />
            </div>
            <div className="ezen-anim-float-slow">
              <AiAssistantNode />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Stage (< lg): Purpose-Built Adaptive Stacked Grid */}
      <div className="lg:hidden relative z-10 space-y-4">
        <div className="ezen-anim-float-med">
          <CentralDashboardHub gradIdPrefix={`${uid}-mobile`} />
        </div>

        {/* Visual vertical connector */}
        <div className="flex justify-center" aria-hidden="true">
          <div className="w-px h-6 bg-gradient-to-b from-[#00E5FF] to-[#8E4585]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AttendanceCalendarCard />
          <PerformanceGraphCard gradIdPrefix={`${uid}-mobile-graph`} />
          <AssignmentsStackCard />
          <AiAssistantNode />
        </div>
      </div>
    </div>
  );
};

export default EdTechIllustration;
