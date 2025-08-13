// Escalation service for complaint management
// Automatically escalates complaints that exceed resolution time limits

import { sendEscalationEmail, sendCitizenEscalationNotification } from './emailService.js';

// Escalation time limits in days
const ESCALATION_LIMITS = {
  high: parseInt(process.env.ESCALATION_HIGH_PRIORITY) || 3,
  medium: parseInt(process.env.ESCALATION_MEDIUM_PRIORITY) || 7,
  low: parseInt(process.env.ESCALATION_LOW_PRIORITY) || 15
};

/**
 * Check if a complaint needs escalation based on priority and age
 */
export const checkEscalation = (complaint) => {
  if (complaint.status === 'resolved' || complaint.status === 'escalated') {
    return { needsEscalation: false, reason: 'Already resolved or escalated' };
  }

  const daysSinceCreation = Math.floor((Date.now() - complaint.createdAt) / (1000 * 60 * 60 * 24));
  const limit = ESCALATION_LIMITS[complaint.priority.toLowerCase()] || 15;

  if (daysSinceCreation >= limit) {
    return {
      needsEscalation: true,
      reason: `Complaint has exceeded ${limit} day limit for ${complaint.priority} priority`,
      daysOverdue: daysSinceCreation - limit
    };
  }

  return { needsEscalation: false, reason: 'Within time limit' };
};

/**
 * Escalate a complaint by updating status and sending notification
 */
export const escalateComplaint = async (complaint) => {
  try {
    // Ensure complaint has required fields with defaults for backward compatibility
    if (!complaint.category) {
      complaint.category = 'General'; // Default category for existing complaints
    }
    
    if (!complaint.escalation) {
      complaint.escalation = {};
    }

    // Update complaint status to escalated
    complaint.status = 'escalated';
    complaint.escalation.isEscalated = true;
    complaint.escalation.escalatedAt = new Date();
    complaint.escalation.escalatedTo = 'Higher Official (Web3Forms Account Owner)';
    complaint.escalation.escalationReason = `Automatic escalation after ${ESCALATION_LIMITS[complaint.priority.toLowerCase()]} days`;
    complaint.escalation.escalationNotes = 'Complaint automatically escalated due to resolution delays';

    // Save the updated complaint
    await complaint.save();

    // Send escalation email to higher official (you)
    const escalationResult = await sendEscalationEmail(complaint, complaint.escalation.escalationReason);
    
    // Send notification to citizen if they have an email
    let citizenNotificationResult = null;
    if (complaint.createdBy?.email) {
      citizenNotificationResult = await sendCitizenEscalationNotification(complaint);
    }

    console.log(`🚨 COMPLAINT ESCALATED SUCCESSFULLY:`);
    console.log(`ID: ${complaint._id}`);
    console.log(`Title: ${complaint.title}`);
    console.log(`Priority: ${complaint.priority}`);
    console.log(`Category: ${complaint.category}`);
    console.log(`Escalation Email: ${escalationResult.success ? '✅ Sent' : '❌ Failed'}`);
    console.log(`Citizen Notification: ${citizenNotificationResult ? (citizenNotificationResult.success ? '✅ Sent' : '❌ Failed') : 'No email available'}`);
    console.log('---');

    return {
      success: true,
      complaint: complaint,
      escalationEmailSent: escalationResult.success,
      citizenNotificationSent: citizenNotificationResult?.success || false
    };
  } catch (error) {
    console.error('❌ Error escalating complaint:', error);
    throw error;
  }
};

/**
 * Check and escalate all overdue complaints
 */
export const checkAndEscalateOverdueComplaints = async (Complaint) => {
  try {
    console.log('🔍 Checking for overdue complaints...');
    
    // Find all active complaints that are not resolved or escalated
    const activeComplaints = await Complaint.find({
      status: { $nin: ['resolved', 'escalated'] }
    }).populate('createdBy', 'name email');

    let escalatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const complaint of activeComplaints) {
      try {
        const escalationCheck = checkEscalation(complaint);
        
        if (escalationCheck.needsEscalation) {
          console.log(`🚨 Escalating complaint: ${complaint.title} (${complaint.priority} priority, ${escalationCheck.daysOverdue} days overdue)`);
          
          await escalateComplaint(complaint);
          escalatedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to process complaint ${complaint._id}:`, error.message);
        errorCount++;
      }
    }

    if (escalatedCount > 0 || errorCount > 0) {
      console.log(`✅ ESCALATION CHECK COMPLETE: ${escalatedCount} complaints escalated, ${skippedCount} skipped, ${errorCount} errors`);
    } else {
      console.log(`✅ No complaints need escalation at this time`);
    }
    console.log('---');

    return { escalatedCount, skippedCount, errorCount, totalChecked: activeComplaints.length };
  } catch (error) {
    console.error('❌ Error checking overdue complaints:', error);
    throw error;
  }
};

/**
 * Get escalation statistics
 */
export const getEscalationStats = async (Complaint) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const escalatedComplaints = await Complaint.countDocuments({ status: 'escalated' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const pendingComplaints = await Complaint.countDocuments({ 
      status: { $nin: ['resolved', 'escalated'] } 
    });

    // Count complaints by priority that are close to escalation
    const highPriorityActive = await Complaint.countDocuments({
      priority: 'high',
      status: { $nin: ['resolved', 'escalated'] }
    });

    const mediumPriorityActive = await Complaint.countDocuments({
      priority: 'medium',
      status: { $nin: ['resolved', 'escalated'] }
    });

    const lowPriorityActive = await Complaint.countDocuments({
      priority: 'low',
      status: { $nin: ['resolved', 'escalated'] }
    });

    return {
      total: totalComplaints,
      escalated: escalatedComplaints,
      resolved: resolvedComplaints,
      pending: pendingComplaints,
      byPriority: {
        high: highPriorityActive,
        medium: mediumPriorityActive,
        low: lowPriorityActive
      },
      escalationLimits: ESCALATION_LIMITS
    };
  } catch (error) {
    console.error('❌ Error getting escalation stats:', error);
    throw error;
  }
}; 