import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { ComparisonBarChart } from "../../components/Charts";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const EXAM_LABEL = { internal1: "Internal 1", internal2: "Internal 2", internal3: "Internal 3", assignment: "Assignment", quiz: "Quiz" };

const StudentMarks = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    studentApi.getDashboard(user.id).then(setData);
  }, [user.id]);

  const chartData = data?.marks.map((m) => ({
    name: m.course, value: Math.round((m.marksObtained / m.totalMarks) * 100),
  }));

  return (
    <DashboardLayout role="student">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Internal marks</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Assessment marks contribute 40% to your composite score.</p>

      {data && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Performance by course</h2>
            <ComparisonBarChart data={chartData} bars={[{ key: "value", color: "#22d3ee", label: "Score %" }]} />
          </div>

          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Detailed marksheet</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="py-2 pr-4">Course</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {data.marks.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{m.course}</td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{EXAM_LABEL[m.examType] || m.examType}</td>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-white">{m.marksObtained}/{m.totalMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentMarks;
