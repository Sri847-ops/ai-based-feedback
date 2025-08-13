// pages/StaffDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Calendar,
  MapPin,
  TrendingUp,
  BarChart3,
  Mail,
  Send
} from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter.js';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [complaints, setComplaints] = useState({ high: [], medium: [], low: [] });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });
  const [escalationStats, setEscalationStats] = useState({
    total: 0,
    escalated: 0,
    resolved: 0,
    pending: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0
    },
    escalationLimits: {
      high: 3,
      medium: 7,
      low: 15
    }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
    fetchStats();
    fetchEscalationStats();
  }, []);

  // Refresh data when returning to dashboard
  useEffect(() => {
    if (location.pathname === '/staff/dashboard') {
      fetchComplaints();
      fetchStats();
      fetchEscalationStats();
    }
  }, [location.pathname]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/complaints/grouped-by-priority');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        console.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchEscalationStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints/escalation/stats');
      if (response.ok) {
        const data = await response.json();
        setEscalationStats(data);
      } else {
        console.error('Failed to fetch escalation statistics');
      }
    } catch (error) {
      console.error('Error fetching escalation statistics:', error);
    }
  };

  const handleComplaintClick = (complaintId) => {
    navigate(`/staff/complaint-view/${complaintId}`);
  };

  const handleTestEmail = async () => {
    const email = document.getElementById('testEmailInput').value;
    if (!email) {
      alert('Please enter an email address to test.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/complaints/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail: email }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Email test successful! Message ID: ${data.result.messageId}`);
        document.getElementById('testEmailInput').value = '';
      } else {
        const errorData = await response.json();
        alert(`Email test failed: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email. Please check server logs.');
    }
  };

  // Flatten all complaints for stats and filtering
  const allComplaints = [...complaints.high, ...complaints.medium, ...complaints.low];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = allComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.createdBy?.name && complaint.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderComplaintCard = (complaint) => {
    const daysSinceCreation = Math.floor((Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));
    const escalationLimit = { high: 3, medium: 7, low: 15 }[complaint.priority];
    const daysUntilEscalation = Math.max(0, escalationLimit - daysSinceCreation);
    const isOverdue = daysUntilEscalation <= 0;
    const isEscalated = complaint.status === 'escalated';

    return (
      <div 
        key={complaint._id} 
        className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer ${
          isOverdue ? 'border-red-300 bg-red-50' : 
          daysUntilEscalation <= 1 ? 'border-orange-300 bg-orange-50' : 
          'border-gray-200'
        }`}
        onClick={() => handleComplaintClick(complaint._id)}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority}
            </span>
            {isEscalated && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Escalated
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{complaint.description}</p>
        
        {/* Escalation Warning */}
        {isOverdue && !isEscalated && (
          <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded-md">
            <p className="text-xs text-red-800 font-medium">
              ⚠️ OVERDUE: Should be escalated to higher officials
            </p>
          </div>
        )}
        
        {daysUntilEscalation <= 1 && daysUntilEscalation > 0 && !isEscalated && (
          <div className="mb-3 p-2 bg-orange-100 border border-orange-200 rounded-md">
            <p className="text-xs text-orange-800 font-medium">
              ⚠️ URGENT: {daysUntilEscalation} day(s) until escalation
            </p>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{complaint.address}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{complaint.createdBy?.name || 'Anonymous'}</span>
          </div>
          
          {complaint.category && (
            <div className="flex items-center text-sm text-gray-500">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>{complaint.category}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
          
          {/* Escalation Timing */}
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {isOverdue 
                ? `${daysSinceCreation} days old (${daysSinceCreation - escalationLimit} days overdue)`
                : `${daysSinceCreation} days old (${daysUntilEscalation} days until escalation)`
              }
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
            {complaint.status.replace('-', ' ')}
          </span>
          
          <div className="flex space-x-2">
            <button 
              className="text-blue-600 hover:text-blue-900 p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleComplaintClick(complaint._id);
              }}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              className="text-green-600 hover:text-green-900 p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleComplaintClick(complaint._id);
              }}
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPrioritySection = (priority, complaints, color) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className={`w-4 h-4 rounded-full ${color} mr-3`}></div>
        <h2 className="text-xl font-semibold text-gray-900 capitalize">{priority} Priority</h2>
        <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {complaints.length} complaints
        </span>
      </div>
      
      {complaints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {priority} priority complaints
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map(renderComplaintCard)}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage and track citizen complaints by priority</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard 
            title="Total Complaints" 
            value={stats.total} 
            icon={BarChart3} 
            color="blue" 
            change="+12%"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Clock} 
            color="yellow" 
            change="+5"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={Edit} 
            color="blue" 
            change="+3"
          />
          <StatCard 
            title="Resolved" 
            value={stats.resolved} 
            icon={CheckCircle} 
            color="green" 
            change="+8"
          />
          <StatCard 
            title="Escalated Complaints" 
            value={escalationStats.escalated} 
            icon={AlertTriangle} 
            color="red" 
            change="+2"
          />
        </div>


        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search complaints, citizens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Complaints by Priority */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading complaints...</p>
          </div>
        ) : (
          <div>
            {/* High Priority Complaints */}
            {renderPrioritySection('high', complaints.high, 'bg-red-500')}
            
            {/* Medium Priority Complaints */}
            {renderPrioritySection('medium', complaints.medium, 'bg-yellow-500')}
            
            {/* Low Priority Complaints */}
            {renderPrioritySection('low', complaints.low, 'bg-green-500')}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, change }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        <span className="text-green-600 font-medium">{change}</span>
        <span className="text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
}
