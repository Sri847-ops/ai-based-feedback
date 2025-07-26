// backend/routes/complaintRoutes.js
import express from 'express';
import {
  submitComplaint,
  getAllComplaints,
  getComplaintsByPriority,
  markComplaintResolved,
} from '../controllers/complaintController.js';

const router = express.Router();

// Route to submit a new complaint
router.post('/submit', submitComplaint);

// Route to get all complaints (admin/staff)
router.get('/all', getAllComplaints);

// Route to get complaints by priority (e.g., /priority/high)
router.get('/priority/:priority', getComplaintsByPriority);

// Route to mark a complaint as resolved
router.put('/resolve/:id', markComplaintResolved);

export default router;
