import {
  LayoutDashboard,
  Briefcase,
  Users,
  ScrollText,
  Megaphone,
  LifeBuoy,
  Settings,
  CircleUser,
  User,
  ShieldCheck,
  KeyRound,
  MailCheck,
  MonitorSmartphone,
  History,
} from 'lucide-react'
import { ROUTES } from './routePaths'
import { ROLES } from './roles'

// An item with "children" is a group (collapsible heading).
// An item without "children" is a single link.

export const adminNavigation = [
  { label: 'Overview', to: ROUTES.ADMIN.OVERVIEW, icon: LayoutDashboard },
  {
    label: 'Management',
    icon: Briefcase,
    children: [
      { label: 'User Management', to: ROUTES.ADMIN.USERS, icon: Users },
      { label: 'Activity Logs', to: ROUTES.ADMIN.ACTIVITY_LOGS, icon: ScrollText },
      { label: 'Announcements', to: ROUTES.ADMIN.ANNOUNCEMENTS, icon: Megaphone },
      { label: 'Support Requests', to: ROUTES.ADMIN.SUPPORT, icon: LifeBuoy },
    ],
  },
  { label: 'System Settings', to: ROUTES.ADMIN.SETTINGS, icon: Settings },
  {
    label: 'Account',
    icon: CircleUser,
    children: [
      { label: 'My Profile', to: ROUTES.ADMIN.ACCOUNT_PROFILE, icon: User },
      { label: 'Security', to: ROUTES.ADMIN.ACCOUNT_SECURITY, icon: ShieldCheck },
      { label: 'Active Sessions', to: ROUTES.ADMIN.ACCOUNT_SESSIONS, icon: MonitorSmartphone },    ],
  },
]

export const userNavigation = [
  { label: 'My Dashboard', to: ROUTES.USER.DASHBOARD, icon: LayoutDashboard },
  {
    label: 'Account',
    icon: CircleUser,
    children: [{ label: 'My Profile', to: ROUTES.USER.PROFILE, icon: User }],
  },
  {
    label: 'Security',
    icon: ShieldCheck,
    children: [
      { label: 'Change Password', to: ROUTES.USER.PASSWORD, icon: KeyRound },
      { label: 'Email Verification', to: ROUTES.USER.EMAIL_VERIFICATION, icon: MailCheck },
      { label: 'Active Sessions', to: ROUTES.USER.SESSIONS, icon: MonitorSmartphone },
      { label: 'Recent Activity', to: ROUTES.USER.ACTIVITY, icon: History },
    ],
  },
  { label: 'Support', to: ROUTES.USER.SUPPORT, icon: LifeBuoy },
  { label: 'Announcements', to: ROUTES.USER.ANNOUNCEMENTS, icon: Megaphone },
]

// Items shown in the dropdown under the user's name (top-right of the navbar)
export const profileMenuItems = {
  [ROLES.ADMIN]: [
    { label: 'Admin Dashboard', to: ROUTES.ADMIN.OVERVIEW, icon: LayoutDashboard },
    { label: 'My Account', to: ROUTES.ADMIN.ACCOUNT_PROFILE, icon: CircleUser },
  ],
  [ROLES.USER]: [
    { label: 'My Dashboard', to: ROUTES.USER.DASHBOARD, icon: LayoutDashboard },
    { label: 'My Profile', to: ROUTES.USER.PROFILE, icon: CircleUser },
  ],
}
// Which sidebar menu belongs to which role.
// AppLayout uses this to pick the menu for whoever is signed in.
export const navigationByRole = {
  [ROLES.ADMIN]: adminNavigation,
  [ROLES.USER]: userNavigation,
}