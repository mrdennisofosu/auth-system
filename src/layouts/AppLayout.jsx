import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { APP_NAME } from "../constants/app";
import { navigationByRole } from "../constants/navigation";
import { ROUTES } from "../constants/routePaths";
import { useAuth } from "../hooks/useAuth";

// The ONE layout for the whole app.
//   Signed out: navbar (with Sign In) + page + footer. No sidebar.
//   Signed in:  the sidebar appears automatically, with the menu for their role.
function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigation = user ? navigationByRole[user.role] : null;
  const hasSidebar = Boolean(navigation);

  // Every "Logout" button asks first
  function askToLogout() {
    setSidebarOpen(false);
    setConfirmingLogout(true);
  }

  async function performLogout() {
    setLoggingOut(true);
    navigate(ROUTES.HOME); // leave any protected page first
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setConfirmingLogout(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <Navbar
        user={user}
        showPublicLinks={!user}
        onMenuClick={hasSidebar ? () => setSidebarOpen(true) : undefined}
        onLogout={askToLogout}
      />

      <div className="flex flex-1">
        {hasSidebar && (
          <Sidebar
            navigation={navigation}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={askToLogout}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">
            <Outlet />
          </main>

          <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </footer>
        </div>
      </div>

      {confirmingLogout && (
        <ConfirmDialog
          title="Sign out"
          message="Are you sure you want to sign out?"
          confirmLabel="Sign out"
          loading={loggingOut}
          onCancel={() => setConfirmingLogout(false)}
          onConfirm={performLogout}
        />
      )}
    </div>
  );
}

export default AppLayout;
