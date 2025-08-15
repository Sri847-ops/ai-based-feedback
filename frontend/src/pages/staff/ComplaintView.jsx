import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Send,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter.js";

export default function ComplaintView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/complaints/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComplaint(data);
        setStatus(data.status);
      } else {
        setError("Failed to fetch complaint details");
      }
    } catch (error) {
      console.error("Error fetching complaint:", error);
      setError("Error fetching complaint details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!status || status === complaint.status) return;

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`/api/complaints/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        setComplaint(data.complaint);
        setSuccessMessage("Status updated successfully!");

        // If status is resolved, redirect to dashboard after a short delay
        if (status === "resolved") {
          setTimeout(() => {
            navigate("/staff/dashboard");
          }, 1500);
        }
      } else {
        setError("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const note = {
      text: newNote,
      author: "Staff Member", // This should come from auth context
      timestamp: new Date(),
      type: "internal",
    };

    try {
      setError("");
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: [...(complaint.notes || []), note],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComplaint(data.complaint);
        setNewNote("");
        setSuccessMessage("Note added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Error adding note");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || "Complaint not found"}
          </h3>
          <p className="text-gray-600 mb-4">
            {error
              ? "Please try again later"
              : "The complaint you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/staff/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
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
              onClick={() => navigate("/staff/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {complaint.title}
              </h1>
              <p className="text-gray-600 mt-1">
                Complaint ID: #{complaint._id}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status.replace("-", " ")}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                  complaint.priority
                )}`}
              >
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Complaint Details
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-900">{complaint.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Category
                      </h3>
                      <p className="text-gray-900">{complaint.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Submitted Date
                      </h3>
                      <p className="text-gray-900">
                        {formatDate(complaint.createdAt)}
                      </p>
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
                  {complaint.notes && complaint.notes.length > 0 ? (
                    complaint.notes.map((note, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {note.author}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(note.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No notes yet
                    </p>
                  )}

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
                <h2 className="text-lg font-semibold text-gray-900">
                  Citizen Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Name
                  </h3>
                  <p className="text-gray-900">
                    {complaint.createdBy?.name || "Anonymous"}
                  </p>
                </div>
                {complaint.createdBy?.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Email
                    </h3>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${complaint.createdBy.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {complaint.createdBy.email}
                      </a>
                    </div>
                  </div>
                )}
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
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Address
                  </h3>
                  <p className="text-gray-900">{complaint.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </h3>
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
                  disabled={updating || status === complaint.status}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
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
            {complaint.assignedTo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Assignment
                  </h2>
                </div>
                <div className="p-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </h3>
                    <p className="text-gray-900">{complaint.assignedTo.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
