// Email service using Web3Forms API for complaint escalation notifications
// This is much simpler than SMTP and doesn't require complex email setup
// All emails are automatically sent to the account that created the Web3Forms API key

const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

/**
 * Send escalation email to higher official (you) using Web3Forms
 */
export const sendEscalationEmail = async (complaint, escalationReason) => {
  try {
    const daysSinceCreation = Math.floor((Date.now() - complaint.createdAt) / (1000 * 60 * 60 * 24));
    
    // Ensure complaint has required fields with defaults for backward compatibility
    const category = complaint.category || 'General';
    
    // Create email content
    const emailContent = `
🚨 COMPLAINT ESCALATION ALERT

Complaint Details:
- ID: ${complaint._id}
- Title: ${complaint.title}
- Priority: ${complaint.priority.toUpperCase()}
- Category: ${category}
- Description: ${complaint.description}
- Address: ${complaint.address}
- Submitted by: ${complaint.createdBy?.name || 'Anonymous'}
- Days since submission: ${daysSinceCreation} days

Escalation Reason: ${escalationReason}

This complaint has been automatically escalated due to resolution delays. 
Please take immediate action to address this issue and update the complaint status.

This is an automated escalation notification from the Government Complaint Management System.
    `;

    // Send email via Web3Forms (automatically goes to your account)
    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', 'Government Complaint System');
    formData.append('subject', `URGENT: Complaint Escalation Required - ${complaint.title}`);
    formData.append('message', emailContent);
    formData.append('reply_to', process.env.EMAIL_USER || 'noreply@government.gov');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`📧 ESCALATION EMAIL SENT SUCCESSFULLY to higher official`);
      console.log(`Complaint ID: ${complaint._id}`);
      console.log(`Message ID: ${result.message_id}`);
      console.log('---');
      return { success: true, messageId: result.message_id };
    } else {
      console.error(`❌ Failed to send escalation email:`, result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error sending escalation email:', error);
    throw error;
  }
};

/**
 * Send notification email to citizen about escalation
 */
export const sendCitizenEscalationNotification = async (complaint) => {
  try {
    if (!complaint.createdBy?.email) {
      return { success: false, reason: 'No citizen email available' };
    }

    // Ensure complaint has required fields with defaults for backward compatibility
    const category = complaint.category || 'General';

    const emailContent = `
📢 Your Complaint Has Been Escalated

Dear ${complaint.createdBy.name || 'Valued Citizen'},

We want to inform you that your complaint has been escalated to higher officials for immediate attention.

Complaint Details:
- ID: ${complaint._id}
- Title: ${complaint.title}
- Priority: ${complaint.priority.toUpperCase()}
- Category: ${category}
- Submitted on: ${new Date(complaint.createdAt).toLocaleDateString()}

What This Means:
Your complaint has been automatically escalated because it has exceeded the standard resolution time for ${complaint.priority} priority complaints. This ensures that your concern receives the attention it deserves.

We appreciate your patience and assure you that we are working to resolve your complaint as quickly as possible.

Best regards,
Government Complaint Management Team

This is an automated notification from the Government Complaint Management System.
    `;

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', 'Government Complaint System');
    formData.append('subject', `Your Complaint Has Been Escalated - ${complaint.title}`);
    formData.append('message', emailContent);
    formData.append('to', complaint.createdBy.email);
    formData.append('reply_to', process.env.EMAIL_USER || 'noreply@government.gov');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`📧 CITIZEN NOTIFICATION EMAIL SENT SUCCESSFULLY to ${complaint.createdBy.email}`);
      return { success: true, emailSent: complaint.createdBy.email, messageId: result.message_id };
    } else {
      console.error(`❌ Failed to send citizen notification to ${complaint.createdBy.email}:`, result.message);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('❌ Error sending citizen notification:', error);
    throw error;
  }
};

/**
 * Send reminder email to assigned staff
 */
export const sendStaffReminder = async (complaint, daysUntilEscalation) => {
  try {
    if (!complaint.assignedTo?.email) {
      return { success: false, reason: 'No staff email available' };
    }

    // Ensure complaint has required fields with defaults for backward compatibility
    const category = complaint.category || 'General';

    const emailContent = `
⏰ Complaint Resolution Reminder

Dear ${complaint.assignedTo.name || 'Staff Member'},

This is a reminder that you have a complaint assigned to you that requires immediate attention.

Complaint Details:
- ID: ${complaint._id}
- Title: ${complaint.title}
- Priority: ${complaint.priority.toUpperCase()}
- Category: ${category}
- Days since assignment: ${Math.floor((Date.now() - complaint.createdAt) / (1000 * 60 * 60 * 24))} days

⚠️ URGENT: ${daysUntilEscalation} Day(s) Until Escalation

This complaint will be automatically escalated to higher officials in ${daysUntilEscalation} day(s) if not resolved. Please take immediate action to prevent escalation.

Recommended Actions:
- Review the complaint details immediately
- Update the complaint status to 'in-progress'
- Add progress notes
- Contact the citizen if additional information is needed
- Work towards resolution before escalation deadline

Please log into the complaint management system to update the status and add progress notes.

Best regards,
Government Complaint Management System

This is an automated reminder from the Government Complaint Management System.
    `;

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', 'Government Complaint System');
    formData.append('subject', `URGENT: Complaint Resolution Reminder - ${complaint.title}`);
    formData.append('message', emailContent);
    formData.append('to', complaint.assignedTo.email);
    formData.append('reply_to', process.env.EMAIL_USER || 'noreply@government.gov');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`📧 STAFF REMINDER EMAIL SENT SUCCESSFULLY to ${complaint.assignedTo.email}`);
      return { success: true, emailSent: complaint.assignedTo.email, messageId: result.message_id };
    } else {
      console.error(`❌ Failed to send staff reminder to ${complaint.assignedTo.email}:`, result.message);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('❌ Error sending staff reminder:', error);
    throw error;
  }
};

/**
 * Test email functionality using Web3Forms
 */
export const testEmailService = async (testEmail) => {
  try {
    const emailContent = `
✅ Email Service Test

This is a test email to verify that the email service is working correctly.

Email Configuration:
- Service: Web3Forms API
- From: Government Complaint System
- To: ${testEmail}
- Timestamp: ${new Date().toLocaleString()}

If you received this email, the escalation system is ready to send real notifications!

This is a test email from the Government Complaint Management System.
    `;

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', 'Government Complaint System');
    formData.append('subject', 'Test Email - Government Complaint System');
    formData.append('message', emailContent);
    formData.append('to', testEmail);
    formData.append('reply_to', process.env.EMAIL_USER || 'noreply@government.gov');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ TEST EMAIL SENT SUCCESSFULLY via Web3Forms:');
      console.log('To:', testEmail);
      console.log('Message ID:', result.message_id);
      console.log('---');
      return { success: true, messageId: result.message_id };
    } else {
      console.error('❌ Failed to send test email via Web3Forms:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    throw error;
  }
}; 