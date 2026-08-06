const mongoose = require("mongoose");
const dns = require("dns");

// Set public DNS servers to resolve MongoDB Atlas SRV records when local router/ISP DNS fails
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  // Fallback gracefully if setServers is restricted
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MongoDB connection URI is not defined in environment variables (MONGODB_URI / MONGO_URI).");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("========== FULL ERROR ==========");
    console.error(error);
    console.error("================================");
    process.exit(1);
  }
};

module.exports = connectDB;