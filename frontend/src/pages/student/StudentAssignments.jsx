import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Badge from "../../components/Badge";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../services/mockApi";

const StudentAssignments = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [uploading, setUploading] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    studentApi.getDashboard(user.id).then(setData);
  }, [user.id]);

  const chooseFile = (assignmentId) => {
    inputRef.current.dataset.assignmentId = assignmentId;
    inputRef.current.click();
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    const assignmentId = event.target.dataset.assignmentId;
    if (!file || !assignmentId) return;
    setUploading(assignmentId);

    // Read file as DataURL so faculty can preview / download it later
    const fileData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

    await studentApi.submitAssignment(assignmentId, user.id, file.name, fileData);
    setData(await studentApi.getDashboard(user.id));
    setUploading(null);
    event.target.value = "";
  };

  return (
    <DashboardLayout role="student">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Assignments</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Submission timeliness contributes 30% to your composite score.</p>

      <div className="space-y-3">
        <input ref={inputRef} onChange={upload} type="file" accept=".pdf,.doc,.docx,.zip" className="hidden" />
        {data?.assignments.map((a) => (
          <div key={a.id} className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-slate-800 dark:text-white">{a.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{a.course} &middot; due {new Date(a.dueDate).toLocaleDateString()}</p>
              {a.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{a.description}</p>}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge status={a.status} />

              {/* Faculty-awarded marks chip */}
              {a.marks !== null && a.marks !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  Marks: {a.marks} / {a.totalMarks ?? 100}
                </span>
              )}

              {a.status !== "submitted" && (
                <button onClick={() => chooseFile(a.id)} disabled={uploading === a.id} className="btn-primary text-xs py-2">
                  {uploading === a.id ? "Uploading…" : "Upload"}
                </button>
              )}
            </div>
          </div>
        ))}
        {data && data.assignments.length === 0 && (
          <p className="text-center text-slate-400 py-10">No assignments yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
