import React from 'react'

function ProtectedRoute({ children }) {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };

export default ProtectedRoute