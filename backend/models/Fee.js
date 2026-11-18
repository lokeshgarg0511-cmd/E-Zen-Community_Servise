const mongoose = require("mongoose");

const feeItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Semester Fees",
      "Tuition Fee",
      "Fines",
      "Transport Fees",
      "Hostel Fees",
      "Security Deposit",
      "Library Charges",
      "Laboratory Fee",
      "Other Authorized Charges",
    ],
    default: "Tuition Fee",
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "pending", "partially_paid"], default: "pending" },
  dueDate: { type: Date, required: true },
});

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["UPI", "Credit/Debit Card", "Net Banking", "Bank Transfer", "Cash"], default: "UPI" },
  status: { type: String, enum: ["successful", "failed", "pending", "refunded"], default: "successful" },
  paymentGatewayRef: { type: String },
  receiptId: { type: String },
  paidAt: { type: Date, default: Date.now },
});

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
    institutionType: { type: String, enum: ["school", "college"], default: "college" },
    academicYear: { type: String, required: true },
    semesterOrClass: { type: String, required: true },
    totalAssessed: { type: Number, required: true },
    totalPaid: { type: Number, default: 0 },
    totalPending: { type: Number, default: 0 },
    items: [feeItemSchema],
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
