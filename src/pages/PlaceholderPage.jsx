import { Link, useLocation } from "react-router";
import { ROUTES } from "../constants/routePaths";
import DevSessionPanel from "./DevSessionPanel";

// TEMPORARY: used only while we build the real pages.
// Each route points here until its real page is created.

const testLinks = [
  ["Home", ROUTES.HOME],
  ["Announcements", ROUTES.ANNOUNCEMENTS],
  ["Login", ROUTES.LOGIN],
  ["Register", ROUTES.REGISTER],
  ["Verify Email", ROUTES.VERIFY_EMAIL],
  ["Forgot Password", ROUTES.FORGOT_PASSWORD],
  ["Reset Password", ROUTES.RESET_PASSWORD],
  ["Access Denied", ROUTES.ACCESS_DENIED],
  ["Admin Overview", ROUTES.ADMIN.OVERVIEW],
  ["Admin Users", ROUTES.ADMIN.USERS],
  ["Admin Activity Logs", ROUTES.ADMIN.ACTIVITY_LOGS],
  ["Admin Announcements", ROUTES.ADMIN.ANNOUNCEMENTS],
  ["Admin Support", ROUTES.ADMIN.SUPPORT],
  ["Admin Settings", ROUTES.ADMIN.SETTINGS],
  ["Admin Account Profile", ROUTES.ADMIN.ACCOUNT_PROFILE],
  ["Admin Account Security", ROUTES.ADMIN.ACCOUNT_SECURITY],
  ["User Dashboard", ROUTES.USER.DASHBOARD],
  ["User Profile", ROUTES.USER.PROFILE],
  ["User Change Password", ROUTES.USER.PASSWORD],
  ["User Email Verification", ROUTES.USER.EMAIL_VERIFICATION],
  ["User Active Sessions", ROUTES.USER.SESSIONS],
  ["User Recent Activity", ROUTES.USER.ACTIVITY],
  ["User Support", ROUTES.USER.SUPPORT],
  ["User Announcements", ROUTES.USER.ANNOUNCEMENTS],
];

function PlaceholderPage({ title }) {
  // useLocation tells us which URL is currently open
  const location = useLocation();

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-brand-700 sm:text-3xl">{title}</h1>
      <p className="mt-2 break-all text-slate-600">
        Placeholder page. Current URL:{" "}
        <strong className="text-slate-900">{location.pathname}</strong>
      </p>

      {/* Status colors we will use across the app */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium">
        <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
          Success
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
          Warning
        </span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">
          Danger
        </span>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">
          Info
        </span>
      </div>

      <DevSessionPanel />

      <h2 className="mt-8 text-lg font-semibold">Test links</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {testLinks.map(([label, path]) => (
          <Link
            key={path}
            to={path}
            className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PlaceholderPage;
