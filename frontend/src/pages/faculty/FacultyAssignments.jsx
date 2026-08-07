import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { facultyApi, studentApi } from "../../services/mockApi";
import { COURSES } from "../../services/seedData";

// ─── File preview helpers ────────────────────────────────────────────────────
const FILE_KEY = (assignmentId, studentId) =>
  `spms_file_${assignmentId}_${studentId}`;


const getStoredFile = (assignmentId, studentId) => {
  try {
    return localStorage.getItem(FILE_KEY(assignmentId, studentId)) || null;
  } catch {
    return null;
  }
};

const viewFile = (assignmentId, studentId, fileName) => {
  const dataUrl = getStoredFile(assignmentId, studentId);
  if (!dataUrl) return;
  const win = window.open("", "_blank");
  if (!win) return;
  // For PDFs show inline; for other types trigger download via an anchor
  if (dataUrl.startsWith("data:application/pdf")) {
    win.document.write(
      `<iframe src="${dataUrl}" style="width:100%;height:100vh;border:none;"></iframe>`
    );
  } else {
    win.document.write(
      `<body style="margin:0;display:flex;align-items:center;justify-content:center;background:#111;min-height:100vh;">
        <img src="${dataUrl}" alt="${fileName}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
      </body>`
    );
  }
};

