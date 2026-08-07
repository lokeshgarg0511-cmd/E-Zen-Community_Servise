import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { MdLock, MdGrade, MdOutlineAssignment } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { parentApi } from "../../services/mockApi";

const EXAM_LABEL = {
  internal1: "Internal 1",
  internal2: "Internal 2",
  quiz: "Quiz",
  assignment: "Assignment",
};

const MarksBadge = ({ marks, totalMarks }) => {
  if (marks == null || totalMarks == null) {
    return (
      <span className="text-xs text-slate-400 italic">Not graded yet</span>
    );
  }
  const pct = Math.round((marks / totalMarks) * 100);
  const color =
    pct >= 75
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
      : pct >= 50
      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}
    >
      <MdGrade size={12} />
      {marks}/{totalMarks}
      <span className="font-normal opacity-70">({pct}%)</span>
    </span>
  );
};

const ParentAssignments = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all"); // all | submitted | pending | graded

  useEffect(() => {
    parentApi.getChildDashboard(user.id).then(setData);
  }, [user.id]);

  const assignments = data?.assignments || [];

  const filtered = assignments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "graded") return a.marks != null;
    return a.status === filter;
  });

  const totalAssignments = assignments.length;
  const graded = assignments.filter((a) => a.marks != null).length;
  const submitted = assignments.filter((a) => a.status === "submitted").length;
  const pending = assignments.filter((a) => a.status === "pending").length;

  return (
    <DashboardLayout role="parent">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Assignments
        </h1>
        <span className="badge bg-slate-200 text-slate-500 dark:bg-white/5 dark:text-slate-400">
          <MdLock size={12} /> Read-only
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        View your child's assignment submission status and marks awarded by faculty.
      </p>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: totalAssignments, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
          { label: "Submitted", value: submitted, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
          { label: "Pending", value: pending, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
          { label: "Graded", value: graded, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="card-surface p-4 flex flex-col items-center justify-center rounded-xl"
          >
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {[
          { id: "all", label: "All" },
          { id: "submitted", label: "Submitted" },
          { id: "pending", label: "Pending" },
          { id: "graded", label: "Graded (with marks)" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Assignment cards ── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-10 text-sm">
            No assignments match this filter.
          </p>
        )}
        {filtered.map((a) => (
          <div
            key={a.id}
            className="card-surface p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-700/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              {/* Assignment info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MdOutlineAssignment className="text-indigo-500 shrink-0" size={16} />
                  <p className="font-medium text-slate-800 dark:text-white truncate">
                    {a.title}
                  </p>
                </div>
                <p className="text-xs text-slate-400 ml-6">
                  {a.course} · Due {new Date(a.dueDate).toLocaleDateString()}
                </p>
                {a.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-6 line-clamp-2">
                    {a.description}
                  </p>
                )}
              </div>

              {/* Status + Marks column */}
              <div className="flex sm:flex-col items-start sm:items-end gap-3 shrink-0">
                <Badge status={a.status} />
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
                    Marks
                  </span>
                  <MarksBadge marks={a.marks} totalMarks={a.totalMarks} />
                  {a.gradedAt && (
                    <span className="text-[10px] text-slate-400">
                      Graded {new Date(a.gradedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ParentAssignments;
