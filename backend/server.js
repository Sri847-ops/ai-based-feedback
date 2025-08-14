import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import escalationScheduler from "./services/schedulerService.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/complaints", complaintRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    // Wait a bit for MongoDB connection to be fully established
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Import Complaint model after server starts
    const { default: Complaint } = await import("./models/Complaint.js");

    // Start escalation scheduler with Complaint model
    escalationScheduler.start(60); // Check every 60 minutes

    // Run initial escalation check
    console.log("🚀 Running initial escalation check...");
    const { checkAndEscalateOverdueComplaints } = await import(
      "./services/escalationService.js"
    );
    await checkAndEscalateOverdueComplaints(Complaint);

    console.log("✅ Escalation system initialized successfully");
  } catch (error) {
    console.error("❌ Error starting escalation scheduler:", error);
  }
});
