import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import { MdEventAvailable } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    studentApi.getDashboard(user.id).then(setData);
  }, [user.id]);

  return (
    <DashboardLayout role="student">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Attendance</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your attendance contributes 30% to your composite score.</p>

      {data && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card icon={<MdEventAvailable />} label="Overall percentage" value={`${data.attendancePct}%`} accent="violet" />
            <Card label="Status" value={data.attendancePct >= 75 ? "Healthy" : "Below requirement"} accent={data.attendancePct >= 75 ? "cyan" : "coral"} />
            <Card label="Minimum required" value="75%" accent="amber" />
          </div>

          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Recent records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Course</th>
                    <th className="py-2">Status</th>
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
                  {!data.attendanceRecords && (
                    <tr><td colSpan={3} className="py-6 text-center text-slate-400">Loading attendance history...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StudentAttendance;
