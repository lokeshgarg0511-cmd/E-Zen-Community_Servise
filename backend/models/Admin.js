const mongoose = require("mongoose");
const User = require("./User");

const adminSchema = new mongoose.Schema({
  accessLevel: { type: String, enum: ["super", "standard"], default: "standard" },
});

module.exports = User.discriminator("admin", adminSchema);
