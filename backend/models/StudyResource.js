const mongoose = require("mongoose");

const studyResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    institutionType: { type: String, enum: ["school", "college"], default: "college" },
    courseOrClass: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "PDF" },
    fileSize: { type: String, default: "1.2 MB" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedByName: { type: String },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyResource", studyResourceSchema);
