const mongoose = require("mongoose");
const User = require("./User");

const parentSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  relationship: { type: String, enum: ["Father", "Mother", "Guardian"], required: true },
  linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = User.discriminator("parent", parentSchema);
