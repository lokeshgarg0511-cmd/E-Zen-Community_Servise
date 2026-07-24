import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../services/mockApi";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    adminApi.listCourses().then(setCourses);
  }, []);

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Courses</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{courses.length} courses across all departments.</p>

      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Code</th><th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Department</th><th className="py-3 px-3">Semester</th><th className="py-3 px-3">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {courses.map((c) => (
              <tr key={c.code}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{c.code}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{c.name}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{c.department}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{c.semester}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{c.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
