import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import RiskGauge from "../../components/RiskGauge";
import { studentApi } from "../../services/mockApi";

const FacultyStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    studentApi.listAll({ search, riskLevel: riskFilter }).then(setStudents);
  }, [search, riskFilter]);

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Students</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Search, filter, and review individual composite scores.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or roll number..." className="input-field pl-10"
          />
        </div>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="input-field sm:w-48">
          <option value="">All risk levels</option>
          <option value="excellent">Excellent</option>
          <option value="normal">Normal</option>
          <option value="at-risk">At Risk</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-surface p-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Roll no.</th>
                <th className="py-3 px-3">Dept.</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {students.map((s) => (
                <tr
                  key={s.id} onClick={() => setSelected(s)}
                  className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.03] ${selected?.id === s.id ? "bg-cyan-500/5" : ""}`}
                >
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{s.fullName}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.rollNumber}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.department}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.composite.score}</td>
                  <td className="py-2.5 px-3"><Badge status={s.composite.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-surface p-5 flex flex-col items-center justify-center text-center">
          {selected ? (
            <>
              <p className="font-display font-semibold text-slate-800 dark:text-white">{selected.fullName}</p>
              <p className="text-xs text-slate-400 mb-4">{selected.rollNumber} &middot; {selected.department}</p>
              <RiskGauge score={selected.composite.score} riskLevel={selected.composite.riskLevel} attendancePct={70} marksPct={70} submissionPct={70} />
            </>
          ) : (
            <p className="text-sm text-slate-400">Select a student to preview their composite score.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyStudents;
