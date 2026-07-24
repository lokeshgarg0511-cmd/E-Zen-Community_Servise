import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentAssignments = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    studentApi.getDashboard(user.id).then(setData);
  }, [user.id]);

  return (
    <DashboardLayout role="student">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Assignments</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Submission timeliness contributes 30% to your composite score.</p>

      <div className="space-y-3">
        {data?.assignments.map((a) => (
          <div key={a.id} className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-slate-800 dark:text-white">{a.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{a.course} &middot; due {new Date(a.dueDate).toLocaleDateString()}</p>
              {a.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{a.description}</p>}
            </div>
            <Badge status={a.status} />
          </div>
        ))}
        {data && data.assignments.length === 0 && (
          <p className="text-center text-slate-400 py-10">No assignments yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
