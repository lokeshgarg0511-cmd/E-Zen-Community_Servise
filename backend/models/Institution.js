const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["school", "college"], required: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    tagline: { type: String, default: "One Future. One Goal. A Million Dreams." },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    supportEmail: { type: String, required: true },
    helpline: { type: String, required: true },
    website: { type: String },
    logo: { type: String },
    principalOrDean: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);
