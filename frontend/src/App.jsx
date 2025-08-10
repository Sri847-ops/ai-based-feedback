import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import UserDashboard from "./pages/user/UserDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import LoginPage from "./pages/LoginPage";
import ComplaintList from "./pages/user/ComplaintList";
import ComplaintForm from "./pages/user/ComplaintForm";
import ComplaintView from "./pages/staff/ComplaintView";
import "./index.css";

// Simple auth utility
function getAuth() {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  return { token, userType };
}

function ProtectedRoute({ children, allowedRoles }) {
  const { token, userType } = getAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userType)) {
    // If user is logged in but not allowed, redirect to their dashboard
    return <Navigate to={userType === "staff" ? "/staff" : "/"} replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/login";
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/complaints"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ComplaintList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/complaint-form"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ComplaintForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/complaint-view"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <ComplaintView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
