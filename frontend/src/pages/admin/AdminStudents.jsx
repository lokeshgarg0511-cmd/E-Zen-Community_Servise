import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { studentApi } from "../../services/mockApi";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    studentApi.listAll({ search }).then(setStudents);
  }, [search]);

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Manage students</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{students.length} students across all departments.</p>

      <div className="relative max-w-sm mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="input-field pl-10" />
      </div>

      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Name</th><th className="py-3 px-3">Roll no.</th>
              <th className="py-3 px-3">Department</th><th className="py-3 px-3">Semester</th>
              <th className="py-3 px-3">Score</th><th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{s.fullName}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.rollNumber}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.department}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.semester}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.composite.score}</td>
                <td className="py-2.5 px-3"><Badge status={s.composite.riskLevel} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
