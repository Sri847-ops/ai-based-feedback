// Simple in-memory scheduler for running escalation checks
import { checkAndEscalateOverdueComplaints } from './escalationService.js';

class EscalationScheduler {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.checkInterval = 60; // minutes
  }

  /**
   * Start the escalation scheduler
   */
  start(intervalMinutes = 60) {
    if (this.isRunning) {
      console.log('⏰ Escalation scheduler is already running');
      return;
    }

    this.checkInterval = intervalMinutes;
    this.isRunning = true;
    
    // Run initial check immediately
    this.runInitialCheck();
    
    // Set up periodic checks
    this.intervalId = setInterval(() => {
      this.runPeriodicCheck();
    }, intervalMinutes * 60 * 1000);

    console.log(`⏰ Escalation scheduler started (checking every ${intervalMinutes} minutes)`);
  }

  /**
   * Stop the escalation scheduler
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏰ Escalation scheduler stopped');
  }

  /**
   * Run initial escalation check when server starts
   */
  async runInitialCheck() {
    try {
      console.log('🚀 Running initial escalation check...');
      // We'll need to pass the Complaint model from the server
      // This will be called from server.js after models are loaded
    } catch (error) {
      console.error('❌ Error in initial escalation check:', error);
    }
  }

  /**
   * Run periodic escalation check
   */
  async runPeriodicCheck(Complaint) {
    try {
      console.log('⏰ Running periodic escalation check...');
      await checkAndEscalateOverdueComplaints(Complaint);
    } catch (error) {
      console.error('❌ Error in periodic escalation check:', error);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      nextCheck: this.isRunning ? new Date(Date.now() + this.checkInterval * 60 * 1000) : null
    };
  }
}

export default new EscalationScheduler(); 