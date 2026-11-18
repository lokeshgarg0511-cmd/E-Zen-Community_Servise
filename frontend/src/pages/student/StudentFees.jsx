import React, { useEffect, useState } from "react";
import {
  MdPayment,
  MdReceipt,
  MdCheckCircle,
  MdOutlineAccessTime,
  MdArrowForward,
  MdCreditCard,
  MdQrCode2,
  MdAccountBalance,
  MdClose,
  MdFileDownload,
} from "react-icons/md";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { feeApi } from "../../services/mockApi";

const StudentFees = () => {
  const { user } = useAuth();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [selectedItems, setSelectedItems] = useState([]);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(null);

  useEffect(() => {
    fetchFees();
  }, [user]);

  const fetchFees = async () => {
    if (!user) return;
    setLoading(true);
    const data = await feeApi.getStudentFee(user.id);
    setFeeData(data);
    setPayAmount(String(data.totalPending || 0));
    setLoading(false);
  };

  const handleOpenPay = (item = null) => {
    if (item) {
      setSelectedItems([item.id]);
      setPayAmount(String(item.amount));
    } else {
      setSelectedItems(feeData.items?.filter((i) => i.status === "pending").map((i) => i.id) || []);
      setPayAmount(String(feeData.totalPending || 0));
    }
    setPaySuccess(null);
    setPayModalOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (Number(payAmount) <= 0) return;
    setPaying(true);
    const res = await feeApi.payFee({
      studentId: user.id,
      amount: Number(payAmount),
      method: payMethod,
      itemIds: selectedItems,
    });
    setPaying(false);

    if (res.success) {
      setPaySuccess(res);
      fetchFees();
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Fees &amp; Payment Portal</h1>
            <p className="text-xs text-slate-400">
              Institutional academic fees, transaction receipts, and digital payment gateway.
            </p>
          </div>
          {feeData?.totalPending > 0 && (
            <button
              onClick={() => handleOpenPay()}
              className="btn-primary !py-2.5 !px-5 text-sm shrink-0"
            >
              <MdPayment size={18} /> Pay Outstanding (₹{feeData?.totalPending?.toLocaleString()})
            </button>
          )}
        </div>

        {/* 3 Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-surface p-5 border border-white/10">
            <p className="text-xs text-slate-400 font-medium">Total Assessed Fees</p>
            <p className="font-display font-bold text-2xl text-white mt-1">
              ₹{feeData?.totalAssessed?.toLocaleString() || "0"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{feeData?.semesterOrClass || "Academic Year 2026-27"}</p>
          </div>

          <div className="card-surface p-5 border border-emerald-500/20 bg-emerald-500/[0.02]">
            <p className="text-xs text-emerald-400 font-medium">Total Fees Paid</p>
            <p className="font-display font-bold text-2xl text-emerald-300 mt-1">
              ₹{feeData?.totalPaid?.toLocaleString() || "0"}
            </p>
            <p className="text-[11px] text-emerald-500 mt-1">Cleared with receipts</p>
          </div>

          <div className="card-surface p-5 border border-amber-500/20 bg-amber-500/[0.02]">
            <p className="text-xs text-amber-400 font-medium">Outstanding Balance</p>
            <p className="font-display font-bold text-2xl text-amber-300 mt-1">
              ₹{feeData?.totalPending?.toLocaleString() || "0"}
            </p>
            <p className="text-[11px] text-amber-500 mt-1">
              {feeData?.totalPending === 0 ? "All dues settled" : "Due within current term"}
            </p>
          </div>
        </div>

        {/* Fee Itemized Breakdown */}
        <div className="card-surface p-6 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-base text-white">Itemized Fee Assessment</h2>
              <p className="text-xs text-slate-400">Approved fee categories and scheduled due dates</p>
            </div>
            <span className="badge-cyan text-xs">Term Breakdown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="pb-3">Fee Item</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {feeData?.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-semibold text-white">{item.title}</td>
                    <td className="py-3 text-slate-400">{item.category}</td>
                    <td className="py-3 font-mono text-white">₹{item.amount?.toLocaleString()}</td>
                    <td className="py-3 text-slate-400">{item.dueDate}</td>
                    <td className="py-3">
                      {item.status === "paid" ? (
                        <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Paid
                        </span>
                      ) : (
                        <span className="badge bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {item.status === "pending" ? (
                        <button
                          onClick={() => handleOpenPay(item)}
                          className="btn-primary !py-1 !px-2.5 !text-[11px]"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <MdCheckCircle size={14} /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History & Receipts */}
        <div className="card-surface p-6 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-base text-white">Payment History &amp; Verified Receipts</h2>
              <p className="text-xs text-slate-400">Verifiable transaction IDs and downloadable receipts</p>
            </div>
            <MdReceipt className="text-[#00E5FF]" size={22} />
          </div>

          <div className="space-y-3">
            {feeData?.transactions?.length ? (
              feeData.transactions.map((txn) => (
                <div
                  key={txn.txnId}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{txn.txnId}</span>
                      <span className="badge-purple text-[10px]">{txn.method}</span>
                      <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        Successful
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Paid on: {new Date(txn.paidAt).toLocaleDateString()} at{" "}
                      {new Date(txn.paidAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-base text-white">
                      ₹{txn.amount?.toLocaleString()}
                    </span>
                    <button
                      onClick={() => alert(`Receipt #${txn.receiptId} downloaded successfully.`)}
                      className="btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1.5"
                    >
                      <MdFileDownload size={15} /> Receipt #{txn.receiptId}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs py-4 text-center">No payment transactions recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-surface p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-card animate-in relative">
            <button
              onClick={() => setPayModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <MdClose size={20} />
            </button>

            <h3 className="font-display font-bold text-lg text-white mb-1">E-Zen Payment Gateway</h3>
            <p className="text-xs text-slate-400 mb-5">
              Secure simulated payment gateway for institutional fees.
            </p>

            {paySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 mx-auto flex items-center justify-center">
                  <MdCheckCircle size={32} />
                </div>
                <h4 className="font-display font-bold text-xl text-white">Payment Successful!</h4>
                <p className="text-xs text-slate-300">
                  Transaction <strong>{paySuccess.txnId}</strong> verified. Receipt <strong>{paySuccess.receiptId}</strong> generated.
                </p>
                <button
                  onClick={() => setPayModalOpen(false)}
                  className="btn-primary w-full"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Payment Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="input-field font-mono text-lg font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "UPI", icon: MdQrCode2 },
                      { key: "Credit/Debit Card", icon: MdCreditCard },
                      { key: "Net Banking", icon: MdAccountBalance },
                    ].map(({ key, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPayMethod(key)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                          payMethod === key
                            ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]"
                            : "border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-[11px] truncate w-full text-center">{key}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {payMethod === "UPI" && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-2">
                    <p className="text-xs text-slate-300 font-semibold">Scan with Any UPI App</p>
                    <div className="w-32 h-32 mx-auto bg-white rounded-lg p-2 flex items-center justify-center">
                      <MdQrCode2 size={110} className="text-[#06030C]" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">ezen.fees@institutional.bank</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="btn-primary w-full !py-3"
                >
                  {paying ? "Processing Transaction..." : `Confirm & Pay ₹${Number(payAmount || 0).toLocaleString()}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentFees;
