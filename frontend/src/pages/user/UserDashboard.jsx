"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function UserDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch("/api/complaints/user-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const StatCard = ({ label, value, icon: Icon, color, description }) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      yellow: "bg-yellow-100 text-yellow-600",
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div
            className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
          >
            {Icon && <Icon className="h-6 w-6" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <span>Citizen Dashboard</span>
              </h1>
              <p className="text-slate-600 mt-1">
                Welcome back! Here's an overview of your complaints
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-slate-500">Welcome back,</p>
                <p className="font-semibold text-slate-800">Citizen</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                CU
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/user/complaint-form"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Submit New Complaint</span>
            </a>
            <a
              href="/user/complaints"
              className="flex items-center justify-center space-x-2 bg-white text-slate-700 px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>View All Complaints</span>
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Complaints"
            value={loading ? "..." : stats.total}
            icon={FileText}
            color="blue"
            description="Your submitted complaints"
          />
          <StatCard
            label="Pending"
            value={loading ? "..." : stats.pending}
            icon={Clock}
            color="yellow"
            description="Awaiting review"
          />
          <StatCard
            label="In Progress"
            value={loading ? "..." : stats.inProgress}
            icon={AlertTriangle}
            color="red"
            description="Being processed"
          />
          <StatCard
            label="Resolved"
            value={loading ? "..." : stats.resolved}
            icon={CheckCircle}
            color="green"
            description="Completed"
          />
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Welcome to the Municipal Feedback System
            </h2>
            <p className="text-slate-600 mb-6">
              Help us improve our city by reporting issues you encounter. Your
              feedback is valuable in making our community better for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/user/complaint-form"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Your First Complaint
              </a>
              <a
                href="/user/complaints"
                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors"
              >
                View Your Complaints
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
