import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../services/mockApi";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    adminApi.listDepartments().then(setDepartments);
  }, []);

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Departments</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{departments.length} departments configured.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="card-surface p-5">
            <p className="text-xs font-semibold text-cyan-500 mb-1">{d.id}</p>
            <p className="font-display font-semibold text-slate-800 dark:text-white mb-1">{d.name}</p>
            <p className="text-xs text-slate-400">HOD: {d.hod}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDepartments;
