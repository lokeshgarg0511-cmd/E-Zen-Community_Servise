import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { ComparisonBarChart, RiskPieChart } from "../../components/Charts";
import { adminApi, reportApi } from "../../services/mockApi";
import Badge from "../../components/Badge";

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [atRisk, setAtRisk] = useState([]);

  useEffect(() => {
    adminApi.getDashboardStats().then(setStats);
    reportApi.getAtRiskAnalysis().then(setAtRisk);
  }, []);

  const riskCounts = stats && [
    { name: "At Risk", value: stats.atRiskStudents, color: "#fb7185" },
    { name: "Healthy", value: stats.totalStudents - stats.atRiskStudents, color: "#22d3ee" },
  ];

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Analytics</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">University-wide performance and early-warning analysis.</p>

      {stats && (
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Department statistics</h2>
            <ComparisonBarChart
              data={stats.departmentStats.map((d) => ({ name: d.department, avg: d.avgScore }))}
              bars={[{ key: "avg", color: "#22d3ee", label: "Avg. score" }]}
            />
          </div>
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Risk overview</h2>
            <RiskPieChart data={riskCounts} />
          </div>
        </div>
      )}

      <div className="card-surface p-5">
        <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">At-risk student analysis</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Department</th><th className="py-2 pr-4">Score</th><th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {atRisk.map((s) => (
              <tr key={s.id}>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200 font-medium">{s.fullName}</td>
                <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{s.department}</td>
                <td className="py-2.5 pr-4 font-semibold text-coral-400">{s.composite.score}</td>
                <td className="py-2.5"><Badge status="at-risk" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
