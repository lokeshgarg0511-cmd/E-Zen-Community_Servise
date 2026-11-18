import React, { useState, useEffect } from "react";
import {
  MdAssignmentTurnedIn,
  MdCheckCircle,
  MdCancel,
  MdInfoOutline,
  MdAccessTime,
  MdSearch,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { attendanceCorrectionApi } from "../../services/mockApi";

const AdminCorrections = () => {
  const { user } = useAuth();
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [processingId, setProcessingId] = useState(null);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    loadCorrections();
  }, []);

  const loadCorrections = async () => {
    setLoading(true);
    const list = await attendanceCorrectionApi.getCorrections();
    setCorrections(list);
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    setProcessingId(id);
    await attendanceCorrectionApi.reviewCorrection({
      id,
      status,
      comment: reviewComment,
      reviewerName: user?.fullName || "Administrator",
    });
    setProcessingId(null);
    setReviewComment("");
    loadCorrections();
  };

  const filtered = corrections.filter((c) => (activeTab === "all" ? true : c.status === activeTab));

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-white">Attendance Modification Approvals</h1>
              <span className="badge-purple text-xs">ADMINISTRATIVE OVERSIGHT</span>
            </div>
            <p className="text-xs text-slate-400">
              Review and sign off on faculty attendance adjustments submitted beyond the 30-day self-correction window.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "pending"
                  ? "bg-[#00E5FF] text-[#06030C]"
                  : "bg-white/[0.04] text-slate-400 hover:text-white"
              }`}
            >
              Pending ({corrections.filter((c) => c.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "approved"
                  ? "bg-[#00E5FF] text-[#06030C]"
                  : "bg-white/[0.04] text-slate-400 hover:text-white"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "all"
                  ? "bg-[#00E5FF] text-[#06030C]"
                  : "bg-white/[0.04] text-slate-400 hover:text-white"
              }`}
            >
              All Records
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filtered.length ? (
            filtered.map((corr) => (
              <div
                key={corr.id}
                className="card-surface p-5 sm:p-6 border border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base text-white">{corr.studentName}</span>
                      <span className="badge-cyan text-[10px]">{corr.courseOrSubject}</span>
                      {corr.isOlderThan30Days && (
                        <span className="badge bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px]">
                          &gt;30 Days Old
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Requested by: <strong className="text-slate-200">{corr.requestedBy}</strong> &middot; Lecture Date:{" "}
                      {new Date(corr.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Requested Adjustment:</span>
                    <span className="badge bg-rose-500/15 text-rose-300 border border-rose-500/30 capitalize">
                      {corr.originalStatus}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 capitalize font-bold">
                      {corr.requestedStatus}
                    </span>
                  </div>
                </div>

                {/* Reason & Comments */}
                <div className="text-xs bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                  <p className="font-semibold text-slate-300 mb-1">Faculty Justification Reason:</p>
                  <p className="text-slate-400 italic">"{corr.reason}"</p>
                  {corr.adminComment && (
                    <p className="text-[11px] text-[#00E5FF] mt-2 pt-2 border-t border-white/5">
                      Admin Note: {corr.adminComment}
                    </p>
                  )}
                </div>

                {/* Actions (if pending) */}
                {corr.status === "pending" && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Optional administrative comment / authorization reference..."
                      value={processingId === corr.id ? reviewComment : ""}
                      onChange={(e) => {
                        setProcessingId(corr.id);
                        setReviewComment(e.target.value);
                      }}
                      className="input-field text-xs flex-1"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(corr.id, "approved")}
                        className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5"
                      >
                        <MdCheckCircle size={15} /> Approve &amp; Update Record
                      </button>
                      <button
                        onClick={() => handleAction(corr.id, "rejected")}
                        className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1 text-rose-400 hover:text-rose-300"
                      >
                        <MdCancel size={15} /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card-surface p-12 text-center text-slate-400 text-xs border border-white/10">
              No correction requests found in this category.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCorrections;
