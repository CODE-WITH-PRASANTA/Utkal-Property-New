import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";
import {
  clearAuthSession,
  getAuthToken,
  isJwtExpired,
  setAuthSession,
} from "../../config/auth";

const ProtectedRoutes = () => {
  const location = useLocation();
  const token = getAuthToken();
  const [status, setStatus] = useState(() =>
    token && !isJwtExpired(token) ? "checking" : "unauthenticated"
  );

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const activeToken = getAuthToken();
      if (!activeToken || isJwtExpired(activeToken)) {
        clearAuthSession();
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      try {
        const res = await fetch(`${API_ENDPOINTS.AUTH}/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
          clearAuthSession();
          if (!cancelled) setStatus("unauthenticated");
          return;
        }

        // Sync sessionStorage if token came from localStorage ("Remember me")
        if (!sessionStorage.getItem("adminAuthToken")) {
          const remembered = Boolean(localStorage.getItem("adminAuthToken"));
          setAuthSession(activeToken, data.admin || null, remembered);
        }

        if (!cancelled) setStatus("authenticated");
      } catch {
        // If backend is temporarily unreachable, keep token only if JWT itself is still valid
        if (!cancelled) {
          setStatus(isJwtExpired(activeToken) ? "unauthenticated" : "authenticated");
        }
      }
    };

    verify();

    const handleLoggedOut = () => setStatus("unauthenticated");
    window.addEventListener("adminLoggedOut", handleLoggedOut);

    return () => {
      cancelled = true;
      window.removeEventListener("adminLoggedOut", handleLoggedOut);
    };
  }, [token]);

  if (status === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inherit",
          color: "#0b5230",
          fontWeight: 600,
        }}
      >
        Verifying session...
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
