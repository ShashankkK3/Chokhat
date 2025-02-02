import authRoutes from "./routes/authRoutes.js";
// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Import routes
// import protectedRoutes from "./routes/protectedRoutes.js";

// Use routes
app.use("/", authRoutes);
// app.use("/api", protectedRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch((err) => console.error("❌ MongoDB connection error:", err));

// After middleware
