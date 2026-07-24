import React, { useEffect, useState } from "react";
import { MdPeopleAlt, MdEventAvailable, MdOutlineAssignment, MdWarningAmber } from "react-icons/md";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import { facultyApi, studentApi } from "../../services/mockApi";

const FacultyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [atRisk, setAtRisk] = useState([]);

  useEffect(() => {
    facultyApi.getDashboardStats().then(setStats);
    studentApi.listAll({ riskLevel: "at-risk" }).then(setAtRisk);
  }, []);

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Faculty overview</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Monitor your cohort's academic health at a glance.</p>

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card icon={<MdPeopleAlt />} label="Total students" value={stats.totalStudents} accent="violet" />
          <Card icon={<MdEventAvailable />} label="Attendance entries" value={stats.attendanceEntries} accent="cyan" />
          <Card icon={<MdOutlineAssignment />} label="Pending assignments" value={stats.pendingAssignments} accent="amber" />
          <Card icon={<MdWarningAmber />} label="At-risk students" value={stats.atRiskStudents} accent="coral" />
        </div>
      )}

      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white">At-risk students</h2>
          <Link to="/faculty/students" className="text-xs text-cyan-500 font-medium">View all students</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Roll no.</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {atRisk.map((s) => (
                <tr key={s.id}>
                  <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200 font-medium">{s.fullName}</td>
                  <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{s.rollNumber}</td>
                  <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{s.department}</td>
                  <td className="py-2.5 pr-4 font-semibold text-coral-400">{s.composite.score}</td>
                  <td className="py-2.5"><Badge status="at-risk" /></td>
                </tr>
              ))}
              {atRisk.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-slate-400">No students currently at risk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
