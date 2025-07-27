"use client"

import { useState, useEffect } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userType, setUserType] = useState("user")
  const [userName] = useState("John Doe")
  const [pendingComplaints] = useState(12)

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem('userType')
    if (storedUserType) {
      setUserType(storedUserType)
    }
  }, [])

  const citizenNavItems = [
    { title: "Dashboard", href: "/", symbol: "📊" },
    { title: "Submit Complaint", href: "/user/complaint-form", symbol: "📝" },
    { title: "My Complaints", href: "/user/complaints", symbol: "📋" },
    { title: "Help & FAQ", href: "/help", symbol: "❓" },
  ]

  const staffNavItems = [
    { title: "Dashboard", href: "/staff", symbol: "📊" },
    { title: "All Complaints", href: "/staff", symbol: "📋" },
    { title: "Complaint Details", href: "/staff/complaint-view", symbol: "👤" },
    { title: "Analytics", href: "/staff", symbol: "📈" },
  ]

  const navItems = userType === "staff" ? staffNavItems : citizenNavItems

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    
    // Redirect to login page
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Top Government Bar */}
      <div className="bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-xs">📍</span>
                <span>City Municipal Corporation</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-xs">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-xs">✉️</span>
                <span>support@citymunicipality.gov</span>
              </div>
            </div>
            <div className="text-xs text-slate-300">Office Hours: Mon-Fri 9:00 AM - 5:00 PM</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                🏛️
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-slate-800">Municipal Feedback System</h1>
                <p className="text-xs text-slate-600">AI-Powered Civic Complaint Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors"
              >
                <span className="text-base">{item.symbol}</span>
                <span>{item.title}</span>
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* User Type Badge */}
            <div
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                userType === "staff"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {userType === "staff" ? "👩‍💼 Staff" : "👤 Citizen"}
            </div>

            {/* Notifications for Staff */}
            {userType === "staff" && (
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                <span className="text-lg">🔔</span>
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
                className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {userType === "staff" ? "👩‍💼" : "👤"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-800">{userName}</p>
                  <p className="text-xs text-slate-500 capitalize">{userType}</p>
                </div>
                <span className="text-xs text-slate-400">▼</span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </a>
                    <hr className="my-1 border-slate-200" />
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              <span className="text-lg">{isMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 py-4">
            {/* User Info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {userType === "staff" ? "👩‍💼" : "👤"}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{userName}</p>
                  <p className="text-sm text-slate-500 capitalize">{userType}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  userType === "staff" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {userType === "staff" ? "Staff" : "Citizen"}
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-base">{item.symbol}</span>
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>

            {/* Mobile Sign Out */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false)
            setIsUserMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}
