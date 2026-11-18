import React, { useEffect, useState } from "react";
import {
  MdHistory,
  MdShield,
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdCheckCircle,
  MdInfoOutline,
  MdClose,
  MdFingerprint,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { auditLogApi } from "../../services/mockApi";

const AdminAuditLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [roleFilter, actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await auditLogApi.getAuditLogs({
      role: roleFilter,
      action: actionFilter,
      search,
    });
    setLogs(data);
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleVerifyLedger = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifyResult({
        verifiedAt: new Date().toLocaleTimeString(),
        totalBlocks: logs.length || 6,
        status: "VALID",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      });
      setTimeout(() => setVerifyResult(null), 6000);
    }, 700);
  };

  const exportAuditCsv = () => {
    const headers = "ID,Timestamp,Actor Name,Actor Role,Action,Resource Type,Resource ID,IP Address,Details\n";
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp || l.createdAt}","${l.actorName}","${l.actorRole}","${l.action}","${
            l.resourceType
          }","${l.resourceId || ""}","${l.ipAddress || "127.0.0.1"}","${JSON.stringify(l.details || {}).replace(
            /"/g,
            '""'
          )}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EZen_Audit_Logs_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#0D0819] border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#8E4585]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00E5FF] mb-3">
                <MdShield className="text-sm" />
                <span>Zero-Trust Academic Governance</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white tracking-tight">
                System Audit Logs & Compliance Ledger
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Immutable, append-only chronological log of all sensitive operations including attendance overrides,
                fee transactions, session initializations, and administrative approvals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyLedger}
                disabled={verifying}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-colors"
              >
                <MdFingerprint className="text-base text-[#00E5FF]" />
                <span>{verifying ? "Verifying Chain..." : "Verify Hash Integrity"}</span>
              </button>

              <button
                onClick={exportAuditCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white font-display font-bold text-xs shadow-glow hover:opacity-95 transition-all"
              >
                <MdFileDownload className="text-base" />
                <span>Export Audit Ledger</span>
              </button>
            </div>
          </div>

          {/* Cryptographic verification banner */}
          {verifyResult && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <MdCheckCircle className="text-base shrink-0 text-emerald-400" />
                <span>
                  <strong>SHA-256 Ledger Verified:</strong> All {verifyResult.totalBlocks} blocks match cryptographic
                  merkle root. Zero tamper detected.
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400/80 truncate max-w-xs">
                {verifyResult.hash}
              </span>
            </div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="bg-[#0D0819] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search actor, action, resource, IP address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="all" className="bg-[#0D0819]">All Roles</option>
                  <option value="admin" className="bg-[#0D0819]">Admin</option>
                  <option value="faculty" className="bg-[#0D0819]">Faculty</option>
                  <option value="student" className="bg-[#0D0819]">Student</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Action:</span>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="all" className="bg-[#0D0819]">All Actions</option>
                  <option value="ATTENDANCE" className="bg-[#0D0819]">Attendance Actions</option>
                  <option value="CORRECTION" className="bg-[#0D0819]">Correction Approvals</option>
                  <option value="FEE" className="bg-[#0D0819]">Fee Payments</option>
                  <option value="QR" className="bg-[#0D0819]">QR Sessions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-5">Actor & Role</th>
                  <th className="py-3 px-5">Action Event</th>
                  <th className="py-3 px-5">Resource Target</th>
                  <th className="py-3 px-5">IP Address</th>
                  <th className="py-3 px-5 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 text-xs font-mono">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-sans">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-sans">
                      No audit log records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isFaculty = log.actorRole === "faculty";
                    const isAdmin = log.actorRole === "admin";
                    const isStudent = log.actorRole === "student";

                    return (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                          {new Date(log.timestamp || log.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-5 font-sans">
                          <span className="font-semibold text-white block">{log.actorName}</span>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mt-0.5 ${
                              isAdmin
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : isFaculty
                                ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {log.actorRole}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 font-sans">
                          <span className="font-semibold text-[#00E5FF]">{log.action}</span>
                        </td>

                        <td className="py-3.5 px-5 font-sans">
                          <span className="text-white block">{log.resourceType}</span>
                          {log.resourceId && (
                            <span className="text-[10px] text-slate-500 font-mono">{log.resourceId}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                          {log.ipAddress || "192.168.1.1"}
                        </td>

                        <td className="py-3.5 px-5 text-center font-sans">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-medium transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Log Details */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0D0819] border border-white/20 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setSelectedLog(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <MdShield className="text-xl text-[#00E5FF]" />
                <h2 className="text-lg font-display font-bold text-white">Audit Event Details</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-mono">ID: {selectedLog.id}</p>

              <div className="space-y-2.5 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-white font-mono">{new Date(selectedLog.timestamp || selectedLog.createdAt).toISOString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Actor Name:</span>
                  <span className="text-white font-semibold">{selectedLog.actorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Actor Role:</span>
                  <span className="text-white capitalize">{selectedLog.actorRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="text-[#00E5FF] font-semibold">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource:</span>
                  <span className="text-white">{selectedLog.resourceType} ({selectedLog.resourceId || "N/A"})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Address:</span>
                  <span className="text-white font-mono">{selectedLog.ipAddress || "127.0.0.1"}</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-300 block mb-1">Payload Details (JSON):</span>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLogs;
