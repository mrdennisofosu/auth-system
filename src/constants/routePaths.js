// Every URL in the app is defined here, once.

export const ROUTES = {
  // Public pages (anyone can open these)
  HOME: '/',
  ANNOUNCEMENTS: '/announcements',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCESS_DENIED: '/access-denied',

  // Admin dashboard
  ADMIN: {
    ROOT: '/admin',
    OVERVIEW: '/admin/overview',
    // Management group
    USERS: '/admin/users',
    ACTIVITY_LOGS: '/admin/activity-logs',
    ANNOUNCEMENTS: '/admin/announcements',
    SUPPORT: '/admin/support',
    // System
    SETTINGS: '/admin/settings',
    // Account group
    ACCOUNT: '/admin/account',
    ACCOUNT_PROFILE: '/admin/account/profile',
    ACCOUNT_SECURITY: '/admin/account/security',
    ACCOUNT_SESSIONS: '/admin/account/sessions',  },

  // User dashboard
  USER: {
    ROOT: '/user',
    DASHBOARD: '/user/dashboard',
    // Account group
    ACCOUNT: '/user/account',
    PROFILE: '/user/account/profile',
    // Security group
    SECURITY: '/user/security',
    PASSWORD: '/user/security/password',
    EMAIL_VERIFICATION: '/user/security/email-verification',
    SESSIONS: '/user/security/sessions',
    ACTIVITY: '/user/security/activity',
    // Other
    SUPPORT: '/user/support',
    ANNOUNCEMENTS: '/user/announcements',
  },
}