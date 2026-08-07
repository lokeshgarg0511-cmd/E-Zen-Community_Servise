import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { studentApi, facultyApi } from "../../services/mockApi";
import { COURSES } from "../../services/seedData";

// ── helpers ──────────────────────────────────────────────────────────────────
const EXAM_LABELS = {
  internal1: "Internal 1",
  internal2: "Internal 2",
  quiz: "Quiz",
  assignment: "Assignment",
};

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
      {label}
    </label>
    {children}
  </div>
);

// ── main component ────────────────────────────────────────────────────────────
const FacultyMarks = () => {
  const [tab, setTab] = useState("upload"); // "upload" | "edit"
  const [students, setStudents] = useState([]);
  const [allMarks, setAllMarks] = useState([]);

  // ── Upload form state ──
  const [form, setForm] = useState({
    studentId: "",
    subject: COURSES[0].code,
    customSubject: "",
    className: "CSE-A",
    semester: "5",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    examType: "internal1",
    marksObtained: "",
    totalMarks: "50",
  });
  const [saved, setSaved] = useState(false);

  // ── Edit state ──
  const [editingId, setEditingId] = useState(null); // markId being edited
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  // ── load helpers ──────────────────────────────────────────────────────────
  const loadMarks = useCallback(async () => {
    const records = await facultyApi.getMarks();
    setAllMarks(records);
  }, []);

  useEffect(() => {
    studentApi
      .listAll()
      .then((list) =>
        setStudents([...list].sort((a, b) => a.fullName.localeCompare(b.fullName)))
      );
    loadMarks();
  }, [loadMarks]);

  // ── upload form ───────────────────────────────────────────────────────────
  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const subject = form.subject === "other" ? form.customSubject.trim() : form.subject;

  const submit = async (event) => {
    event.preventDefault();
    if (!form.studentId || !subject || !form.marksObtained) return;
    await facultyApi.uploadMarks(
      form.studentId,
      subject,
      form.examType,
      form.marksObtained,
      form.totalMarks,
      {
        className: form.className,
        semester: Number(form.semester),
        date: `${form.date}T${form.time}`,
        time: form.time,
      }
    );
    setForm((current) => ({ ...current, marksObtained: "" }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // Refresh edit list too
    loadMarks();
  };

  // ── edit helpers ──────────────────────────────────────────────────────────
  const startEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      marksObtained: String(record.marksObtained),
      totalMarks: String(record.totalMarks),
      examType: record.examType,
      course: record.course,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (markId) => {
    if (!editForm.marksObtained || !editForm.totalMarks) return;
    setSaving(true);
    await facultyApi.updateMarks(markId, {
      marksObtained: editForm.marksObtained,
      totalMarks: editForm.totalMarks,
      examType: editForm.examType,
      course: editForm.course,
    });
    setSaving(false);
    setEditingId(null);
    setEditForm({});
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2500);
    loadMarks();
  };

  const editUpdate = (key) => (e) =>
    setEditForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── filtered marks for search ─────────────────────────────────────────────
  const studentName = (studentId) =>
    students.find((s) => s.id === studentId)?.fullName || studentId;

  const filteredMarks = allMarks.filter((m) => {
    if (!searchQ.trim()) return true;
    const q = searchQ.toLowerCase();
    return (
      studentName(m.studentId).toLowerCase().includes(q) ||
      (m.course || "").toLowerCase().includes(q) ||
      (EXAM_LABELS[m.examType] || m.examType || "").toLowerCase().includes(q)
    );
  });

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">
        Marks
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Upload new exam/assignment marks or edit existing records.
      </p>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-white/10">
        {[
          { id: "upload", label: "Upload Marks" },
          { id: "edit", label: "Edit Marks" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              tab === t.id
                ? "bg-indigo-600 text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Upload Tab ── */}
      {tab === "upload" && (
        <form
          onSubmit={submit}
          className="card-surface p-6 max-w-3xl grid sm:grid-cols-2 gap-4"
        >
          <Field label="Student (A–Z)">
            <select
              required
              value={form.studentId}
              onChange={update("studentId")}
              className="input-field"
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName} ({student.rollNumber})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subject">
            <select
              value={form.subject}
              onChange={update("subject")}
              className="input-field"
            >
              {COURSES.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
              <option value="other">Other / Type subject</option>
            </select>
          </Field>

          {form.subject === "other" && (
            <Field label="Custom subject">
              <input
                required
                value={form.customSubject}
                onChange={update("customSubject")}
                className="input-field"
              />
            </Field>
          )}

          <Field label="Class">
            <input
              required
              value={form.className}
              onChange={update("className")}
              className="input-field"
            />
          </Field>

          <Field label="Semester">
            <input
              required
              type="number"
              min="1"
              max="8"
              value={form.semester}
              onChange={update("semester")}
              className="input-field"
            />
          </Field>

          <Field label="Date">
            <input
              required
              type="date"
              value={form.date}
              onChange={update("date")}
              className="input-field"
            />
          </Field>

          <Field label="Time">
            <input
              required
              type="time"
              value={form.time}
              onChange={update("time")}
              className="input-field"
            />
          </Field>

          <Field label="Exam type">
            <select
              value={form.examType}
              onChange={update("examType")}
              className="input-field"
            >
              <option value="internal1">Internal 1</option>
              <option value="internal2">Internal 2</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </Field>

          <Field label="Marks obtained">
            <input
              required
              type="number"
              min="0"
              value={form.marksObtained}
              onChange={update("marksObtained")}
              className="input-field"
            />
          </Field>

          <Field label="Total marks">
            <input
              required
              type="number"
              min="1"
              value={form.totalMarks}
              onChange={update("totalMarks")}
              className="input-field"
            />
          </Field>

          <div className="sm:col-span-2 flex gap-3 items-center">
            <button className="btn-primary">Upload marks</button>
            {saved && (
              <span className="text-sm text-cyan-500">
                ✓ Marks uploaded successfully.
              </span>
            )}
          </div>
        </form>
      )}

      {/* ── Edit Tab ── */}
      {tab === "edit" && (
        <div>
          {/* Search bar */}
          <div className="mb-4 max-w-sm">
            <input
              type="text"
              placeholder="Search by student, subject or exam type…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="input-field"
            />
          </div>

          {editSaved && (
            <div className="mb-4 inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Marks updated successfully.
            </div>
          )}

          <div className="card-surface overflow-x-auto">
            {filteredMarks.length === 0 ? (
              <p className="text-center text-slate-400 py-12">
                {allMarks.length === 0
                  ? "No marks records yet. Upload marks first."
                  : "No records match your search."}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100 dark:border-white/5">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Exam Type</th>
                    <th className="py-3 px-4">Marks</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredMarks.map((record) => {
                    const isEditing = editingId === record.id;
                    const pct = Math.round(
                      (record.marksObtained / record.totalMarks) * 100
                    );
                    const pctColor =
                      pct >= 75
                        ? "text-emerald-600 dark:text-emerald-400"
                        : pct >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-500 dark:text-red-400";

                    return (
                      <tr
                        key={record.id}
                        className={`transition-colors ${
                          isEditing
                            ? "bg-indigo-50 dark:bg-indigo-900/10"
                            : "hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {/* Student */}
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-200">
                          {studentName(record.studentId)}
                        </td>

                        {/* Subject */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <select
                              value={editForm.course}
                              onChange={editUpdate("course")}
                              className="input-field !py-1 !px-2 text-xs"
                            >
                              {COURSES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.code}
                                </option>
                              ))}
                              <option value={editForm.course}>
                                {editForm.course}
                              </option>
                            </select>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-300">
                              {record.course}
                            </span>
                          )}
                        </td>

                        {/* Exam Type */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <select
                              value={editForm.examType}
                              onChange={editUpdate("examType")}
                              className="input-field !py-1 !px-2 text-xs"
                            >
                              <option value="internal1">Internal 1</option>
                              <option value="internal2">Internal 2</option>
                              <option value="quiz">Quiz</option>
                              <option value="assignment">Assignment</option>
                            </select>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                              {EXAM_LABELS[record.examType] || record.examType}
                            </span>
                          )}
                        </td>

                        {/* Marks */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                max={editForm.totalMarks || 100}
                                value={editForm.marksObtained}
                                onChange={editUpdate("marksObtained")}
                                className="input-field !py-1 !px-2 text-xs w-16"
                                placeholder="Got"
                              />
                              <span className="text-slate-400 text-xs">/</span>
                              <input
                                type="number"
                                min="1"
                                value={editForm.totalMarks}
                                onChange={editUpdate("totalMarks")}
                                className="input-field !py-1 !px-2 text-xs w-16"
                                placeholder="Max"
                              />
                            </div>
                          ) : (
                            <span className={`font-semibold ${pctColor}`}>
                              {record.marksObtained} / {record.totalMarks}
                              <span className="text-xs font-normal text-slate-400 ml-1">
                                ({pct}%)
                              </span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button
                                disabled={
                                  saving ||
                                  !editForm.marksObtained ||
                                  !editForm.totalMarks
                                }
                                onClick={() => saveEdit(record.id)}
                                className="btn-primary !py-1 !px-3 text-xs disabled:opacity-40"
                              >
                                {saving ? "Saving…" : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(record)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FacultyMarks;
