import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ allowedRoles, children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    user = null;
  }

  const location = useLocation();

  // Not "logged in" on frontend
  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.userType;
    if (!allowedRoles.includes(userRole)) {
      // Logged in but wrong role
      return <Navigate to="/landingPage" replace />;
    }
  }

  return children;
}
