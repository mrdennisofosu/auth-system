import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { APP_NAME } from "../constants/app";
import { navigationByRole } from "../constants/navigation";
import { useAuth } from "../hooks/useAuth";

// The ONE layout for the whole app.
//   Signed out: navbar (with Sign In) + page + footer. No sidebar.
//   Signed in:  the sidebar appears automatically, with the menu for their role.
// It reads the signed-in user, so it reacts the moment someone signs in or out.
function AppLayout() {
  const { user, logout } = useAuth();

  // Is the phone drawer open? Shared by the Navbar (menu button) and the Sidebar.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The menu for this user's role, or nothing when signed out
  const navigation = user ? navigationByRole[user.role] : null;
  const hasSidebar = Boolean(navigation);

  async function handleLogout() {
    setSidebarOpen(false); // make sure the drawer is closed for the next sign-in
    await logout();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <Navbar
        user={user}
        showPublicLinks={!user}
        onMenuClick={hasSidebar ? () => setSidebarOpen(true) : undefined}
        onLogout={handleLogout}
      />

      <div className="flex flex-1">
        {hasSidebar && (
          <Sidebar
            navigation={navigation}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
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
    </div>
  );
}

export default AppLayout;
