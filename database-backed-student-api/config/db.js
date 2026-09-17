const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const dns = require("node:dns");
const mongoose = require("mongoose");
// The local DNS resolver refuses Atlas SRV lookups; allow an environment override.
dns.setServers((process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8")
    .split(",").map((server) => server.trim()).filter(Boolean));
const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from the app's .env file");
    }
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
    });
    console.log("MongoDB connected");
};
module.exports = connectDB;
