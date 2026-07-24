const mongoose = require("mongoose");
const User = require("./User");

const facultySchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true },
  designation: { type: String, default: "Assistant Professor" },
  subjects: [{ type: String }],
});

module.exports = User.discriminator("faculty", facultySchema);
