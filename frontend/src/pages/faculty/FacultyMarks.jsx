import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { studentApi, facultyApi } from "../../services/mockApi";
import { COURSES } from "../../services/seedData";

const FacultyMarks = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: "", course: COURSES[0].code, examType: "internal1", marksObtained: "", totalMarks: "50" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    studentApi.listAll().then(setStudents);
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.marksObtained) return;
    await facultyApi.uploadMarks(form.studentId, form.course, form.examType, form.marksObtained, form.totalMarks);
    setSaved(true);
    setForm((f) => ({ ...f, marksObtained: "" }));
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Upload marks</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Marks feed directly into each student's composite early-warning score.</p>

      <form onSubmit={submit} className="card-surface p-6 max-w-xl space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Student</label>
          <select value={form.studentId} onChange={update("studentId")} required className="input-field">
            <option value="">Select student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.fullName} ({s.rollNumber})</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Course</label>
            <select value={form.course} onChange={update("course")} className="input-field">
              {COURSES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Exam type</label>
            <select value={form.examType} onChange={update("examType")} className="input-field">
              <option value="internal1">Internal 1</option>
              <option value="internal2">Internal 2</option>
              <option value="internal3">Internal 3</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Marks obtained</label>
            <input type="number" required value={form.marksObtained} onChange={update("marksObtained")} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Total marks</label>
            <input type="number" required value={form.totalMarks} onChange={update("totalMarks")} className="input-field" />
          </div>
        </div>
        {saved && <p className="text-sm text-cyan-500">Marks uploaded and composite score recalculated.</p>}
        <button type="submit" className="btn-primary">Upload marks</button>
      </form>
    </DashboardLayout>
  );
};

export default FacultyMarks;
