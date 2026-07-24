import React, { useEffect, useState } from "react";
import { MdSchool, MdPeopleAlt, MdFamilyRestroom, MdWarningAmber } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import { ComparisonBarChart } from "../../components/Charts";
import { adminApi } from "../../services/mockApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getDashboardStats().then(setStats);
  }, []);

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">System overview</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">University-wide academic monitoring at a glance.</p>

      {stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card icon={<MdSchool />} label="Total students" value={stats.totalStudents} accent="violet" />
            <Card icon={<MdPeopleAlt />} label="Total faculty" value={stats.totalFaculty} accent="cyan" />
            <Card icon={<MdFamilyRestroom />} label="Total parents" value={stats.totalParents} accent="amber" />
            <Card icon={<MdWarningAmber />} label="At-risk students" value={stats.atRiskStudents} accent="coral" />
          </div>

          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Department statistics</h2>
            <ComparisonBarChart
              data={stats.departmentStats.map((d) => ({ name: d.department, students: d.count, avg: d.avgScore }))}
              bars={[{ key: "students", color: "#a78bfa", label: "Students" }, { key: "avg", color: "#22d3ee", label: "Avg. score" }]}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
