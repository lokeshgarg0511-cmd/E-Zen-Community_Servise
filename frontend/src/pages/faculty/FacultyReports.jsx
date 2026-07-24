import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { ComparisonBarChart, RiskPieChart } from "../../components/Charts";
import { studentApi } from "../../services/mockApi";

const FacultyReports = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    studentApi.listAll().then(setStudents);
  }, []);

  const byDept = Object.values(
    students.reduce((acc, s) => {
      acc[s.department] = acc[s.department] || { name: s.department, value: 0, count: 0 };
      acc[s.department].value += s.composite.score;
      acc[s.department].count += 1;
      return acc;
    }, {})
  ).map((d) => ({ name: d.name, value: Math.round((d.value / d.count) * 100) / 100 }));

  const riskCounts = ["excellent", "normal", "at-risk"].map((level) => ({
    name: level === "at-risk" ? "At Risk" : level.charAt(0).toUpperCase() + level.slice(1),
    value: students.filter((s) => s.composite.riskLevel === level).length,
    color: level === "excellent" ? "#22d3ee" : level === "normal" ? "#fbbf24" : "#fb7185",
  }));

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Reports & analytics</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Department performance and risk distribution across your cohort.</p>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-surface p-5">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Average score by department</h2>
          <ComparisonBarChart data={byDept} bars={[{ key: "value", color: "#a78bfa", label: "Avg. score" }]} xKey="name" />
        </div>
        <div className="card-surface p-5">
          <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Risk distribution</h2>
          <RiskPieChart data={riskCounts} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyReports;
