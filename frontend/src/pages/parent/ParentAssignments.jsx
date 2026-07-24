import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { MdLock } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { parentApi } from "../../services/mockApi";

const ParentAssignments = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    parentApi.getChildDashboard(user.id).then(setData);
  }, [user.id]);

  return (
    <DashboardLayout role="parent">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Assignments</h1>
        <span className="badge bg-slate-200 text-slate-500 dark:bg-white/5 dark:text-slate-400"><MdLock size={12} /> Read-only</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">View-only access to your child's submission status.</p>

      <div className="space-y-3">
        {data?.assignments.map((a) => (
          <div key={a.id} className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-slate-800 dark:text-white">{a.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{a.course} &middot; due {new Date(a.dueDate).toLocaleDateString()}</p>
            </div>
            <Badge status={a.status} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ParentAssignments;
