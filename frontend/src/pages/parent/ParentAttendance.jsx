import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import { MdEventAvailable, MdLock } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { parentApi } from "../../services/mockApi";

// ── helper: compute subject-wise attendance summary ───────────────────────────
const buildSubjectStats = (records) => {
  const map = {};
  records.forEach((r) => {
    if (!map[r.course]) map[r.course] = { total: 0, present: 0, late: 0, absent: 0 };
    map[r.course].total += 1;
    if (r.status === "present") map[r.course].present += 1;
    else if (r.status === "late") map[r.course].late += 1;
    else map[r.course].absent += 1;
  });
  return Object.entries(map).map(([course, s]) => ({
    course,
    total: s.total,
    present: s.present,
    late: s.late,
    absent: s.absent,
    pct: s.total ? Math.round(((s.present + s.late * 0.5) / s.total) * 100) : 0,
  }));
};

const statusColor = (pct) => {
  if (pct >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 60) return "text-amber-500 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

const barColor = (pct) => {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-red-500";
};

const ParentAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("subjectwise"); // "subjectwise" | "records"

  useEffect(() => {
    parentApi.getChildDashboard(user.id).then(setData);
  }, [user.id]);

  const subjectStats = data ? buildSubjectStats(data.attendanceRecords || []) : [];

  return (
    <DashboardLayout role="parent">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Attendance
        </h1>
        <span className="badge bg-slate-200 text-slate-500 dark:bg-white/5 dark:text-slate-400">
          <MdLock size={12} /> Read-only
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        View-only access to your child's attendance records, broken down by subject.
      </p>

      {data && (
        <>
          {/* ── Summary Cards ── */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card
              icon={<MdEventAvailable />}
              label="Overall percentage"
              value={`${data.attendancePct}%`}
              accent="violet"
            />
            <Card
              label="Status"
              value={data.attendancePct >= 75 ? "Healthy" : "Below requirement"}
              accent={data.attendancePct >= 75 ? "cyan" : "coral"}
            />
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 mb-5 border-b border-slate-200 dark:border-white/10">
            {[
              { id: "subjectwise", label: "📚 Subject-wise" },
              { id: "records", label: "📋 All Records" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                  tab === t.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Subject-wise Tab ── */}
          {tab === "subjectwise" && (
            <div className="card-surface p-5 space-y-5">
              <h2 className="font-display font-semibold text-slate-800 dark:text-white">
                Attendance by Subject
              </h2>
              {subjectStats.length === 0 ? (
                <p className="text-slate-400 text-sm py-6 text-center">
                  No attendance records available.
                </p>
              ) : (
                <div className="space-y-4">
                  {subjectStats.map((s) => (
                    <div key={s.course} className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-4">
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-800 dark:text-white text-sm">
                          {s.course}
                        </span>
                        <span className={`font-bold text-base ${statusColor(s.pct)}`}>
                          {s.pct}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${barColor(s.pct)}`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                      {/* Stats pills */}
                      <div className="flex gap-3 flex-wrap text-xs">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          ✓ Present: {s.present}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          ⏱ Late: {s.late}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                          ✗ Absent: {s.absent}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                          Total: {s.total}
                        </span>
                      </div>
                      {s.pct < 75 && (
                        <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-medium">
                          ⚠️ Below 75% — attendance improvement needed for this subject.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── All Records Tab ── */}
          {tab === "records" && (
            <div className="card-surface p-5">
              <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
                Recent records
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Subject</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {data.attendanceRecords?.slice(0, 30).map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">
                          {r.course}
                        </td>
                        <td className="py-2.5">
                          <Badge status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ParentAttendance;
