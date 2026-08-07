import React, { useEffect, useState } from "react";
import { MdSearch, MdFilterList } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { studentApi } from "../../services/mockApi";
import { DEPARTMENTS, COURSES } from "../../services/seedData";

const SECTIONS = ["A", "B", "C", "D"];

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    studentApi
      .listAll({ search, department: deptFilter, section: sectionFilter, course: courseFilter })
      .then(setStudents);
  }, [search, deptFilter, sectionFilter, courseFilter]);

  // Courses narrowed by chosen dept
  const availableCourses = deptFilter
    ? COURSES.filter((c) => c.department === deptFilter)
    : COURSES;

  const clearFilters = () => {
    setSearch("");
    setDeptFilter("");
    setCourseFilter("");
    setSectionFilter("");
  };

  const hasFilters = search || deptFilter || courseFilter || sectionFilter;

  return (
    <DashboardLayout role="admin">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Manage students</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {students.length} student{students.length !== 1 ? "s" : ""} across all departments.
      </p>

      {/* Filter panel */}
      <div className="card-surface p-4 mb-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          <MdFilterList size={16} />
          Filter students
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-cyan-500 hover:text-cyan-400 normal-case font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll no..."
              className="input-field pl-10"
            />
          </div>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setCourseFilter(""); }}
            className="input-field"
          >
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.id} — {d.name}</option>
            ))}
          </select>

          {/* Course */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All courses</option>
            {availableCourses.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>

          {/* Section */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {(deptFilter || courseFilter || sectionFilter) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {deptFilter && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              Dept: {deptFilter}
            </span>
          )}
          {courseFilter && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Course: {courseFilter}
            </span>
          )}
          {sectionFilter && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Section: {sectionFilter}
            </span>
          )}
          <span className="text-xs text-slate-400 self-center">
            {students.length} result{students.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Student table */}
      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Roll no.</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3">Section</th>
              <th className="py-3 px-3">Semester</th>
              <th className="py-3 px-3">Score</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{s.fullName}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.rollNumber}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.department}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.section || "—"}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.semester}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.composite.score}</td>
                <td className="py-2.5 px-3"><Badge status={s.composite.riskLevel} /></td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                  No students match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
