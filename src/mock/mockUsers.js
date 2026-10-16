// MOCK DATA: fake accounts for frontend development only.
//
// - These are NOT real people and NOT real credentials.
// - Passwords are plain text here ONLY because this is pretend data.
//   A real backend never stores plain-text passwords (it stores hashes).
// - This is NOT secure authentication.
// - This whole file is deleted when the real backend is connected.

import { ROLES } from '../constants/roles'
import { ACCOUNT_STATUS } from '../constants/statuses'

export const MOCK_PASSWORD = 'Mock@1234'

export const mockUsers = [
  {
    id: 'u-001',
    fullName: 'Kwame Asante',
    email: 'admin@example.com',
    password: MOCK_PASSWORD,
    role: ROLES.ADMIN,
    status: ACCOUNT_STATUS.ACTIVE,
    emailVerified: true,
    createdAt: '2026-01-10T09:00:00Z',
    lastLogin: '2026-10-14T08:30:00Z',
  },
  {
    id: 'u-002',
    fullName: 'Ama Mensah',
    email: 'user@example.com',
    password: MOCK_PASSWORD,
    role: ROLES.USER,
    status: ACCOUNT_STATUS.ACTIVE,
    emailVerified: true,
    createdAt: '2026-02-03T11:15:00Z',
    lastLogin: '2026-10-15T17:45:00Z',
  },
  {
    // Used to test the "deactivated account" behavior
    id: 'u-003',
    fullName: 'Kofi Boateng',
    email: 'inactive@example.com',
    password: MOCK_PASSWORD,
    role: ROLES.USER,
    status: ACCOUNT_STATUS.INACTIVE,
    emailVerified: true,
    createdAt: '2026-03-21T14:00:00Z',
    lastLogin: '2026-08-02T10:10:00Z',
  },
  {
    // Not used yet; will be used for the email verification flow in Phase 3
    id: 'u-004',
    fullName: 'Efua Owusu',
    email: 'unverified@example.com',
    password: MOCK_PASSWORD,
    role: ROLES.USER,
    status: ACCOUNT_STATUS.ACTIVE,
    emailVerified: false,
    createdAt: '2026-10-12T16:20:00Z',
    lastLogin: null,
  },
]