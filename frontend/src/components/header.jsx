"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Edit,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userType, setUserType] = useState("user");
  const [userName] = useState("John Doe");
  const [pendingComplaints] = useState(12);
  const [currentPath, setCurrentPath] = useState("");
  const userMenuRef = useRef(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) setUserType(storedUserType);
    setCurrentPath(window.location.pathname);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

            {/* Enhanced User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 cursor-pointer text-slate-700 hover:bg-white/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-sm ring-2 ring-white/20">
                  <User size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {userType}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden md:block text-slate-500 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-white/30">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg ring-2 ring-blue-200">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-slate-900 truncate">
                          {userName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                              userType === "staff"
                                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                            }`}
                          >
                            {userType === "staff" ? (
                              <>Staff Member</>
                            ) : (
                              "Citizen"
                            )}
                          </div>
                          {userType === "staff" && pendingComplaints > 0 && (
                            <div className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full ring-1 ring-red-200">
                              {pendingComplaints} pending
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="group flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 transition-all duration-150"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100/60 text-blue-600 group-hover:bg-blue-200/80 transition-colors">
                        <UserCircle size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">View Profile</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manage your personal information
                        </p>
                      </div>
                    </a>

                    <a
                      href="/profile/edit"
                      className="group flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 transition-all duration-150"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100/60 text-green-600 group-hover:bg-green-200/80 transition-colors">
                        <Edit size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Edit Profile</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Update your details and preferences
                        </p>
                      </div>
                    </a>

                    <a
                      href="/settings"
                      className="group flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 transition-all duration-150"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100/60 text-purple-600 group-hover:bg-purple-200/80 transition-colors">
                        <Settings size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Account Settings</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Privacy, security & preferences
                        </p>
                      </div>
                    </a>

                    {/* Divider */}
                    <hr className="my-2 border-slate-200/60" />

                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="group flex cursor-pointer items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/60 hover:text-red-700 transition-all duration-150 focus:outline-none focus:bg-red-50/60"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100/60 text-red-600 group-hover:bg-red-200/80 transition-colors">
                        <LogOut size={16} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs text-red-500/80 mt-0.5">
                          End your current session
                        </p>
                      </div>
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
