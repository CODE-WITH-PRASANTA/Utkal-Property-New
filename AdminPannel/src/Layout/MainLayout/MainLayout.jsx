import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./MainLayout.css";

const MOBILE_MAX = 768;
const TABLET_MAX = 1024;

const isTabletWidth = () =>
  window.innerWidth > MOBILE_MAX && window.innerWidth <= TABLET_MAX;

const MainLayout = () => {
  // Tablets start collapsed so content never overlaps the sidebar
  const [isCollapsed, setIsCollapsed] = useState(isTabletWidth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= MOBILE_MAX) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Keep sidebar state in sync when the window is resized
  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const tabletQuery = window.matchMedia(
      `(min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`
    );

    const handleMobileChange = (e) => {
      if (!e.matches) setIsMobileOpen(false); // left mobile: close drawer
    };
    const handleTabletChange = (e) => {
      setIsCollapsed(e.matches); // collapse on tablet, expand on desktop
    };

    mobileQuery.addEventListener("change", handleMobileChange);
    tabletQuery.addEventListener("change", handleTabletChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      tabletQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  // While the mobile drawer is open: lock page scroll and allow Esc to close
  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen]);

  return (
    <div className={`MainLayout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onClose={closeMobileSidebar}
      />

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="MainLayout-overlay"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <div className="MainLayout-container">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="MainLayout-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;