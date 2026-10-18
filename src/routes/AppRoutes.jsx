import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "../constants/routePaths";
import { ROLES } from "../constants/roles";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PlaceholderPage from "../pages/PlaceholderPage";
import Home from "../pages/public/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AccessDenied from "../pages/auth/AccessDenied";
import RegistrationGate from "../components/auth/RegistrationGate";
import AnnouncementsPage from "../components/announcements/AnnouncementsPage";
import AnnouncementDetailPage from "../components/announcements/AnnouncementDetailPage";
import Overview from "../pages/admin/Overview";
import UserManagement from "../pages/admin/UserManagement";
import ActivityLogs from "../pages/admin/ActivityLogs";
import Announcements from "../pages/admin/Announcements";
import SupportRequests from "../pages/admin/SupportRequests";
import SystemSettings from "../pages/admin/SystemSettings";
import AccountProfile from "../pages/admin/AccountProfile";
import AccountSecurity from "../pages/admin/AccountSecurity";
import Dashboard from "../pages/user/Dashboard";
import Support from "../pages/user/Support";
import SecurityPassword from "../pages/user/SecurityPassword";
import SecurityEmail from "../pages/user/SecurityEmail";
import SecuritySessions from "../pages/user/SecuritySessions";
import SecurityActivity from "../pages/user/SecurityActivity";

function AppRoutes() {
  return (
    <Routes>
      {/* Every page uses the same AppLayout (sidebar only while signed in) */}
      <Route element={<AppLayout />}>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route
          path={ROUTES.ANNOUNCEMENTS}
          element={<AnnouncementsPage basePath={ROUTES.ANNOUNCEMENTS} />}
        />
        <Route
          path={`${ROUTES.ANNOUNCEMENTS}/:id`}
          element={<AnnouncementDetailPage listPath={ROUTES.ANNOUNCEMENTS} />}
        />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route
          path={ROUTES.REGISTER}
          element={
            <RegistrationGate>
              <Register />
            </RegistrationGate>
          }
        />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.ACCESS_DENIED} element={<AccessDenied />} />

        {/* ---------- ADMIN ROUTES: admins only ---------- */}
        <Route
          path={ROUTES.ADMIN.ROOT}
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
        >
          <Route
            index
            element={<Navigate to={ROUTES.ADMIN.OVERVIEW} replace />}
          />
          <Route path={ROUTES.ADMIN.OVERVIEW} element={<Overview />} />

          {/* Management group */}
          <Route path={ROUTES.ADMIN.USERS} element={<UserManagement />} />
          <Route path={ROUTES.ADMIN.ACTIVITY_LOGS} element={<ActivityLogs />} />
          <Route
            path={ROUTES.ADMIN.ANNOUNCEMENTS}
            element={<Announcements />}
          />
          <Route path={ROUTES.ADMIN.SUPPORT} element={<SupportRequests />} />

          {/* System */}
          <Route path={ROUTES.ADMIN.SETTINGS} element={<SystemSettings />} />

          {/* Account group */}
          <Route path={ROUTES.ADMIN.ACCOUNT}>
            <Route
              index
              element={<Navigate to={ROUTES.ADMIN.ACCOUNT_PROFILE} replace />}
            />
            <Route
              path={ROUTES.ADMIN.ACCOUNT_PROFILE}
              element={<AccountProfile />}
            />
            <Route
              path={ROUTES.ADMIN.ACCOUNT_SECURITY}
              element={<AccountSecurity />}
            />
          </Route>
        </Route>

        {/* ---------- USER ROUTES: signed-in users only ---------- */}
        <Route
          path={ROUTES.USER.ROOT}
          element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}
        >
          <Route
            index
            element={<Navigate to={ROUTES.USER.DASHBOARD} replace />}
          />
          <Route path={ROUTES.USER.DASHBOARD} element={<Dashboard />} />

          {/* Account group (the profile page is shared with the admin dashboard) */}
          <Route path={ROUTES.USER.ACCOUNT}>
            <Route
              index
              element={<Navigate to={ROUTES.USER.PROFILE} replace />}
            />
            <Route path={ROUTES.USER.PROFILE} element={<AccountProfile />} />
          </Route>

          {/* Security group */}
          <Route path={ROUTES.USER.SECURITY}>
            <Route
              index
              element={<Navigate to={ROUTES.USER.PASSWORD} replace />}
            />
            <Route path={ROUTES.USER.PASSWORD} element={<SecurityPassword />} />
            <Route
              path={ROUTES.USER.EMAIL_VERIFICATION}
              element={<SecurityEmail />}
            />
            <Route path={ROUTES.USER.SESSIONS} element={<SecuritySessions />} />
            <Route path={ROUTES.USER.ACTIVITY} element={<SecurityActivity />} />
          </Route>

          <Route path={ROUTES.USER.SUPPORT} element={<Support />} />
          <Route
            path={ROUTES.USER.ANNOUNCEMENTS}
            element={<AnnouncementsPage basePath={ROUTES.USER.ANNOUNCEMENTS} />}
          />
          <Route
            path={`${ROUTES.USER.ANNOUNCEMENTS}/:id`}
            element={
              <AnnouncementDetailPage listPath={ROUTES.USER.ANNOUNCEMENTS} />
            }
          />
        </Route>

        {/* ---------- UNKNOWN URLS ---------- */}
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
