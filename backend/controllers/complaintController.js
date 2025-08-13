import Complaint from '../models/Complaint.js';
import { classifyComplaintPriority } from '../services/openaiService.js';
import { 
  checkEscalation, 
  escalateComplaint, 
  checkAndEscalateOverdueComplaints,
  getEscalationStats 
} from '../services/escalationService.js';
import { testEmailService } from '../services/emailService.js';

// Submit a new complaint
export const submitComplaint = async (req, res) => {
    try {
      const { title, description, address, pincode, category, priority } = req.body;
  
      if (!title || !description || !address || !pincode || !category) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }
  
      const aiPriority = await classifyComplaintPriority(description);
  
      const newComplaint = new Complaint({
        title,
        description,
        address,
        pincode,
        priority: priority || aiPriority,
        status: 'pending',
        category,
        createdBy: req.body.createdBy || 'anonymous', // You can get this from auth later
        assignedTo: null
      });
  
      await newComplaint.save();
  
      res.status(201).json({
        message: 'Complaint submitted successfully',
        complaint: newComplaint
      });
    } catch (err) {
      console.error('Complaint submission error:', err);
      res.status(500).json({ error: 'Server error while submitting complaint' });
    }
  };

// Get all complaints (for staff)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Server error while fetching complaints' });
  }
};

// Get complaints by priority
export const getComplaintsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const complaints = await Complaint.find({ priority }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints by priority:', error);
    res.status(500).json({ error: 'Server error while fetching complaints' });
  }
};

// Mark complaint as resolved
export const markComplaintResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: 'resolved' },
      { new: true }
    );
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.status(200).json({
      message: 'Complaint marked as resolved',
      complaint
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Server error while updating complaint' });
  }
};

// Get complaints for the authenticated user
export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    
    const complaints = await Complaint.find({ createdBy: userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ error: 'Server error while fetching user complaints' });
  }
};

// Get complaint statistics for the authenticated user
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    
    const total = await Complaint.countDocuments({ createdBy: userId });
    const pending = await Complaint.countDocuments({ createdBy: userId, status: 'pending' });
    const inProgress = await Complaint.countDocuments({ createdBy: userId, status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ createdBy: userId, status: 'resolved' });
    
    res.status(200).json({
      total,
      pending,
      inProgress,
      resolved
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Server error while fetching user statistics' });
  }
};

// Get complaints grouped by priority for staff dashboard
export const getComplaintsGroupedByPriority = async (req, res) => {
  try {
    // Only fetch active complaints (not resolved)
    const complaints = await Complaint.find({ status: { $ne: 'resolved' } })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    // Group complaints by priority
    const groupedComplaints = {
      high: complaints.filter(c => c.priority === 'high'),
      medium: complaints.filter(c => c.priority === 'medium'),
      low: complaints.filter(c => c.priority === 'low')
    };

    res.status(200).json(groupedComplaints);
  } catch (error) {
    console.error('Error fetching complaints grouped by priority:', error);
    res.status(500).json({ error: 'Server error while fetching complaints' });
  }
};

// Get a single complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name');
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ error: 'Server error while fetching complaint' });
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email')
     .populate('assignedTo', 'name');
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.status(200).json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Server error while updating complaint status' });
  }
};

// Get complaint statistics for staff dashboard
export const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const highPriority = await Complaint.countDocuments({ 
      priority: 'high', 
      status: { $ne: 'resolved' } 
    });
    
    res.status(200).json({
      total,
      pending,
      inProgress,
      resolved,
      highPriority
    });
  } catch (error) {
    console.error('Error fetching complaint statistics:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
};

// Manually escalate a complaint
export const manuallyEscalateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { escalationNotes } = req.body;
    
    const result = await escalateComplaint(id);
    
    if (result.alreadyEscalated) {
      return res.status(400).json({ error: 'Complaint is already escalated' });
    }
    
    // Add custom escalation notes if provided
    if (escalationNotes) {
      await Complaint.findByIdAndUpdate(id, {
        'escalation.escalationNotes': escalationNotes
      });
    }
    
    res.status(200).json({
      message: 'Complaint escalated successfully',
      result
    });
  } catch (error) {
    console.error('Error manually escalating complaint:', error);
    res.status(500).json({ error: 'Server error while escalating complaint' });
  }
};

// Check escalation status for a complaint
export const getComplaintEscalationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    const escalationCheck = checkEscalation(complaint);
    const daysSinceCreation = Math.floor((Date.now() - complaint.createdAt) / (1000 * 60 * 60 * 24));
    
    const escalationInfo = {
      complaintId: complaint._id,
      title: complaint.title,
      priority: complaint.priority,
      status: complaint.status,
      daysSinceCreation,
      shouldEscalate: escalationCheck.needsEscalation,
      escalationReason: escalationCheck.reason,
      escalationDetails: complaint.escalation,
      escalationLimit: {
        high: 3,
        medium: 7,
        low: 15
      }[complaint.priority]
    };
    
    res.status(200).json(escalationInfo);
  } catch (error) {
    console.error('Error getting escalation status:', error);
    res.status(500).json({ error: 'Server error while getting escalation status' });
  }
};

// Get escalation statistics
export const getEscalationStatistics = async (req, res) => {
  try {
    const stats = await getEscalationStats(Complaint);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting escalation statistics:', error);
    res.status(500).json({ error: 'Server error while getting escalation statistics' });
  }
};

// Check and escalate all overdue complaints (admin function)
export const runEscalationCheck = async (req, res) => {
  try {
    const results = await checkAndEscalateOverdueComplaints(Complaint);
    res.status(200).json({
      message: 'Escalation check completed',
      results,
      totalProcessed: results.totalChecked || 0
    });
  } catch (error) {
    console.error('Error running escalation check:', error);
    res.status(500).json({ error: 'Server error while running escalation check' });
  }
};

// Test email service
export const testEmail = async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ error: 'Test email address is required' });
    }
    
    const result = await testEmailService(testEmail);
    
    res.status(200).json({
      message: 'Test email sent successfully',
      result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Server error while sending test email' });
  }
};
