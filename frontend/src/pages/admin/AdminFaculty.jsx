import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../services/mockApi";

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    adminApi.listUsers("faculty").then(setFaculty);
  }, []);

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Manage faculty</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{faculty.length} faculty members registered.</p>

      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Name</th><th className="py-3 px-3">Employee ID</th>
              <th className="py-3 px-3">Department</th><th className="py-3 px-3">Designation</th><th className="py-3 px-3">Subjects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {faculty.map((f) => (
              <tr key={f.id}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{f.fullName}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.employeeId}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.department}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.designation}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.subjects?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminFaculty;
