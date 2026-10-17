import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "../constants/routePaths";
import PlaceholderPage from "../pages/PlaceholderPage";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/public/Home";
import Register from "../pages/auth/Register";

function AppRoutes() {
  return (
    <Routes>
      {/* Every page uses the same AppLayout. It shows the sidebar only
          while someone is signed in. */}
      <Route element={<AppLayout />}>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route
          path={ROUTES.ANNOUNCEMENTS}
          element={<PlaceholderPage title="Public Announcements" />}
        />
        <Route
          path={ROUTES.LOGIN}
          element={<PlaceholderPage title="Sign In" />}
        />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route
          path={ROUTES.VERIFY_EMAIL}
          element={<PlaceholderPage title="Verify Email" />}
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={<PlaceholderPage title="Forgot Password" />}
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={<PlaceholderPage title="Reset Password" />}
        />
        <Route
          path={ROUTES.ACCESS_DENIED}
          element={<PlaceholderPage title="Access Denied" />}
        />

        {/* ---------- ADMIN ROUTES ----------
            Admin only (guard added in Phase 3). */}
        <Route path={ROUTES.ADMIN.ROOT}>
          <Route
            index
            element={<Navigate to={ROUTES.ADMIN.OVERVIEW} replace />}
          />
          <Route
            path={ROUTES.ADMIN.OVERVIEW}
            element={<PlaceholderPage title="Admin: Overview" />}
          />

          {/* Management group */}
          <Route
            path={ROUTES.ADMIN.USERS}
            element={<PlaceholderPage title="Admin: User Management" />}
          />
          <Route
            path={ROUTES.ADMIN.ACTIVITY_LOGS}
            element={<PlaceholderPage title="Admin: Activity Logs" />}
          />
          <Route
            path={ROUTES.ADMIN.ANNOUNCEMENTS}
            element={<PlaceholderPage title="Admin: Announcements" />}
          />
          <Route
            path={ROUTES.ADMIN.SUPPORT}
            element={<PlaceholderPage title="Admin: Support Requests" />}
          />

          {/* System */}
          <Route
            path={ROUTES.ADMIN.SETTINGS}
            element={<PlaceholderPage title="Admin: System Settings" />}
          />

          {/* Account group */}
          <Route path={ROUTES.ADMIN.ACCOUNT}>
            <Route
              index
              element={<Navigate to={ROUTES.ADMIN.ACCOUNT_PROFILE} replace />}
            />
            <Route
              path={ROUTES.ADMIN.ACCOUNT_PROFILE}
              element={<PlaceholderPage title="Admin Account: My Profile" />}
            />
            <Route
              path={ROUTES.ADMIN.ACCOUNT_SECURITY}
              element={<PlaceholderPage title="Admin Account: Security" />}
            />
          </Route>
        </Route>

        {/* ---------- USER ROUTES ----------
            Signed-in users only (guard added in Phase 3). */}
        <Route path={ROUTES.USER.ROOT}>
          <Route
            index
            element={<Navigate to={ROUTES.USER.DASHBOARD} replace />}
          />
          <Route
            path={ROUTES.USER.DASHBOARD}
            element={<PlaceholderPage title="My Dashboard" />}
          />

          {/* Account group */}
          <Route path={ROUTES.USER.ACCOUNT}>
            <Route
              index
              element={<Navigate to={ROUTES.USER.PROFILE} replace />}
            />
            <Route
              path={ROUTES.USER.PROFILE}
              element={<PlaceholderPage title="Account: My Profile" />}
            />
          </Route>

          {/* Security group */}
          <Route path={ROUTES.USER.SECURITY}>
            <Route
              index
              element={<Navigate to={ROUTES.USER.PASSWORD} replace />}
            />
            <Route
              path={ROUTES.USER.PASSWORD}
              element={<PlaceholderPage title="Security: Change Password" />}
            />
            <Route
              path={ROUTES.USER.EMAIL_VERIFICATION}
              element={<PlaceholderPage title="Security: Email Verification" />}
            />
            <Route
              path={ROUTES.USER.SESSIONS}
              element={<PlaceholderPage title="Security: Active Sessions" />}
            />
            <Route
              path={ROUTES.USER.ACTIVITY}
              element={<PlaceholderPage title="Security: Recent Activity" />}
            />
          </Route>

          <Route
            path={ROUTES.USER.SUPPORT}
            element={<PlaceholderPage title="Support" />}
          />
          <Route
            path={ROUTES.USER.ANNOUNCEMENTS}
            element={<PlaceholderPage title="Announcements" />}
          />
        </Route>

        {/* ---------- UNKNOWN URLS ---------- */}
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
