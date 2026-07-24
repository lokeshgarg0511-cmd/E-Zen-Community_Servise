const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("========== FULL ERROR ==========");
    console.error(error);
    console.error("================================");
    process.exit(1);
  }
};

module.exports = connectDB;