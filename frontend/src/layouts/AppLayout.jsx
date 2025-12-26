import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/Topbar/Topbar";
import "../styles/appShell.css";

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  // Fecha o drawer ao mudar de rota (mobile)
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="appShell">
      {/* Sidebar Desktop */}
      <aside className={`sidebarDesktop ${isCollapsed ? "collapsed" : ""}`}>
        <Sidebar
          variant="desktop"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          onNavigate={() => {}}
        />
      </aside>

      {/* Overlay + Drawer Mobile */}
      <div
        className={`mobileOverlay ${isMobileNavOpen ? "open" : ""}`}
        onClick={() => setIsMobileNavOpen(false)}
        role="presentation"
      />
      <aside className={`sidebarMobileDrawer ${isMobileNavOpen ? "open" : ""}`}>
        <Sidebar
          variant="mobile"
          isCollapsed={false}
          onToggleCollapse={() => {}}
          onNavigate={() => setIsMobileNavOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="mainArea">
        <TopBar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
        />
        <main className="pageContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
