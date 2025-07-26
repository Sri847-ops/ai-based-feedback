import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js'; // ✅ Added complaint routes

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/complaints', complaintRoutes); // ✅ Mounted complaint routes

// Health Check Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
