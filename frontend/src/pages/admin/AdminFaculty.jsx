import React, { useEffect, useState } from "react";
import { MdSearch, MdFilterList } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../services/mockApi";
import { DEPARTMENTS } from "../../services/seedData";

const AdminFaculty = () => {
  const [allFaculty, setAllFaculty] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.listUsers("faculty").then(setAllFaculty);
  }, []);

  // Client-side filtering for faculty (dept + name/id search)
  const faculty = allFaculty.filter((f) => {
    const matchesDept = !deptFilter || f.department === deptFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      f.fullName.toLowerCase().includes(q) ||
      (f.employeeId && f.employeeId.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  const clearFilters = () => {
    setDeptFilter("");
    setSearch("");
  };

  const hasFilters = deptFilter || search;

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Manage faculty</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {faculty.length} faculty member{faculty.length !== 1 ? "s" : ""} registered.
      </p>

      {/* Filter panel */}
      <div className="card-surface p-4 mb-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          <MdFilterList size={16} />
          Filter faculty
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-cyan-500 hover:text-cyan-400 normal-case font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="input-field pl-10"
            />
          </div>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.id} — {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {deptFilter && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            Dept: {deptFilter}
          </span>
          <span className="text-xs text-slate-400 self-center">
            {faculty.length} result{faculty.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Faculty table */}
      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Employee ID</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3">Designation</th>
              <th className="py-3 px-3">Subjects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {faculty.map((f) => (
              <tr key={f.id}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{f.fullName}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.employeeId}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    {f.department}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.designation}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.subjects?.join(", ")}</td>
              </tr>
            ))}
            {faculty.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                  No faculty members match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminFaculty;
