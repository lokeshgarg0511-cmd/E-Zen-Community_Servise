import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import { MdEventAvailable, MdLock } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { parentApi } from "../../services/mockApi";

const ParentAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    parentApi.getChildDashboard(user.id).then(setData);
  }, [user.id]);

  return (
    <DashboardLayout role="parent">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Attendance</h1>
        <span className="badge bg-slate-200 text-slate-500 dark:bg-white/5 dark:text-slate-400"><MdLock size={12} /> Read-only</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">View-only access to your child's attendance records.</p>

      {data && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card icon={<MdEventAvailable />} label="Overall percentage" value={`${data.attendancePct}%`} accent="violet" />
            <Card label="Status" value={data.attendancePct >= 75 ? "Healthy" : "Below requirement"} accent={data.attendancePct >= 75 ? "cyan" : "coral"} />
          </div>
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Recent records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Course</th><th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {data.attendanceRecords?.slice(0, 15).map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{r.course}</td>
                      <td className="py-2.5"><Badge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ParentAttendance;
