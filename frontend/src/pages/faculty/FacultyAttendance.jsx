import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { studentApi, facultyApi } from "../../services/mockApi";
import { COURSES, DEPARTMENTS } from "../../services/seedData";

const SECTIONS = ["A", "B", "C", "D"];

const FacultyAttendance = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    subject: COURSES[0].code,
    customSubject: "",
    department: "",
    section: "",
    semester: "5",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
  });
  const [statuses, setStatuses] = useState({});
  const [saved, setSaved] = useState(false);

  // Load all students once
  useEffect(() => {
    studentApi
      .listAll()
      .then((list) => setAllStudents([...list].sort((a, b) => a.fullName.localeCompare(b.fullName))));
  }, []);

  // Filter students whenever dept / section filter changes
  useEffect(() => {
    let filtered = [...allStudents];
    if (form.department) filtered = filtered.filter((s) => s.department === form.department);
    if (form.section) filtered = filtered.filter((s) => s.section === form.section);
    setStudents(filtered);
    // Reset statuses when filter changes so stale entries are removed
    setStatuses({});
  }, [allStudents, form.department, form.section]);

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const subject = form.subject === "other" ? form.customSubject.trim() : form.subject;

  const setStatus = (studentId, status) =>
    setStatuses((current) => ({ ...current, [studentId]: status }));

  const submit = async () => {
    if (!subject || !Object.keys(statuses).length) return;
    await Promise.all(
      Object.entries(statuses).map(([studentId, status]) =>
        facultyApi.markAttendance(studentId, subject, status, {
          department: form.department,
          section: form.section,
          semester: Number(form.semester),
          time: form.time,
          date: `${form.date}T${form.time}`,
        })
      )
    );
    setStatuses({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Courses filtered by department
  const filteredCourses = form.department
    ? COURSES.filter((c) => c.department === form.department)
    : COURSES;

  const markedCount = Object.keys(statuses).length;

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Mark attendance</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Select the department, section, and course, then mark students present or absent.
      </p>

      {/* Class details form */}
      <div className="card-surface p-5 mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">Class details</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Department */}
          <select
            value={form.department}
            onChange={(e) => { update("department")(e); }}
            className="input-field"
          >
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.id}</option>
            ))}
          </select>

          {/* Section */}
          <select value={form.section} onChange={update("section")} className="input-field">
            <option value="">All sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>

          {/* Course / subject */}
          <select
            value={form.subject}
            onChange={update("subject")}
            className="input-field"
          >
            {filteredCourses.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
            <option value="other">Other / Type subject</option>
          </select>

          {form.subject === "other" && (
            <input
              required
              value={form.customSubject}
              onChange={update("customSubject")}
              placeholder="Type subject"
              className="input-field"
            />
          )}

          {/* Semester */}
          <input
            type="number"
            min="1"
            max="8"
            value={form.semester}
            onChange={update("semester")}
            placeholder="Semester"
            className="input-field"
          />

          {/* Date */}
          <input type="date" value={form.date} onChange={update("date")} className="input-field" />

          {/* Time */}
          <input type="time" value={form.time} onChange={update("time")} className="input-field" />
        </div>
      </div>

      {/* Active class summary chips */}
      {(form.department || form.section) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {form.department && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              Dept: {form.department}
            </span>
          )}
          {form.section && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Section {form.section}
            </span>
          )}
          <span className="text-xs text-slate-400 self-center">
            {students.length} student{students.length !== 1 ? "s" : ""} in this class
          </span>
        </div>
      )}

      {/* Save button row */}
      <div className="flex gap-3 items-center mb-5">
        <button
          onClick={submit}
          disabled={!markedCount || !subject}
          className="btn-primary"
        >
          Save attendance
        </button>
        {markedCount > 0 && !saved && (
          <span className="text-xs text-slate-400">{markedCount} of {students.length} marked</span>
        )}
        {saved && <span className="text-sm text-cyan-500">Attendance recorded ✓</span>}
      </div>

      {/* Student list */}
      <div className="card-surface p-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="py-3 px-3">Student (A–Z)</th>
              <th className="py-3 px-3">Roll no.</th>
              <th className="py-3 px-3">Dept.</th>
              <th className="py-3 px-3">Section</th>
              <th className="py-3 px-3">Mark as</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{student.fullName}</td>
                <td className="py-2.5 px-3 text-slate-500">{student.rollNumber}</td>
                <td className="py-2.5 px-3 text-slate-500">{student.department}</td>
                <td className="py-2.5 px-3 text-slate-500">{student.section || "—"}</td>
                <td className="py-2.5 px-3">
                  <div className="flex gap-2">
                    {["present", "late", "absent"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatus(student.id, status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          statuses[student.id] === status
                            ? "bg-cyan-500 text-navy-950 border-cyan-500"
                            : "border-slate-200 text-slate-500 dark:border-white/10"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                  No students match the selected department / section. Select filters above to load students.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAttendance;
