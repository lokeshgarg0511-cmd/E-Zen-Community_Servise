const Fee = require("../models/Fee");
const AuditLog = require("../models/AuditLog");

// @desc    Get student fee details
// @route   GET /api/fees/student/:studentId?
// @access  Private
exports.getStudentFee = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    let fee = await Fee.findOne({ student: studentId }).populate("student", "fullName email rollNumber schoolClass department");

    if (!fee) {
      // Return default initial assessment structure if none created yet
      fee = {
        student: studentId,
        academicYear: "2026-2027",
        semesterOrClass: req.user.schoolClass || req.user.department || "Current Term",
        totalAssessed: 50000,
        totalPaid: 0,
        totalPending: 50000,
        items: [
          {
            title: "Standard Academic Tuition Fee",
            category: "Tuition Fee",
            amount: 50000,
            status: "pending",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        ],
        transactions: [],
      };
    }

    res.json({ success: true, fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process or record payment
// @route   POST /api/fees/pay
// @access  Private
exports.payFee = async (req, res) => {
  try {
    const { studentId, amount, method = "UPI", itemIds = [] } = req.body;
    const targetStudentId = studentId || req.user._id;

    let fee = await Fee.findOne({ student: targetStudentId });
    if (!fee) {
      fee = new Fee({
        student: targetStudentId,
        academicYear: "2026-2027",
        semesterOrClass: req.user.schoolClass || req.user.department || "Current Term",
        totalAssessed: Number(amount),
        totalPaid: 0,
        totalPending: Number(amount),
        items: [],
        transactions: [],
      });
    }

    const payAmount = Number(amount);
    const txnId = `TXN_${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
    const receiptId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    fee.totalPaid = (fee.totalPaid || 0) + payAmount;
    fee.totalPending = Math.max(0, (fee.totalAssessed || 0) - fee.totalPaid);

    if (itemIds && itemIds.length > 0) {
      fee.items.forEach((item) => {
        if (itemIds.includes(String(item._id))) {
          item.status = "paid";
        }
      });
    }

    const txn = {
      txnId,
      amount: payAmount,
      method,
      status: "successful",
      receiptId,
      paidAt: new Date(),
    };
    fee.transactions.unshift(txn);
    await fee.save();

    // Audit log
    await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.fullName || "User",
      actorRole: req.user.role || "student",
      action: "FEE_PAYMENT_PROCESSED",
      resourceType: "Fee",
      resourceId: txnId,
      details: { amount: payAmount, method, receiptId, studentId: targetStudentId },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Payment of ₹${payAmount.toLocaleString()} successful!`,
      receiptId,
      txnId,
      fee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all institutional fees (Admin ledger)
// @route   GET /api/fees
// @access  Private (Admin)
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("student", "fullName email rollNumber schoolClass department");
    res.json({ success: true, count: fees.length, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
