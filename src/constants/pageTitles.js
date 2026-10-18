import { APP_NAME } from './app'
import { ROUTES } from './routePaths'

const TITLES = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.ANNOUNCEMENTS]: 'Announcements',
  [ROUTES.LOGIN]: 'Sign In',
  [ROUTES.REGISTER]: 'Register',
  [ROUTES.VERIFY_EMAIL]: 'Verify Email',
  [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
  [ROUTES.RESET_PASSWORD]: 'Reset Password',
  [ROUTES.ACCESS_DENIED]: 'Access Denied',
  [ROUTES.ADMIN.OVERVIEW]: 'Overview',
  [ROUTES.ADMIN.USERS]: 'User Management',
  [ROUTES.ADMIN.ACTIVITY_LOGS]: 'Activity Logs',
  [ROUTES.ADMIN.ANNOUNCEMENTS]: 'Manage Announcements',
  [ROUTES.ADMIN.SUPPORT]: 'Support Requests',
  [ROUTES.ADMIN.SETTINGS]: 'System Settings',
  [ROUTES.ADMIN.ACCOUNT_PROFILE]: 'My Profile',
  [ROUTES.ADMIN.ACCOUNT_SECURITY]: 'Security',
  [ROUTES.ADMIN.ACCOUNT_SESSIONS]: 'Active Sessions',
  [ROUTES.USER.DASHBOARD]: 'My Dashboard',
  [ROUTES.USER.PROFILE]: 'My Profile',
  [ROUTES.USER.PASSWORD]: 'Change Password',
  [ROUTES.USER.EMAIL_VERIFICATION]: 'Email Verification',
  [ROUTES.USER.SESSIONS]: 'Active Sessions',
  [ROUTES.USER.ACTIVITY]: 'Recent Activity',
  [ROUTES.USER.SUPPORT]: 'Support',
  [ROUTES.USER.ANNOUNCEMENTS]: 'Announcements',
}

// The text shown in the browser tab for a given URL path.
export function getPageTitle(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname

  if (TITLES[path]) return `${TITLES[path]} | ${APP_NAME}`

  if (
    path.startsWith(`${ROUTES.ANNOUNCEMENTS}/`) ||
    path.startsWith(`${ROUTES.USER.ANNOUNCEMENTS}/`)
  ) {
    return `Announcement | ${APP_NAME}`
  }

  return `Page not found | ${APP_NAME}`
}