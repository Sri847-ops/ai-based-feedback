import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Edit,
  MessageSquare,
  Camera,
  FileText,
  Send
} from 'lucide-react';

export default function ComplaintView() {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    // Simulate fetching complaint details
    setTimeout(() => {
      setComplaint({
        id: '1',
        title: 'Broken Street Light',
        description: 'Street light on Main Street is not working for the past 3 days. This is causing safety concerns for pedestrians and motorists, especially during evening hours. The light pole appears to be damaged and needs immediate attention.',
        status: 'pending',
        priority: 'medium',
        address: '123 Main Street, Downtown Area',
        pincode: '123456',
        submittedDate: '2024-01-15',
        category: 'Infrastructure',
        assignedTo: 'John Smith',
        citizenName: 'Alice Johnson',
        citizenPhone: '+91 98765 43210',
        citizenEmail: 'alice.johnson@email.com',
        notes: [
          {
            id: 1,
            text: 'Initial assessment completed. Light pole needs replacement.',
            author: 'John Smith',
            timestamp: '2024-01-16 10:30 AM',
            type: 'internal'
          },
          {
            id: 2,
            text: 'Contacted electrical department for replacement parts.',
            author: 'John Smith',
            timestamp: '2024-01-16 02:15 PM',
            type: 'internal'
          }
        ],
        photos: [
          'https://via.placeholder.com/300x200?text=Street+Light+Damage',
          'https://via.placeholder.com/300x200?text=Location+View'
        ]
      });
      setStatus('pending');
      setLoading(false);
    }, 1000);
  }, []);

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

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setComplaint(prev => ({ ...prev, status }));
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      text: newNote,
      author: 'John Smith', // Current staff member
      timestamp: new Date().toLocaleString(),
      type: 'internal'
    };

    setComplaint(prev => ({
      ...prev,
      notes: [...prev.notes, note]
    }));
    setNewNote('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Complaint not found</h3>
          <p className="text-gray-600">The complaint you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
              <p className="text-gray-600 mt-1">Complaint ID: #{complaint.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                {complaint.status.replace('-', ' ')}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Complaint Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-900">{complaint.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                      <p className="text-gray-900">{complaint.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Submitted Date</h3>
                      <p className="text-gray-900">{complaint.submittedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            {complaint.photos && complaint.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Photos
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {complaint.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Complaint photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Internal Notes
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {complaint.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{note.author}</span>
                        </div>
                        <span className="text-xs text-gray-500">{note.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{note.text}</p>
                    </div>
                  ))}
                  
                  {/* Add Note Form */}
                  <div className="border-t pt-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a new note..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Citizen Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Citizen Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Name</h3>
                  <p className="text-gray-900">{complaint.citizenName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Phone</h3>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${complaint.citizenPhone}`} className="text-blue-600 hover:text-blue-700">
                      {complaint.citizenPhone}
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Email</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${complaint.citizenEmail}`} className="text-blue-600 hover:text-blue-700">
                      {complaint.citizenEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Address</h3>
                  <p className="text-gray-900">{complaint.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Pincode</h3>
                  <p className="text-gray-900">{complaint.pincode}</p>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Update Status
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={loading || status === complaint.status}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
              </div>
              <div className="p-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Assigned To</h3>
                  <p className="text-gray-900">{complaint.assignedTo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
