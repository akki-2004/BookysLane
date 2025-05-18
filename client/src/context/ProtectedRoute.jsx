import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Or show spinner/loading while checking auth
    return <div className="text-center my-5">Loading...</div>;
  }

  if (!user) {
    // Not logged in => redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children; // User is logged in, render children components
};

export default ProtectedRoute;
