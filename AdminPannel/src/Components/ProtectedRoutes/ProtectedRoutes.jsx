import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AUTH_KEY = "isAdminAuthenticated";

const ProtectedRoutes = () => {
  const location = useLocation();

  const isAuthenticated =
    sessionStorage.getItem(AUTH_KEY) === "true" ||
    localStorage.getItem(AUTH_KEY) === "true";

  // Keep sessionStorage synced if "Remember me" was checked previously
  if (isAuthenticated && sessionStorage.getItem(AUTH_KEY) !== "true") {
    sessionStorage.setItem(AUTH_KEY, "true");
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;