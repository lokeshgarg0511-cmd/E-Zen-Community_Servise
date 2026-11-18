const mongoose = require("mongoose");

const qrSessionSchema = new mongoose.Schema(
  {
    courseOrSubject: { type: String, required: true },
    classOrSection: { type: String, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    secretToken: { type: String, required: true },
    currentToken: { type: String, required: true },
    tokenExpiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    sessionExpiresAt: { type: Date, required: true },
    verifiedStudents: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        scannedAt: { type: Date, default: Date.now },
        ipAddress: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrSession", qrSessionSchema);
