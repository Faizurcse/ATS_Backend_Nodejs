import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"; // Import routes using ES Modules syntax
import jobRoutes from "./routes/jobRoutes.js"; // Import jobRoutes
import candidateRoutes from "./routes/candidateRoutes.js"; // Import candidate routes

// Initialize dotenv for environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/jobs", jobRoutes); // Job posting routes (this is new)
app.use("/api", candidateRoutes); // Candidate application routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
