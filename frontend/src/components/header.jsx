"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  List,
  HelpCircle,
  User,
  Settings,
  LogOut,
  Bell,
  BarChart2,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userType, setUserType] = useState("user");
  const [userName] = useState("John Doe");
  const [pendingComplaints] = useState(12);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) setUserType(storedUserType);
    setCurrentPath(window.location.pathname);
  }, []);

  const citizenNavItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Submit Complaint", href: "/user/complaint-form", icon: FileText },
    { title: "My Complaints", href: "/user/complaints", icon: List },
    { title: "Help & FAQ", href: "/help", icon: HelpCircle },
  ];

  const staffNavItems = [
    { title: "Dashboard", href: "/staff", icon: LayoutDashboard },
    { title: "All Complaints", href: "/staff", icon: List },
    { title: "Complaint Details", href: "/staff/complaint-view", icon: User },
    { title: "Analytics", href: "/staff", icon: BarChart2 },
  ];

  const navItems = userType === "staff" ? staffNavItems : citizenNavItems;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/30 shadow-lg">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/">
            <img
              src="/civicpulselogo-removebg.png"
              alt="CivicPulse Logo"
              className="h-20 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/40 hover:backdrop-blur-md rounded-md transition after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-800 after:transition-transform after:duration-300 after:origin-center ${
                    isActive
                      ? "after:scale-x-70"
                      : "after:scale-x-0 hover:after:scale-x-70"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.title}</span>
                </a>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* User Type Badge */}
            <div
              className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md ${
                userType === "staff"
                  ? "bg-green-200/40 text-green-900"
                  : "bg-blue-200/40 text-blue-900"
              }`}
            >
              {userType === "staff" ? "Staff" : "Citizen"}
            </div>

            {/* Notifications */}
            {userType === "staff" && (
              <button className="relative p-2 text-slate-700 hover:bg-white/40 rounded-md transition">
                <Bell size={18} />
                {pendingComplaints > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {pendingComplaints > 99 ? "99+" : pendingComplaints}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 cursor-pointer text-slate-700 hover:bg-slate-100 rounded-md transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200/40 text-blue-800">
                  <User size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-slate-500 capitalize">
                    {userType}
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 backdrop-blur-lg bg-white/90 border border-white/20 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      <UserCircle size={16} />
                      <span>Profile</span>
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </a>
                    <hr className="my-1 border-white/20" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full  cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-200/40"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-white/40 rounded-md transition"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-lg bg-white/30 border-t border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/20 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200/40 text-blue-800">
                  <User size={18} />
                </div>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm text-slate-500 capitalize">
                    {userType}
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-white/40 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={16} />
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/20">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-200/40 rounded-md transition"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
}
