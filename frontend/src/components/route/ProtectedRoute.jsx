// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

// This component wraps around protected routes and checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  // If there's no access token, redirect to login page
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components (protected routes)
  return children;
};

export default ProtectedRoute;