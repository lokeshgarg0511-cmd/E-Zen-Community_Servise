const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: String, required: true },
    examType: { type: String, enum: ["internal1", "internal2", "internal3", "assignment", "quiz"], required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true, default: 100 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marks", marksSchema);
