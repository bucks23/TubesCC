import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check user role
  if (requiredRole) {
    if (!userStr) {
      return <Navigate to="/login" replace />;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Debug logging
      console.log("ProtectedRoute - User role:", user.role);
      console.log("ProtectedRoute - Required role:", requiredRole);
      console.log("ProtectedRoute - Role match:", user.role === requiredRole);

      if (user.role !== requiredRole) {
        // Redirect non-admin users trying to access admin routes
        if (requiredRole === "admin") {
          return <Navigate to="/" replace />;
        }
        // Add other role-based redirects as needed
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;