import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { facultyApi, studentApi } from "../../services/mockApi";
import { COURSES } from "../../services/seedData";

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ title: "", course: COURSES[0].code, description: "", dueDate: "" });
  const [creating, setCreating] = useState(false);

  const load = () => facultyApi.listAssignments().then(setAssignments);

  useEffect(() => {
    load();
    studentApi.listAll().then(setStudents);
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    await facultyApi.createAssignment({ ...form, studentIds: students.map((s) => s.id) });
    setForm({ title: "", course: COURSES[0].code, description: "", dueDate: "" });
    setCreating(false);
    load();
  };

  const setStatus = async (assignmentId, studentId, status) => {
    await facultyApi.updateSubmission(assignmentId, studentId, status);
    load();
  };

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Assignments</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create assignments and update submission status per student.</p>

      <form onSubmit={create} className="card-surface p-5 grid sm:grid-cols-2 gap-4 mb-6">
        <input required placeholder="Assignment title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field sm:col-span-2" />
        <select value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))} className="input-field">
          {COURSES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
        </select>
        <input type="date" required value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="input-field" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field sm:col-span-2" rows={2} />
        <button disabled={creating} className="btn-primary sm:col-span-2 w-fit">Create assignment</button>
      </form>

      <div className="space-y-4">
        {assignments.map((a) => (
          <div key={a.id} className="card-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-semibold text-slate-800 dark:text-white">{a.title}</p>
                <p className="text-xs text-slate-400">{a.course} &middot; due {new Date(a.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="py-2 pr-4">Student</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {a.submissions.map((s) => {
                    const stu = students.find((x) => x.id === s.studentId);
                    return (
                      <tr key={s.studentId}>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{stu?.fullName || s.studentId}</td>
                        <td className="py-2 pr-4"><Badge status={s.status} /></td>
                        <td className="py-2">
                          <select
                            value={s.status} onChange={(e) => setStatus(a.id, s.studentId, e.target.value)}
                            className="input-field !py-1 !px-2 text-xs w-32"
                          >
                            <option value="pending">Pending</option>
                            <option value="submitted">Submitted</option>
                            <option value="late">Late</option>
                            <option value="missing">Missing</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;
