// backend/routes/complaintRoutes.js
import express from 'express';
import {
  submitComplaint,
  getAllComplaints,
  getComplaintsByPriority,
  markComplaintResolved,
  getUserComplaints,
  getUserStats,
} from '../controllers/complaintController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route to submit a new complaint
router.post('/submit', submitComplaint);

// Route to get all complaints (for staff)
router.get('/all', getAllComplaints);

// Route to get complaints by priority
router.get('/priority/:priority', getComplaintsByPriority);

// Route to mark complaint as resolved
router.put('/:id/resolve', markComplaintResolved);

// User-specific routes (require authentication)
router.get('/user-complaints', authenticateToken, getUserComplaints);
router.get('/user-stats', authenticateToken, getUserStats);

export default router;
