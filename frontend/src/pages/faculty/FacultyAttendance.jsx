import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { studentApi, facultyApi } from "../../services/mockApi";
import { COURSES } from "../../services/seedData";

const FacultyAttendance = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ subject: COURSES[0].code, customSubject: "", className: "CSE-A", semester: "5", date: new Date().toISOString().slice(0, 10), time: "09:00" });
  const [statuses, setStatuses] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { studentApi.listAll().then((list) => setStudents([...list].sort((a, b) => a.fullName.localeCompare(b.fullName)))); }, []);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const subject = form.subject === "other" ? form.customSubject.trim() : form.subject;
  const setStatus = (studentId, status) => setStatuses((current) => ({ ...current, [studentId]: status }));
  const submit = async () => {
    if (!subject || !Object.keys(statuses).length) return;
    await Promise.all(Object.entries(statuses).map(([studentId, status]) => facultyApi.markAttendance(studentId, subject, status, { className: form.className, semester: Number(form.semester), time: form.time, date: `${form.date}T${form.time}` })));
    setStatuses({}); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return <DashboardLayout role="faculty">
    <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Mark attendance</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose the class details, then mark students in alphabetical order.</p>
    <div className="card-surface p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
      <select value={form.subject} onChange={update("subject")} className="input-field">{COURSES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}<option value="other">Other / Type subject</option></select>
      {form.subject === "other" && <input required value={form.customSubject} onChange={update("customSubject")} placeholder="Type subject" className="input-field" />}
      <input value={form.className} onChange={update("className")} placeholder="Class" className="input-field" />
      <input type="number" min="1" max="8" value={form.semester} onChange={update("semester")} placeholder="Semester" className="input-field" />
      <input type="date" value={form.date} onChange={update("date")} className="input-field" />
      <input type="time" value={form.time} onChange={update("time")} className="input-field" />
    </div>
    <div className="flex gap-3 items-center mb-5"><button onClick={submit} disabled={!Object.keys(statuses).length || !subject} className="btn-primary">Save attendance</button>{saved && <span className="text-sm text-cyan-500">Attendance recorded.</span>}</div>
    <div className="card-surface p-2 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs uppercase tracking-wide"><th className="py-3 px-3">Student (A–Z)</th><th className="py-3 px-3">Roll no.</th><th className="py-3 px-3">Mark as</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-white/5">{students.map((student) => <tr key={student.id}><td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{student.fullName}</td><td className="py-2.5 px-3 text-slate-500">{student.rollNumber}</td><td className="py-2.5 px-3"><div className="flex gap-2">{["present", "late", "absent"].map((status) => <button key={status} onClick={() => setStatus(student.id, status)} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statuses[student.id] === status ? "bg-cyan-500 text-navy-950 border-cyan-500" : "border-slate-200 text-slate-500 dark:border-white/10"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>)}</div></td></tr>)}</tbody></table></div>
  </DashboardLayout>;
};
export default FacultyAttendance;
