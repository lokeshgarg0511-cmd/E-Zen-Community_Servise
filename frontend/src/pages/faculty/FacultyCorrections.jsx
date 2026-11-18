import React, { useState, useEffect } from "react";
import {
  MdAssignmentTurnedIn,
  MdAdd,
  MdCheckCircle,
  MdAccessTime,
  MdCancel,
  MdHistory,
  MdClose,
  MdInfoOutline,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { attendanceCorrectionApi, studentApi } from "../../services/mockApi";

const FacultyCorrections = () => {
  const { user } = useAuth();
  const [corrections, setCorrections] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Form State
  const [studentId, setStudentId] = useState("");
  const [courseOrSubject, setCourseOrSubject] = useState("CS301");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [originalStatus, setOriginalStatus] = useState("absent");
  const [requestedStatus, setRequestedStatus] = useState("present");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [corrList, studList] = await Promise.all([
      attendanceCorrectionApi.getCorrections(),
      studentApi.listStudents(),
    ]);
    setCorrections(corrList);
    setStudents(studList);
    if (studList.length > 0) setStudentId(studList[0].id);
    setLoading(false);
  };

  const calculateDaysAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmitting(true);
    setMessage(null);

    const selectedStudent = students.find((s) => s.id === studentId);

    const res = await attendanceCorrectionApi.requestCorrection({
      studentId,
      studentName: selectedStudent?.fullName || studentId,
      courseOrSubject,
      date: recordDate,
      originalStatus,
      requestedStatus,
      reason,
      requestedBy: user?.email || "Faculty Member",
    });

    setSubmitting(false);
    setMessage(res);
    setModalOpen(false);
    loadData();
  };

  const daysDiff = calculateDaysAgo(recordDate);
  const isOver30Days = daysDiff > 30;

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-white">Attendance Corrections</h1>
              <span className="badge-purple text-xs">30-DAY GOVERNANCE</span>
            </div>
            <p className="text-xs text-slate-400">
              Direct faculty edits permitted within 30 days. Corrections older than 30 days require administrative approval.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-1.5 shrink-0"
          >
            <MdAdd size={18} /> Request Correction
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
              message.success
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
            }`}
          >
            <MdCheckCircle size={18} className="shrink-0 text-emerald-400" />
            <span>{message.message}</span>
          </div>
        )}

        {/* Policy Highlight Banner */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 text-xs text-slate-300">
          <MdInfoOutline size={20} className="text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Institutional Attendance Modification Policy:</p>
            <p className="text-slate-400 leading-relaxed">
              • <strong>0 to 30 Days:</strong> Faculty may directly correct erroneous absences with justification.<br />
              • <strong>Beyond 30 Days:</strong> Submitted to the Dean or Principal for formal administrative review and audit signoff.
            </p>
          </div>
        </div>

        {/* Correction History Table */}
        <div className="card-surface p-6 border border-white/10">
          <h2 className="font-display font-bold text-base text-white mb-4">Correction Request History</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Adjustment</th>
                  <th className="pb-3">Reason / Justification</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {corrections.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-semibold text-white">{item.studentName}</td>
                    <td className="py-3 text-[#00E5FF] font-medium">{item.courseOrSubject}</td>
                    <td className="py-3 text-slate-400">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="capitalize text-rose-400 line-through mr-1.5">{item.originalStatus}</span>
                      <span className="capitalize text-emerald-400 font-bold">{item.requestedStatus}</span>
                    </td>
                    <td className="py-3 max-w-xs text-slate-300 truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-3">
                      {item.status === "approved" && (
                        <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Approved
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="badge bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Pending Admin
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="badge bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {item.isOlderThan30Days ? (
                        <span className="text-amber-400 font-semibold text-[11px]">&gt;30 Days</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold text-[11px]">Direct Window</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: New Correction Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-surface p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-card animate-in relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <MdClose size={20} />
            </button>

            <h3 className="font-display font-bold text-lg text-white mb-1">Submit Attendance Correction</h3>
            <p className="text-xs text-slate-400 mb-5">
              Specify student session and verifiable justification reason.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="input-field"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0D0819] text-white">
                      {s.fullName} ({s.rollNumber || s.schoolClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Subject / Course</label>
                  <input
                    type="text"
                    required
                    value={courseOrSubject}
                    onChange={(e) => setCourseOrSubject(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Date of Lecture</label>
                  <input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* 30-day indicator pill */}
              <div
                className={`p-2.5 rounded-lg border text-[11px] flex items-center gap-2 ${
                  isOver30Days
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }`}
              >
                <MdAccessTime size={16} className="shrink-0" />
                <span>
                  Date is <strong>{daysDiff} days ago</strong>:{" "}
                  {isOver30Days
                    ? "Exceeds 30 days. Requires Administrator Approval workflow."
                    : "Within 30 days. Direct faculty adjustment permitted."}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Original Status</label>
                  <select
                    value={originalStatus}
                    onChange={(e) => setOriginalStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="absent" className="bg-[#0D0819] text-white">Absent</option>
                    <option value="late" className="bg-[#0D0819] text-white">Late</option>
                    <option value="present" className="bg-[#0D0819] text-white">Present</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Corrected Status</label>
                  <select
                    value={requestedStatus}
                    onChange={(e) => setRequestedStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="present" className="bg-[#0D0819] text-white">Present</option>
                    <option value="late" className="bg-[#0D0819] text-white">Late</option>
                    <option value="absent" className="bg-[#0D0819] text-white">Absent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-1 block">Academic Reason / Proof Reference</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Attended official inter-college tech symposium with Dean's permission letter."
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full !py-2.5"
              >
                {submitting ? "Submitting..." : isOver30Days ? "Submit for Dean Approval" : "Apply Direct Correction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FacultyCorrections;
