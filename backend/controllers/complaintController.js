import Complaint from '../models/Complaint.js';
import { classifyComplaintPriority } from '../services/openaiService.js';

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
