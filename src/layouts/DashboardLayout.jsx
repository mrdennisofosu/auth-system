import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// The shared frame for BOTH dashboards: navbar on top, sidebar on the left,
// and the current page (<Outlet />) in the main area.
function DashboardLayout({ user, navigation, onLogout }) {
  // Is the phone drawer open? The layout owns this, because both the
  // Navbar (menu button) and the Sidebar (drawer) need to share it.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={onLogout}
      />

      <div className="flex">
        <Sidebar
          navigation={navigation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
        />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
