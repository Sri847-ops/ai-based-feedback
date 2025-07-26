import Complaint from '../models/Complaint.js';
import { classifyComplaintPriority } from '../services/openaiService.js';

// Submit a new complaint
export const submitComplaint = async (req, res) => {
    try {
      const { createdBy, title, description, address, pincode, assignedTo } = req.body;
  
      if (!createdBy || !title || !description || !address || !pincode) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const priority = await classifyComplaintPriority(description);
  
      const newComplaint = new Complaint({
        title,
        description,
        address,
        pincode,
        priority,
        status: 'pending',
        createdBy,           // used as per schema
        assignedTo: assignedTo || null
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

// Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('createdBy', 'email');
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Server error fetching complaints' });
  }
};

// Get complaints filtered by priority
export const getComplaintsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const complaints = await Complaint.find({ priority });
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching complaints by priority:', err);
    res.status(500).json({ error: 'Server error fetching complaints' });
  }
};

// Mark a complaint as resolved
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

    res.status(200).json({ message: 'Complaint marked as resolved', complaint });
  } catch (err) {
    console.error('Error resolving complaint:', err);
    res.status(500).json({ error: 'Server error resolving complaint' });
  }
};
