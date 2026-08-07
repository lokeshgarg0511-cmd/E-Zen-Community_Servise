import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { parentApi } from "../../services/mockApi";
import {
  MdGroups, MdCalendarToday, MdAccessTime, MdSubject,
  MdCheckCircle, MdCancel, MdHourglassEmpty, MdDone,
  MdSend, MdAdd, MdClose, MdPerson, MdScheduleSend,
  MdEventBusy, MdUpdate, MdVideoCall, MdOpenInNew,
  MdNotifications, MdSchedule,
} from "react-icons/md";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: MdHourglassEmpty, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  accepted:  { label: "Accepted",  icon: MdCheckCircle,    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
  declined:  { label: "Declined",  icon: MdEventBusy,      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
  postponed: { label: "Postponed", icon: MdUpdate,         color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" },
  cancelled: { label: "Cancelled", icon: MdCancel,         color: "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400" },
  scheduled: { label: "Scheduled", icon: MdVideoCall,      color: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300" },
  // legacy aliases
  confirmed: { label: "Accepted",  icon: MdCheckCircle,    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
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

// ── Discussion topics ─────────────────────────────────────────────────────────
const SUBJECTS = [
  "Academic Performance",
  "Attendance Issues",
  "Assignment Concerns",
  "Exam Preparation",
  "Behavioral Concerns",
  "Career Guidance",
  "General Progress Update",
  "Other",
];

const emptyForm = {
  facultyId: "",
  subject: SUBJECTS[0],
  preferredDate: "",
  preferredTime: "10:00",
  message: "",
};

// ── Utility: check if a meeting was recently scheduled (within last 24h) ──────
const isRecentlyScheduled = (meeting) => {
  if (meeting.status !== "scheduled" || !meeting.conductedAt) return false;
  const diff = Date.now() - new Date(meeting.conductedAt).getTime();
  return diff < 24 * 60 * 60 * 1000;
};

// ── Component ─────────────────────────────────────────────────────────────────
const ParentMentorMeeting = () => {
  const { user } = useAuth();
  const [meetings, setMeetings]           = useState([]);
  const [facultyList, setFacultyList]     = useState([]);
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState(emptyForm);
  const [submitting, setSubmitting]       = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [cancelling, setCancelling]       = useState(null);
  const [studentName, setStudentName]     = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // ── loaders ──────────────────────────────────────────────────────────────
  const loadMeetings = async () => {
    const list = await parentApi.getMentorMeetings(user.id);
    setMeetings(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadMeetings();
    parentApi.getChildDashboard(user.id).then((d) => {
      if (d?.student) setStudentName(d.student.fullName);
    });
    parentApi.listFaculty().then(setFacultyList);
  }, [user.id]);

  // ── form helpers ──────────────────────────────────────────────────────────
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const selectedFaculty = facultyList.find((f) => f.id === form.facultyId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.preferredDate || !form.preferredTime || !form.facultyId) return;
    setSubmitting(true);
    await parentApi.requestMentorMeeting(user.id, {
      ...form,
      facultyName: selectedFaculty?.fullName || "",
    });
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    setForm(emptyForm);
    setTimeout(() => setSubmitted(false), 4000);
    loadMeetings();
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    await parentApi.cancelMeetingRequest(id);
    setCancelling(null);
    loadMeetings();
  };

  // ── filter ────────────────────────────────────────────────────────────────
  const filtered = meetings.filter(
    (m) => filterStatus === "all" || m.status === filterStatus
  );

  const statusCounts = meetings.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});

  // Meetings with a fresh Google Meet link (within 24h)
  const recentlyScheduled = meetings.filter(isRecentlyScheduled);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout role="parent">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Mentor Meeting
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Request a meeting with a faculty member to discuss{" "}
            {studentName ? `${studentName}'s` : "your child's"} academic progress.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          {showForm ? <MdClose size={18} /> : <MdAdd size={18} />}
          {showForm ? "Close Form" : "Request Meeting"}
        </button>
      </div>

      {/* ── Google Meet notification banner ── */}
      {!dismissedBanner && recentlyScheduled.length > 0 && (
        <div className="mt-4 flex items-start gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/10
          border border-teal-200 dark:border-teal-700/40 rounded-xl px-4 py-4 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-teal-300/20 dark:bg-teal-400/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0 shadow-md">
            <MdVideoCall size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
              <MdNotifications size={15} />
              Google Meet Link Received!
            </p>
            <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
              {recentlyScheduled.length === 1
                ? `Your faculty has shared a Google Meet link for "${recentlyScheduled[0].subject}". Check the meeting card below to join.`
                : `${recentlyScheduled.length} meetings have been scheduled with Google Meet links. Check your meeting cards below.`}
            </p>
          </div>
          <button
            onClick={() => setDismissedBanner(true)}
            className="shrink-0 text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-200 transition-colors p-1 rounded-lg"
            aria-label="Dismiss"
          >
            <MdClose size={18} />
          </button>
        </div>
      )}

      {/* ── Success toast ── */}
      {submitted && (
        <div className="mt-4 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          <MdCheckCircle size={20} />
          <span>
            Meeting request sent to faculty! You'll be notified once they respond.
          </span>
        </div>
      )}

      {/* ── Request Form ── */}
      {showForm && (
        <div className="mt-5 card-surface p-6 rounded-2xl border border-indigo-200 dark:border-indigo-700/40">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <MdScheduleSend size={18} className="text-white" />
            </div>
            <h2 className="font-display font-semibold text-slate-800 dark:text-white">
              New Meeting Request
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">

            {/* ── Faculty Selection ── */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdPerson size={14} />
                Select Faculty Member <span className="text-red-400 ml-0.5">*</span>
              </label>
              <select
                required
                value={form.facultyId}
                onChange={update("facultyId")}
                className="input-field"
              >
                <option value="">— Choose a faculty member —</option>
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName} · {f.designation} ({f.department})
                  </option>
                ))}
              </select>

              {/* Faculty info card (shown when selected) */}
              {selectedFaculty && (
                <div className="mt-2 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-xl px-4 py-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold text-sm shrink-0">
                    {selectedFaculty.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                      {selectedFaculty.fullName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedFaculty.designation} · {selectedFaculty.department}
                      {selectedFaculty.subjects?.length > 0 && ` · ${selectedFaculty.subjects.join(", ")}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Discussion Subject ── */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdSubject size={14} /> Discussion Subject
              </label>
              <select
                required
                value={form.subject}
                onChange={update("subject")}
                className="input-field"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* ── Date ── */}
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdCalendarToday size={14} /> Preferred Date
              </label>
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.preferredDate}
                onChange={update("preferredDate")}
                className="input-field"
              />
            </div>

            {/* ── Time ── */}
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdAccessTime size={14} /> Preferred Time
              </label>
              <input
                required
                type="time"
                value={form.preferredTime}
                onChange={update("preferredTime")}
                className="input-field"
              />
            </div>

            {/* ── Message ── */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                Additional Message{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe specific concerns or topics you'd like to discuss…"
                value={form.message}
                onChange={update("message")}
                className="input-field resize-none"
              />
            </div>

            {/* ── Info note ── */}
            <div className="sm:col-span-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
              📌 Your request will be sent directly to the selected faculty member. They may accept, decline, or suggest a new time. Once they schedule a Google Meet, you'll receive the link here.
            </div>

            {/* ── Actions ── */}
            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !form.facultyId}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <MdSend size={16} />
                {submitting ? "Sending…" : "Send Request"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stats summary ── */}
      {meetings.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total",     val: meetings.length,              color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" },
            { label: "Pending",   val: statusCounts.pending   || 0,  color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20" },
            { label: "Accepted",  val: (statusCounts.accepted || 0) + (statusCounts.confirmed || 0), color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Scheduled", val: statusCounts.scheduled  || 0, color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20" },
            { label: "Postponed", val: statusCounts.postponed  || 0, color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20" },
          ].map((s) => (
            <div key={s.label} className="card-surface rounded-xl p-3 flex flex-col items-center">
              <span className={`text-2xl font-bold ${s.color} px-2 py-0.5 rounded-lg`}>{s.val}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter tabs ── */}
      {meetings.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["all", "pending", "accepted", "scheduled", "declined", "postponed", "cancelled", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {s === "all" ? `All (${meetings.length})` : s}
            </button>
          ))}
        </div>
      )}

      {/* ── Meeting History ── */}
      <div className="mt-4">
        <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">
          {meetings.length === 0 ? "Meeting Requests" : "Request History"}
        </h2>

        {meetings.length === 0 ? (
          <div className="card-surface rounded-2xl p-10 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MdGroups size={28} className="text-indigo-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">No meeting requests yet.</p>
            <p className="text-slate-400 text-xs max-w-xs">
              Click "Request Meeting" above, choose a faculty member, and submit your request.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">
            No meetings with status "{filterStatus}".
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((m) => {
              const isScheduled = m.status === "scheduled";

              return (
                <div
                  key={m.id}
                  className={`card-surface rounded-xl p-5 border transition-colors ${
                    isScheduled
                      ? "border-teal-200 dark:border-teal-700/40 hover:border-teal-400 dark:hover:border-teal-500"
                      : "border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-700/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">

                    {/* ── Left: info ── */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isScheduled ? "bg-teal-100 dark:bg-teal-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"
                      }`}>
                        {isScheduled
                          ? <MdVideoCall size={20} className="text-teal-500" />
                          : <MdGroups size={20} className="text-indigo-500" />}
                      </div>
                      <div className="min-w-0">
                        {/* Faculty name */}
                        {m.facultyName && (
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-0.5 flex items-center gap-1">
                            <MdPerson size={12} /> {m.facultyName}
                          </p>
                        )}
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{m.subject}</p>

                        {/* Date / time row */}
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
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
                          <span>Requested {new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </div>

                        {/* Parent message */}
                        {m.message && (
                          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 italic">
                            "{m.message}"
                          </p>
                        )}

                        {/* Faculty response note */}
                        {m.facultyResponse && (
                          <div className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium border ${
                            m.status === "accepted" || m.status === "scheduled"
                              ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-300"
                              : m.status === "declined"
                              ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/30 text-red-600 dark:text-red-300"
                              : "bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-700/30 text-violet-700 dark:text-violet-300"
                          }`}>
                            <span className="font-semibold">Faculty: </span>{m.facultyResponse}
                          </div>
                        )}

                        {/* Postponed new schedule */}
                        {m.status === "postponed" && m.postponedDate && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-medium">
                            <MdUpdate size={14} />
                            Rescheduled to:{" "}
                            {new Date(m.postponedDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                            {m.postponedTime && ` at ${m.postponedTime}`}
                          </div>
                        )}

                        {/* ── Google Meet Join Box (scheduled status) ── */}
                        {isScheduled && m.meetLink && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-teal-200 dark:border-teal-700/40">
                            {/* Header strip */}
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500">
                              <MdVideoCall size={16} className="text-white" />
                              <span className="text-xs font-semibold text-white">Google Meet Session Ready</span>
                            </div>

                            {/* Details */}
                            <div className="bg-teal-50 dark:bg-teal-900/10 px-4 py-3 space-y-2">
                              {/* Scheduled time */}
                              <div className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300">
                                <MdSchedule size={14} />
                                <span className="font-medium">
                                  {m.scheduledDate
                                    ? new Date(m.scheduledDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                                    : "—"}
                                  {m.scheduledTime && ` · ${m.scheduledTime}`}
                                </span>
                              </div>

                              {/* Meet link */}
                              <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs bg-white dark:bg-navy-950 border border-teal-200 dark:border-teal-700/40 rounded-lg px-2.5 py-1.5 text-teal-700 dark:text-teal-300 truncate font-mono">
                                  {m.meetLink}
                                </code>
                              </div>

                              {/* Join button */}
                              <a
                                href={m.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold
                                  bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600
                                  text-white shadow-md hover:shadow-lg transition-all"
                              >
                                <MdVideoCall size={17} />
                                Join Google Meet
                                <MdOpenInNew size={14} className="opacity-70" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Right: status + cancel ── */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusPill status={m.status} />
                      {m.status === "pending" && (
                        <button
                          disabled={cancelling === m.id}
                          onClick={() => handleCancel(m.id)}
                          className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors disabled:opacity-40"
                        >
                          {cancelling === m.id ? "Cancelling…" : "Cancel request"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ParentMentorMeeting;
