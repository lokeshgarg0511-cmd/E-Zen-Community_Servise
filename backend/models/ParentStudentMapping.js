const mongoose = require("mongoose");

const mappingSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentStudentMapping", mappingSchema);
