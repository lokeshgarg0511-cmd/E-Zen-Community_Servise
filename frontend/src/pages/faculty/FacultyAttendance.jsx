import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { studentApi, facultyApi } from "../../services/mockApi";
import { COURSES } from "../../services/seedData";

const FacultyAttendance = () => {
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(COURSES[0].code);
  const [marks, setMarks] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    studentApi.listAll().then(setStudents);
  }, []);

  const setStatus = (studentId, status) => setMarks((m) => ({ ...m, [studentId]: status }));

  const submit = async () => {
    await Promise.all(
      Object.entries(marks).map(([studentId, status]) => facultyApi.markAttendance(studentId, course, status))
    );
    setSaved(true);
    setMarks({});
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Mark attendance</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select a course and mark today's attendance for each student.</p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="input-field w-56">
          {COURSES.map((c) => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </select>
        <button onClick={submit} disabled={!Object.keys(marks).length} className="btn-primary">Save attendance</button>
        {saved && <span className="text-sm text-cyan-500">Attendance recorded.</span>}
      </div>

      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Roll no.</th>
              <th className="py-3 px-3">Mark as</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{s.fullName}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{s.rollNumber}</td>
                <td className="py-2.5 px-3">
                  <div className="flex gap-2">
                    {["present", "late", "absent"].map((st) => (
                      <button
                        key={st} onClick={() => setStatus(s.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                          marks[s.id] === st
                            ? "bg-cyan-500 text-navy-950 border-cyan-500"
                            : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
                        }`}
                      >
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAttendance;
