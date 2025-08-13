// backend/routes/complaintRoutes.js
import express from 'express';
import {
  submitComplaint,
  getAllComplaints,
  getComplaintsByPriority,
  getComplaintsGroupedByPriority,
  getComplaintById,
  updateComplaintStatus,
  getComplaintStats,
  markComplaintResolved,
  getUserComplaints,
  getUserStats,
  manuallyEscalateComplaint,
  getComplaintEscalationStatus,
  getEscalationStatistics,
  runEscalationCheck,
  testEmail,
} from '../controllers/complaintController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route to submit a new complaint
router.post('/submit', submitComplaint);

// Route to get all complaints (for staff)
router.get('/all', getAllComplaints);

// Route to get complaints grouped by priority (for staff dashboard)
router.get('/grouped-by-priority', getComplaintsGroupedByPriority);

// Route to get complaint statistics
router.get('/stats', getComplaintStats);

// Test email service
router.post('/test-email', testEmail);

// Escalation routes
router.get('/escalation/stats', getEscalationStatistics);
router.post('/escalation/check', runEscalationCheck);
router.get('/escalation/status/:id', getComplaintEscalationStatus);
router.post('/escalation/:id', manuallyEscalateComplaint);

// User-specific routes (require authentication) - MUST come BEFORE /:id route
router.get('/user-complaints', authenticateToken, getUserComplaints);
router.get('/user-stats', authenticateToken, getUserStats);

// Route to get complaints by priority
router.get('/priority/:priority', getComplaintsByPriority);

// Route to mark complaint as resolved
router.put('/:id/resolve', markComplaintResolved);

// Route to update complaint status
router.put('/:id/status', updateComplaintStatus);

// Route to get a single complaint by ID - MUST come LAST
router.get('/:id', getComplaintById);

export default router;