const downloadFile = (assignmentId, studentId, fileName) => {
  const dataUrl = getStoredFile(assignmentId, studentId);
  if (!dataUrl) return;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.click();
};
// ─────────────────────────────────────────────────────────────────────────────

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  // gradeInputs keyed by `${assignmentId}_${studentId}` → { marks, totalMarks }
  const [gradeInputs, setGradeInputs] = useState({});
  const [savingGrade, setSavingGrade] = useState(null); // key of submission being saved
  // editingGrades: Set of gradeKeys currently being re-edited after already graded
  const [editingGrades, setEditingGrades] = useState(new Set());

  const initial = {
    title: "",
    subject: COURSES[0].code,
    customSubject: "",
    className: "CSE-A",
    semester: "5",
    date: "",
    time: "",
    description: "",
  };
  const [form, setForm] = useState(initial);
  const [creating, setCreating] = useState(false);

  const load = () => facultyApi.listAssignments().then(setAssignments);

  useEffect(() => {
    load();
    studentApi
      .listAll()
      .then((list) =>
        setStudents([...list].sort((a, b) => a.fullName.localeCompare(b.fullName)))
      );
  }, []);

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const subject =
    form.subject === "other" ? form.customSubject.trim() : form.subject;

  const create = async (event) => {
    event.preventDefault();
    if (!subject) return;
    setCreating(true);
    await facultyApi.createAssignment({
      title: form.title,
      course: subject,
      className: form.className,
      semester: Number(form.semester),
      date: form.date,
      time: form.time,
      dueDate: `${form.date}T${form.time}`,
      description: form.description,
      studentIds: students.map((s) => s.id),
    });
    setForm(initial);
    setCreating(false);
    load();
  };

  const setStatus = async (assignmentId, studentId, status) => {
    await facultyApi.updateSubmission(assignmentId, studentId, status);
    load();
  };

  // Save marks for a submission
  const saveGrade = async (assignmentId, studentId) => {
    const key = `${assignmentId}_${studentId}`;
    const { marks, totalMarks } = gradeInputs[key] || {};
    if (marks === undefined || marks === "" || !totalMarks) return;
    setSavingGrade(key);
    await facultyApi.setAssignmentMarks(assignmentId, studentId, marks, totalMarks);
    setSavingGrade(null);
    // Clear editing state after successful save
    setEditingGrades((prev) => { const next = new Set(prev); next.delete(key); return next; });
    setGradeInputs((prev) => { const next = { ...prev }; delete next[key]; return next; });
    load();
  };

  const updateGradeInput = (assignmentId, studentId, field, value) => {
    const key = `${assignmentId}_${studentId}`;
    setGradeInputs((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), [field]: value } }));
  };

  // Enter edit mode for an already-graded submission
  const startEditGrade = (assignmentId, studentId, existingMarks, existingTotal) => {
    const key = `${assignmentId}_${studentId}`;
    setGradeInputs((prev) => ({ ...prev, [key]: { marks: String(existingMarks), totalMarks: String(existingTotal) } }));
    setEditingGrades((prev) => new Set([...prev, key]));
  };

  // Cancel editing and revert to graded view
  const cancelEditGrade = (assignmentId, studentId) => {
    const key = `${assignmentId}_${studentId}`;
    setEditingGrades((prev) => { const next = new Set(prev); next.delete(key); return next; });
    setGradeInputs((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  return (
    <DashboardLayout role="faculty">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">
        Assignments
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Create assignments and review student submissions and uploaded documents.
      </p>

      {/* ── Create Assignment Form ─────────────────────────────────────────── */}
      <form
        onSubmit={create}
        className="card-surface p-5 grid sm:grid-cols-2 gap-4 mb-6"
      >
        <input
          required
          placeholder="Assignment title"
          value={form.title}
          onChange={update("title")}
          className="input-field sm:col-span-2"
        />
        <select
          value={form.subject}
          onChange={update("subject")}
          className="input-field"
        >
          {COURSES.map((course) => (
            <option key={course.code} value={course.code}>
              {course.code} — {course.name}
            </option>
          ))}
          <option value="other">Other / Type subject</option>
        </select>

        {form.subject === "other" && (
          <input
            required
            placeholder="Type subject"
            value={form.customSubject}
            onChange={update("customSubject")}
            className="input-field"
          />
        )}

        <input
          required
          placeholder="Class"
          value={form.className}
          onChange={update("className")}
          className="input-field"
        />
        <input
          required
          type="number"
          min="1"
          max="8"
          placeholder="Semester"
          value={form.semester}
          onChange={update("semester")}
          className="input-field"
        />
        <input
          required
          type="date"
          value={form.date}
          onChange={update("date")}
          className="input-field"
        />
        <input
          required
          type="time"
          value={form.time}
          onChange={update("time")}
          className="input-field"
        />
        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={update("description")}
          className="input-field sm:col-span-2"
          rows={3}
        />
        <button disabled={creating} className="btn-primary sm:col-span-2 w-fit">
          {creating ? "Creating…" : "Create assignment"}
        </button>
      </form>

      {/* ── Assignment List ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="card-surface p-5">
            {/* Assignment header */}
            <div className="mb-3">
              <p className="font-display font-semibold text-slate-800 dark:text-white">
                {assignment.title}
              </p>
              <p className="text-xs text-slate-400">
                {assignment.course} ·{" "}
                {assignment.className || "Class not specified"} · Semester{" "}
                {assignment.semester || "—"} · due{" "}
                {new Date(assignment.dueDate).toLocaleString()}
              </p>
            </div>

            {/* Submissions table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase">
                    <th className="py-2 pr-4">Student</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Submitted File</th>
                    <th className="py-2 pr-4">Marks</th>
                    <th className="py-2">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {assignment.submissions.map((submission) => {
                    const student = students.find(
                      (item) => item.id === submission.studentId
                    );
                    const hasFile =
                      submission.fileName &&
                      getStoredFile(assignment.id, submission.studentId) !== null;
                    const gradeKey = `${assignment.id}_${submission.studentId}`;
                    const inputVal = gradeInputs[gradeKey] || {};
                    const isSaving = savingGrade === gradeKey;
                    const isGraded = submission.marks != null && submission.totalMarks != null;

                    return (
                      <tr key={submission.studentId}>
                        {/* Student name */}
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 font-medium">
                          {student?.fullName || submission.studentId}
                        </td>

                        {/* Submission status badge */}
                        <td className="py-3 pr-4">
                          <Badge status={submission.status} />
                        </td>

                        {/* ── Submitted File column ──────────────────────── */}
                        <td className="py-3 pr-4">
                          {submission.fileName ? (
                            <div className="flex flex-col gap-1 min-w-0">
                              {/* Filename + timestamp */}
                              <span
                                className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 text-xs font-medium truncate max-w-[180px]"
                                title={submission.fileName}
                              >
                                <svg
                                  className="w-3.5 h-3.5 shrink-0 text-indigo-500"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                {submission.fileName}
                              </span>

                              {submission.submittedAt && (
                                <span className="text-[10px] text-slate-400">
                                  {new Date(submission.submittedAt).toLocaleString()}
                                </span>
                              )}

                              {/* View / Download buttons (only if file data is stored) */}
                              {hasFile && (
                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={() =>
                                      viewFile(
                                        assignment.id,
                                        submission.studentId,
                                        submission.fileName
                                      )
                                    }
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </svg>
                                    View
                                  </button>
                                  <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                  <button
                                    onClick={() =>
                                      downloadFile(
                                        assignment.id,
                                        submission.studentId,
                                        submission.fileName
                                      )
                                    }
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                      />
                                    </svg>
                                    Download
                                  </button>
                                </div>
                              )}

                              {/* File was submitted in a previous session without FileReader support */}
                              {!hasFile && (
                                <span className="text-[10px] text-amber-500 italic">
                                  Preview unavailable (submitted before update)
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>

                        {/* ── Marks / Grading column ─────────────────────── */}
                        <td className="py-3 pr-4">
                          {isGraded && !editingGrades.has(gradeKey) ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                {submission.marks} / {submission.totalMarks}
                                <span className="text-xs font-normal text-slate-400 ml-1">
                                  ({Math.round((submission.marks / submission.totalMarks) * 100)}%)
                                </span>
                              </span>
                              {/* Allow re-grading */}
                              <button
                                onClick={() => startEditGrade(assignment.id, submission.studentId, submission.marks, submission.totalMarks)}
                                className="text-[10px] text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-left"
                              >
                                ✏️ Edit marks
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <input
                                type="number"
                                min="0"
                                max={inputVal.totalMarks || 100}
                                placeholder="Got"
                                value={inputVal.marks ?? ""}
                                onChange={(e) => updateGradeInput(assignment.id, submission.studentId, "marks", e.target.value)}
                                className="input-field !py-1 !px-2 text-xs w-16"
                              />
                              <span className="text-slate-400 text-xs">/</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="Max"
                                value={inputVal.totalMarks ?? ""}
                                onChange={(e) => updateGradeInput(assignment.id, submission.studentId, "totalMarks", e.target.value)}
                                className="input-field !py-1 !px-2 text-xs w-16"
                              />
                              <button
                                disabled={isSaving || inputVal.marks === undefined || inputVal.marks === "" || !inputVal.totalMarks}
                                onClick={() => saveGrade(assignment.id, submission.studentId)}
                                className="btn-primary !py-1 !px-2 text-xs disabled:opacity-40"
                              >
                                {isSaving ? "…" : isGraded ? "Update" : "Save"}
                              </button>
                              {isGraded && (
                                <button
                                  onClick={() => cancelEditGrade(assignment.id, submission.studentId)}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Status dropdown */}
                        <td className="py-3">
                          <select
                            value={submission.status}
                            onChange={(event) =>
                              setStatus(
                                assignment.id,
                                submission.studentId,
                                event.target.value
                              )
                            }
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

        {assignments.length === 0 && (
          <p className="text-center text-slate-400 py-10">No assignments yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;
