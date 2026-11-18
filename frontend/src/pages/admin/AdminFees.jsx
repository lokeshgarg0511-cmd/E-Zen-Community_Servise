import React, { useEffect, useState } from "react";
import {
  MdPayment,
  MdReceipt,
  MdCheckCircle,
  MdWarning,
  MdSearch,
  MdFileDownload,
  MdAdd,
  MdClose,
  MdAttachMoney,
  MdAccountBalance,
  MdTrendingUp,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { feeApi, auditLogApi } from "../../services/mockApi";

const AdminFees = () => {
  const { user } = useAuth();
  const instType = user?.institutionType || "college";
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [offlineForm, setOfflineForm] = useState({
    studentId: "",
    amount: "",
    method: "Bank Demand Draft",
    referenceNote: "",
  });
  const [recording, setRecording] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    setLoading(true);
    const records = await feeApi.getAllFees();
    setFeeRecords(records);
    if (records.length > 0 && !offlineForm.studentId) {
      setOfflineForm((prev) => ({ ...prev, studentId: records[0].studentId }));
    }
    setLoading(false);
  };

  // Metrics computation
  const totalAssessed = feeRecords.reduce((sum, r) => sum + (r.totalAssessed || 0), 0);
  const totalPaid = feeRecords.reduce((sum, r) => sum + (r.totalPaid || 0), 0);
  const totalPending = feeRecords.reduce((sum, r) => sum + (r.totalPending || 0), 0);
  const collectionRate = totalAssessed > 0 ? Math.round((totalPaid / totalAssessed) * 100) : 0;

  // Filtered records
  const filtered = feeRecords.filter((rec) => {
    const isPaid = (rec.totalPending || 0) === 0;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && isPaid) ||
      (statusFilter === "pending" && !isPaid);

    const matchSearch =
      rec.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      rec.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      rec.semesterOrClass?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const handleRecordOffline = async (e) => {
    e.preventDefault();
    const amt = Number(offlineForm.amount);
    if (!amt || amt <= 0) return;

    setRecording(true);
    const res = await feeApi.payFee({
      studentId: offlineForm.studentId,
      amount: amt,
      method: offlineForm.method,
    });

    if (res.success) {
      await auditLogApi.logAction({
        actorName: user?.fullName || "Administrator",
        actorRole: "admin",
        action: "OFFLINE_FEE_RECORDED",
        resourceType: "Fee",
        resourceId: res.receiptId,
        details: {
          studentId: offlineForm.studentId,
          amount: amt,
          method: offlineForm.method,
          note: offlineForm.referenceNote,
        },
      });

      await loadFees();
      setRecording(false);
      setRecordModalOpen(false);
      setOfflineForm({
        studentId: feeRecords[0]?.studentId || "",
        amount: "",
        method: "Bank Demand Draft",
        referenceNote: "",
      });
      setSuccessToast(`Offline payment of ₹${amt.toLocaleString()} recorded with Receipt #${res.receiptId}.`);
      setTimeout(() => setSuccessToast(""), 4000);
    } else {
      setRecording(false);
    }
  };

  const exportCsv = () => {
    const headers = "Student ID,Student Name,Cohort/Class,Total Assessed (INR),Total Paid (INR),Pending Balance (INR),Status\n";
    const rows = feeRecords
      .map(
        (r) =>
          `"${r.studentId}","${r.studentName}","${r.semesterOrClass}",${r.totalAssessed},${r.totalPaid},${r.totalPending},"${
            r.totalPending === 0 ? "Paid in Full" : "Outstanding"
          }"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EZen_Fee_Ledger_${new Date().toISOString().split("T")[0]}.csv`;
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
                <MdAccountBalance className="text-sm" />
                <span>Institutional Finance & Accounts</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-white tracking-tight">
                Fee Management & Collection Ledger
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Comprehensive overview of assessed tuition, hostel, lab, and examination fee collections across
                enrolled students with real-time audit logging.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-colors"
              >
                <MdFileDownload className="text-base text-[#00E5FF]" />
                <span>Export Ledger CSV</span>
              </button>

              <button
                onClick={() => setRecordModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white font-display font-bold text-xs shadow-glow hover:opacity-95 transition-all"
              >
                <MdAdd className="text-base" />
                <span>Record Offline Payment</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="text-xs text-slate-400 font-medium block">Total Assessed</span>
              <span className="text-xl lg:text-2xl font-display font-extrabold text-white mt-1 block">
                ₹{totalAssessed.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Current Academic Term</span>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="text-xs text-slate-400 font-medium block">Total Realized</span>
              <span className="text-xl lg:text-2xl font-display font-extrabold text-emerald-400 mt-1 block">
                ₹{totalPaid.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-500/80 mt-1 block">Direct UPI & NEFT verified</span>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="text-xs text-slate-400 font-medium block">Outstanding Dues</span>
              <span className="text-xl lg:text-2xl font-display font-extrabold text-amber-400 mt-1 block">
                ₹{totalPending.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-500/80 mt-1 block">Unpaid / Term installments</span>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium block">Realization Rate</span>
                <span className="text-xs font-bold text-[#00E5FF]">{collectionRate}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00E5FF] to-[#8E4585] h-full rounded-full transition-all duration-500"
                  style={{ width: `${collectionRate}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">Benchmark target: 80%</span>
            </div>
          </div>
        </div>

        {/* Toast */}
        {successToast && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <MdCheckCircle className="text-base shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Table & Filters */}
        <div className="bg-[#0D0819] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search student name, roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "all"
                    ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                All Records ({feeRecords.length})
              </button>
              <button
                onClick={() => setStatusFilter("paid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "paid"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                Paid in Full
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "pending"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                Pending Dues
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-5">Cohort / Term</th>
                  <th className="py-3 px-5 text-right">Assessed (₹)</th>
                  <th className="py-3 px-5 text-right">Paid (₹)</th>
                  <th className="py-3 px-5 text-right">Pending Balance (₹)</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      Loading fee records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No matching student fee records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rec) => {
                    const isPaid = (rec.totalPending || 0) === 0;

                    return (
                      <tr key={rec.studentId} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="font-semibold text-white block">{rec.studentName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{rec.studentId}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-slate-300 font-medium">{rec.semesterOrClass}</span>
                          <span className="text-[10px] text-slate-500 block">{rec.academicYear}</span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-medium text-white">
                          ₹{(rec.totalAssessed || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-right font-medium text-emerald-400">
                          ₹{(rec.totalPaid || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-amber-400">
                          ₹{(rec.totalPending || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <MdCheckCircle className="text-xs" />
                              <span>Paid in Full</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <MdWarning className="text-xs" />
                              <span>Dues Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button
                            onClick={() => setSelectedStudent(rec)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-[11px] font-semibold transition-colors"
                          >
                            Inspect Invoices
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

        {/* Modal: Record Offline Payment */}
        {recordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0D0819] border border-white/20 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setRecordModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-0.5">
                  <div className="w-full h-full bg-[#0D0819] rounded-[6px] flex items-center justify-center text-[#00E5FF]">
                    <MdReceipt />
                  </div>
                </div>
                <h2 className="text-lg font-display font-bold text-white">Record Offline Payment</h2>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                Log offline student payments received via Demand Draft, Cashier Desk, or NEFT Challan.
              </p>

              <form onSubmit={handleRecordOffline} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Student *</label>
                  <select
                    value={offlineForm.studentId}
                    onChange={(e) => setOfflineForm({ ...offlineForm, studentId: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    {feeRecords.map((r) => (
                      <option key={r.studentId} value={r.studentId} className="bg-[#0D0819]">
                        {r.studentName} ({r.studentId}) - Due: ₹{(r.totalPending || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Paid (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 25000"
                    value={offlineForm.amount}
                    onChange={(e) => setOfflineForm({ ...offlineForm, amount: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={offlineForm.method}
                    onChange={(e) => setOfflineForm({ ...offlineForm, method: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="Bank Demand Draft" className="bg-[#0D0819]">Bank Demand Draft (DD)</option>
                    <option value="Cash Deposit" className="bg-[#0D0819]">Cashier Desk Deposit</option>
                    <option value="Bank NEFT / RTGS" className="bg-[#0D0819]">Bank NEFT / RTGS Transfer</option>
                    <option value="Scholarship Adjustment" className="bg-[#0D0819]">Scholarship Fee Concession</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DD / Transaction Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. DD #892182 SBI Main Branch"
                    value={offlineForm.referenceNote}
                    onChange={(e) => setOfflineForm({ ...offlineForm, referenceNote: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setRecordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recording}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00E5FF] to-[#8E4585] text-white shadow-glow hover:opacity-95 transition-opacity"
                  >
                    {recording ? "Recording..." : "Record Payment & Generate Receipt"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Student Invoices & Transactions */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#0D0819] border border-white/20 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>

              <h2 className="text-lg font-display font-bold text-white mb-1">
                Fee Details: {selectedStudent.studentName}
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Roll ID: {selectedStudent.studentId} • Cohort: {selectedStudent.semesterOrClass}
              </p>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Assessed</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    ₹{(selectedStudent.totalAssessed || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Paid</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                    ₹{(selectedStudent.totalPaid || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Pending Dues</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                    ₹{(selectedStudent.totalPending || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Assessed Fee Line Items
              </h3>
              <div className="space-y-2 mb-5">
                {selectedStudent.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-white font-medium block">{item.title}</span>
                      <span className="text-[10px] text-slate-400">Due Date: {item.dueDate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-semibold block">₹{item.amount?.toLocaleString()}</span>
                      <span
                        className={`text-[10px] uppercase font-bold ${
                          item.status === "paid" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Transaction History
              </h3>
              {selectedStudent.transactions?.length > 0 ? (
                <div className="space-y-2">
                  {selectedStudent.transactions.map((tx) => (
                    <div
                      key={tx.txnId}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-white font-medium block">
                          Receipt #{tx.receiptId || tx.txnId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tx.method} • {new Date(tx.paidAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        +₹{tx.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No online transactions logged yet.</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
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

export default AdminFees;
