import React, { useState } from "react"
import { User, Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("citizen")
  const [authMode, setAuthMode] = useState("login") // login | signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (authMode === "signup") {
      if (!formData.name.trim()) {
        setError("Name is required.")
        setLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.")
        setLoading(false)
        return
      }
    }

    try {
      const endpoint =
        authMode === "login"
          ? activeTab === "citizen"
            ? "/api/users/login"
            : "/api/staff/login"
          : "/api/users/signup"

      const payload =
        authMode === "login"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error("Invalid server response")
      }

      if (!response.ok) {
        throw new Error(data?.message || "Request failed")
      }

      if (!data.token) {
        throw new Error("No authentication token received from server.")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("userType", activeTab === "citizen" ? "user" : "staff")
      window.location.href = activeTab === "citizen" ? "/" : "/staff"
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-start bg-blue-50 border border-blue-200 p-4 mb-6 rounded-md space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
            <p className="text-sm text-blue-800">
              This is an official government portal. Please ensure you are authorized to access this system.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-6">
            <div className="text-center pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {authMode === "login" ? "Secure Access Portal" : "Create an Account"}
              </h2>
              <p className="text-slate-600">
                {authMode === "login"
                  ? "Sign in to access municipal services and complaint management"
                  : "Sign up to access citizen services and complaint portal"}
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 mb-6">
              <button
                className={`flex items-center justify-center space-x-2 py-2 rounded-md font-medium ${
                  activeTab === "citizen"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
                onClick={() => setActiveTab("citizen")}
              >
                <User className="h-4 w-4" />
                <span>Citizen</span>
              </button>
              <button
                className={`flex items-center justify-center space-x-2 py-2 rounded-md font-medium ${
                  activeTab === "staff"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-100 text-slate-700"
                } ${authMode === "signup" ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => authMode === "login" && setActiveTab("staff")}
                disabled={authMode === "signup"}
              >
                <Shield className="h-4 w-4" />
                <span>Staff</span>
              </button>
            </div>

            <div className="text-center mb-4">
              <span
                className={`inline-flex items-center rounded px-2 py-1 text-sm ${
                  activeTab === "citizen"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-slate-50 text-slate-700 border border-slate-300"
                }`}
              >
                {activeTab === "citizen" ? (
                  <User className="h-3 w-3 mr-1" />
                ) : (
                  <Shield className="h-3 w-3 mr-1" />
                )}
                {activeTab === "citizen" ? "Citizen Portal Access" : "Government Staff Access"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (only in signup) */}
              {authMode === "signup" && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full h-12 pl-10 pr-10 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 h-8 w-8 text-slate-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only in signup) */}
              {authMode === "signup" && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {error && <div className="text-red-600 text-sm text-center">{error}</div>}

              <button
                type="submit"
                className={`w-full h-12 ${
                  activeTab === "citizen" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 hover:bg-slate-800"
                } text-white font-medium rounded flex items-center justify-center`}
                disabled={loading}
              >
                {loading
                  ? authMode === "login"
                    ? "Signing In..."
                    : "Creating Account..."
                  : authMode === "login"
                  ? `Sign In as ${activeTab === "citizen" ? "Citizen" : "Staff"}`
                  : "Sign Up as Citizen"}
              </button>
            </form>

            {/* Auth mode toggle */}
            <div className="text-center mt-4 text-sm text-slate-700">
              {authMode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("signup")
                      setActiveTab("citizen")
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("login")} className="text-blue-600 hover:underline">
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-slate-600">
            <p>© 2024 Municipal Government. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="text-xs text-slate-500 hover:underline">Privacy Policy</button>
              <span className="text-slate-400">|</span>
              <button className="text-xs text-slate-500 hover:underline">Terms of Service</button>
              <span className="text-slate-400">|</span>
              <button className="text-xs text-slate-500 hover:underline">Accessibility</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
