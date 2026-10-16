import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { APP_NAME } from "../constants/app";
import { TEMP_PUBLIC_USER, tempLogout } from "../mock/tempSession";

// Frame for public pages: navbar on top, page in the middle, footer at the bottom.
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={TEMP_PUBLIC_USER} showPublicLinks onLogout={tempLogout} />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}

export default PublicLayout;
