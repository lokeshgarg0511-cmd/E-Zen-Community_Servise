import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { facultyApi } from "../../services/mockApi";
import {
  MdGroups, MdCalendarToday, MdAccessTime, MdPerson,
  MdCheckCircle, MdCancel, MdHourglassEmpty, MdUpdate,
  MdEventBusy, MdDone, MdFilterList, MdVideoCall,
  MdContentCopy, MdOpenInNew, MdAutorenew, MdSchedule,
} from "react-icons/md";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: MdHourglassEmpty, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  accepted:  { label: "Accepted",  icon: MdCheckCircle,    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
  declined:  { label: "Declined",  icon: MdEventBusy,      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
  postponed: { label: "Postponed", icon: MdUpdate,         color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" },
  cancelled: { label: "Cancelled", icon: MdCancel,         color: "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400" },
  scheduled: { label: "Scheduled", icon: MdVideoCall,      color: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300" },
  completed: { label: "Completed", icon: MdDone,           color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={13} />
      {cfg.label}
    </span>
  );
};

// ── Utility: generate a simulated Google Meet link ────────────────────────────
const makeMeetLink = () => {
  const rand = (n) => Math.random().toString(36).slice(2, 2 + n);
  return `https://meet.google.com/${rand(3)}-${rand(4)}-${rand(3)}`;
};

// ── Conduct Meeting Modal ─────────────────────────────────────────────────────
const ConductMeetingModal = ({ meeting, onClose, onSubmit, conducting }) => {
  const [meetLink, setMeetLink]           = useState("");
  const [scheduledDate, setScheduledDate] = useState(meeting.preferredDate || "");
  const [scheduledTime, setScheduledTime] = useState(meeting.preferredTime || "10:00");
  const [copied, setCopied]               = useState(false);
  const [linkError, setLinkError]         = useState(false);

  const handleGenerate = () => {
    setMeetLink(makeMeetLink());
    setLinkError(false);
  };

  const handleCopy = () => {
    if (!meetLink) return;
    navigator.clipboard.writeText(meetLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!meetLink.trim()) { setLinkError(true); return; }
    onSubmit(meeting.id, { meetLink: meetLink.trim(), scheduledDate, scheduledTime });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md">
              <MdVideoCall size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                Conduct Meeting via Google Meet
              </h3>
              <p className="text-xs text-slate-400">Share the link with the parent to join</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <MdCancel size={20} />
          </button>
        </div>

        {/* Meeting summary strip */}
        <div className="px-6 py-3 bg-teal-50 dark:bg-teal-900/10 border-b border-teal-100 dark:border-teal-800/30">
          <p className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1.5 font-medium">
            <MdPerson size={13} />
            From: <span className="font-semibold ml-0.5">{meeting.parentName || "Parent"}</span>
            <span className="mx-1 text-teal-300 dark:text-teal-700">·</span>
            <span className="font-medium">{meeting.subject}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Meet Link */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
              <MdVideoCall size={14} className="text-teal-500" />
              Google Meet Link <span className="text-red-400 ml-0.5">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={meetLink}
                onChange={(e) => { setMeetLink(e.target.value); setLinkError(false); }}
                className={`input-field flex-1 text-sm font-mono ${linkError ? "border-red-400 dark:border-red-500 ring-1 ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={handleCopy}
                title="Copy link"
                className="shrink-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {copied ? <MdCheckCircle size={16} className="text-emerald-500" /> : <MdContentCopy size={16} />}
              </button>
            </div>
            {linkError && (
              <p className="text-xs text-red-500 mt-1">Please enter or generate a Google Meet link.</p>
            )}
            {/* Auto-generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group"
            >
              <MdAutorenew size={15} className="group-hover:rotate-180 transition-transform duration-500" />
              Auto-generate a Meet link
            </button>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdCalendarToday size={13} /> Scheduled Date
              </label>
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="input-field !py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdAccessTime size={13} /> Scheduled Time
              </label>
              <input
                required
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="input-field !py-2 text-sm"
              />
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl px-4 py-3">
            <span className="text-sm mt-0.5">📩</span>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Once you click <strong>Share & Notify Parent</strong>, the Meet link will be sent to the parent as a notification and they can join directly from their portal.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={conducting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50
                bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg"
            >
              {conducting ? (
                <span className="flex items-center justify-center gap-2">
                  <MdAutorenew size={16} className="animate-spin" /> Sharing…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <MdVideoCall size={16} /> Share & Notify Parent
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Response modal ────────────────────────────────────────────────────────────
const ResponseModal = ({ meeting, onClose, onSubmit, acting }) => {
  const [action, setAction]   = useState("accepted");
  const [note, setNote]       = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");

  const actionConfig = {
    accepted:  { label: "Accept",   btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",  icon: "✅" },
    declined:  { label: "Decline",  btnClass: "bg-red-600 hover:bg-red-700 text-white",          icon: "❌" },
    postponed: { label: "Postpone", btnClass: "bg-violet-600 hover:bg-violet-700 text-white",    icon: "🔄" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === "postponed" && !newDate) return;
    onSubmit(meeting.id, action, { note, newDate, newTime });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MdGroups size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
              Respond to Meeting Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
          >
            <MdCancel size={20} />
          </button>
        </div>

        {/* Meeting summary */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
            <MdPerson size={12} /> From: <span className="font-medium text-slate-700 dark:text-slate-200 ml-1">{meeting.parentName || "Parent"}</span>
          </p>
          <p className="font-semibold text-slate-800 dark:text-white text-sm">{meeting.subject}</p>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MdCalendarToday size={12} />
              {meeting.preferredDate
                ? new Date(meeting.preferredDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
                : "—"}
            </span>
            <span className="flex items-center gap-1">
              <MdAccessTime size={12} />
              {meeting.preferredTime || "—"}
            </span>
          </div>
          {meeting.message && (
            <p className="mt-1.5 text-xs text-slate-400 italic">"{meeting.message}"</p>
          )}
        </div>

        {/* Response form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Action selector */}
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">
              Your Response
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(actionConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAction(key)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border-2 ${
                    action === key
                      ? `${cfg.btnClass} border-transparent`
                      : "bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Postpone: new date/time */}
          {action === "postponed" && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
              <p className="col-span-2 text-xs font-medium text-violet-700 dark:text-violet-300">
                🔄 Suggest a new schedule:
              </p>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">New Date *</label>
                <input
                  required={action === "postponed"}
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field !py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="input-field !py-1.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Note to Parent{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder={
                action === "accepted"
                  ? "e.g. Please come to Room 204 at the scheduled time…"
                  : action === "declined"
                  ? "e.g. Currently unavailable – please contact HOD office…"
                  : "e.g. I have a department meeting that day, proposing a new slot…"
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field resize-none text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={acting || (action === "postponed" && !newDate)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${actionConfig[action].btnClass}`}
            >
              {acting
                ? "Submitting…"
                : `${actionConfig[action].icon} ${actionConfig[action].label} Meeting`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const FacultyMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filterStatus, setFilterStatus]   = useState("all");
  const [respondTarget, setRespondTarget] = useState(null);
  const [conductTarget, setConductTarget] = useState(null);
  const [acting, setActing]               = useState(false);
  const [conducting, setConducting]       = useState(false);
  const [completing, setCompleting]       = useState(null);
  const [flashId, setFlashId]             = useState(null);
  const [copiedId, setCopiedId]           = useState(null);

  const loadMeetings = async () => {
    setLoading(true);
    const list = await facultyApi.getMeetingRequests(user.id);
    setMeetings(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  };

  useEffect(() => { loadMeetings(); }, [user.id]);

  // ── Respond (accept / decline / postpone) ───────────────────────────────
  const handleRespond = async (meetingId, action, payload) => {
    setActing(true);
    await facultyApi.respondToMeeting(meetingId, action, payload);
    setActing(false);
    setRespondTarget(null);
    setFlashId(meetingId);
    setTimeout(() => setFlashId(null), 3000);
    loadMeetings();
  };

  // ── Conduct meeting: attach Meet link and notify parent ──────────────────
  const handleConduct = async (meetingId, payload) => {
    setConducting(true);
    await facultyApi.conductMeeting(meetingId, payload);
    setConducting(false);
    setConductTarget(null);
    setFlashId(meetingId);
    setTimeout(() => setFlashId(null), 4000);
    loadMeetings();
  };

  // ── Mark meeting as completed ─────────────────────────────────────────────
  const handleComplete = async (meetingId) => {
    setCompleting(meetingId);
    await facultyApi.markMeetingCompleted(meetingId);
    setCompleting(null);
    loadMeetings();
  };

  // ── Copy Meet link ────────────────────────────────────────────────────────
  const handleCopyLink = (link, id) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const statusCounts = meetings.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});

  const filtered = meetings.filter(
    (m) => filterStatus === "all" || m.status === filterStatus
  );

  const pendingCount   = statusCounts.pending   || 0;
  const scheduledCount = statusCounts.scheduled || 0;

  return (
    <DashboardLayout role="faculty">
      {/* Response Modal */}
      {respondTarget && (
        <ResponseModal
          meeting={respondTarget}
          onClose={() => setRespondTarget(null)}
          onSubmit={handleRespond}
          acting={acting}
        />
      )}

      {/* Conduct Meeting Modal */}
      {conductTarget && (
        <ConductMeetingModal
          meeting={conductTarget}
          onClose={() => setConductTarget(null)}
          onSubmit={handleConduct}
          conducting={conducting}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            Parent Meeting Requests
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold">
                {pendingCount}
              </span>
            )}
            {scheduledCount > 0 && (
              <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-xs font-bold">
                <MdVideoCall size={12} /> {scheduledCount} scheduled
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review requests, respond, and conduct Google Meet sessions with parents.
          </p>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 mb-5">
        {[
          { label: "Total",     val: meetings.length,            color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" },
          { label: "Pending",   val: statusCounts.pending   || 0, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" },
          { label: "Accepted",  val: statusCounts.accepted  || 0, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" },
          { label: "Scheduled", val: statusCounts.scheduled || 0, color: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300" },
          { label: "Completed", val: statusCounts.completed || 0, color: "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300" },
        ].map((s) => (
          <div key={s.label} className="card-surface rounded-xl p-4 text-center">
            <span className={`text-2xl font-bold block ${s.color} rounded-lg px-2 py-0.5 mx-auto w-fit`}>
              {s.val}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Filter ── */}
      <div className="flex flex-wrap gap-1.5 mb-5 items-center">
        <MdFilterList className="text-slate-400" size={16} />
        {["all", "pending", "accepted", "declined", "postponed", "scheduled", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              filterStatus === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {s === "all" ? `All (${meetings.length})` : `${s} (${statusCounts[s] || 0})`}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-surface rounded-2xl p-12 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <MdGroups size={28} className="text-indigo-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {filterStatus === "all"
              ? "No meeting requests yet."
              : `No ${filterStatus} requests.`}
          </p>
          <p className="text-slate-400 text-xs max-w-xs">
            When parents request a meeting with you, their requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const isPending   = m.status === "pending";
            const isAccepted  = m.status === "accepted";
            const isScheduled = m.status === "scheduled";
            const isPostponed = m.status === "postponed";
            const isFlash     = flashId === m.id;

            return (
              <div
                key={m.id}
                className={`card-surface rounded-xl p-5 border transition-all ${
                  isFlash
                    ? "border-teal-400 dark:border-teal-600 bg-teal-50/30 dark:bg-teal-900/5"
                    : isPending
                    ? "border-amber-200 dark:border-amber-700/40 hover:border-amber-400 dark:hover:border-amber-500"
                    : isScheduled
                    ? "border-teal-200 dark:border-teal-700/40 hover:border-teal-400 dark:hover:border-teal-500"
                    : isAccepted
                    ? "border-emerald-200 dark:border-emerald-700/40 hover:border-emerald-400"
                    : "border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-700/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">

                  {/* ── Left info ── */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isPending   ? "bg-amber-100 dark:bg-amber-900/30"
                      : isScheduled ? "bg-teal-100 dark:bg-teal-900/30"
                      : isAccepted  ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-indigo-100 dark:bg-indigo-900/30"
                    }`}>
                      {isScheduled
                        ? <MdVideoCall size={20} className="text-teal-500" />
                        : <MdGroups size={20} className={
                            isPending   ? "text-amber-500"
                            : isAccepted  ? "text-emerald-500"
                            : "text-indigo-500"
                          } />}
                    </div>

                    <div className="min-w-0">
                      {/* From parent */}
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
                        <MdPerson size={12} />
                        From: <span className="font-semibold text-slate-700 dark:text-slate-200 ml-1">{m.parentName || "Parent"}</span>
                      </p>

                      {/* Subject */}
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{m.subject}</p>

                      {/* Requested date/time */}
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MdCalendarToday size={12} />
                          {m.preferredDate
                            ? new Date(m.preferredDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MdAccessTime size={12} />
                          {m.preferredTime || "—"}
                        </span>
                        <span className="text-slate-400">
                          Requested {new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>

                      {/* Parent message */}
                      {m.message && (
                        <p className="mt-1.5 text-xs text-slate-400 italic max-w-prose">
                          "{m.message}"
                        </p>
                      )}

                      {/* Faculty response note */}
                      {m.facultyResponse && (
                        <div className={`mt-2 rounded-lg px-3 py-1.5 text-xs border ${
                          m.status === "accepted" || m.status === "scheduled"
                            ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-300"
                            : m.status === "declined"
                            ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/30 text-red-600 dark:text-red-300"
                            : "bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-700/30 text-violet-600 dark:text-violet-300"
                        }`}>
                          <span className="font-semibold">Your note: </span>{m.facultyResponse}
                        </div>
                      )}

                      {/* Postponed new schedule */}
                      {m.status === "postponed" && m.postponedDate && (
                        <p className="mt-1.5 text-xs text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1">
                          <MdUpdate size={13} />
                          Rescheduled to:{" "}
                          {new Date(m.postponedDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                          {m.postponedTime && ` at ${m.postponedTime}`}
                        </p>
                      )}

                      {/* ── Google Meet link (scheduled/completed) ── */}
                      {m.meetLink && (
                        <div className="mt-3 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-700/30 px-4 py-3">
                          <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1.5 mb-2">
                            <MdVideoCall size={14} /> Google Meet Session
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Scheduled time */}
                            <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400">
                              <MdSchedule size={13} />
                              {m.scheduledDate
                                ? new Date(m.scheduledDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
                                : "—"}
                              {m.scheduledTime && ` at ${m.scheduledTime}`}
                            </div>
                          </div>
                          {/* Link row */}
                          <div className="mt-2 flex items-center gap-2">
                            <code className="flex-1 text-xs bg-white dark:bg-navy-950 border border-teal-200 dark:border-teal-800/40 rounded-lg px-2.5 py-1.5 text-teal-700 dark:text-teal-300 truncate font-mono">
                              {m.meetLink}
                            </code>
                            <button
                              onClick={() => handleCopyLink(m.meetLink, m.id)}
                              title="Copy link"
                              className="shrink-0 p-1.5 rounded-lg border border-teal-200 dark:border-teal-700/40 text-teal-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                            >
                              {copiedId === m.id ? <MdCheckCircle size={14} className="text-emerald-500" /> : <MdContentCopy size={14} />}
                            </button>
                            <a
                              href={m.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 p-1.5 rounded-lg border border-teal-200 dark:border-teal-700/40 text-teal-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                              title="Open in new tab"
                            >
                              <MdOpenInNew size={14} />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Right: status + action buttons ── */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <StatusPill status={m.status} />

                    {/* Respond to pending */}
                    {isPending && (
                      <button
                        onClick={() => setRespondTarget(m)}
                        className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                      >
                        <MdGroups size={14} />
                        Respond
                      </button>
                    )}

                    {/* Conduct Meeting button – shown on accepted meetings */}
                    {isAccepted && (
                      <button
                        onClick={() => setConductTarget(m)}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold
                          bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600
                          text-white shadow-sm hover:shadow-md transition-all"
                      >
                        <MdVideoCall size={14} />
                        Conduct Meeting
                      </button>
                    )}

                    {/* Mark as Completed – shown on scheduled meetings */}
                    {isScheduled && (
                      <button
                        onClick={() => handleComplete(m.id)}
                        disabled={completing === m.id}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold
                          bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
                      >
                        {completing === m.id ? (
                          <MdAutorenew size={14} className="animate-spin" />
                        ) : (
                          <MdDone size={14} />
                        )}
                        {completing === m.id ? "Saving…" : "Mark Completed"}
                      </button>
                    )}

                    {/* Allow re-responding to accepted/postponed */}
                    {(isAccepted || isPostponed) && (
                      <button
                        onClick={() => setRespondTarget(m)}
                        className="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        Update response
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default FacultyMeetings;
