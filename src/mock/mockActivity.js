// MOCK DATA: the activity log. Deleted when the real backend is connected.
// Services call recordActivity() whenever something noteworthy happens,
// so the Activity Logs page will show real events.

import { ACTIVITY_TYPE } from '../constants/activity'

export const mockActivities = [
  {
    id: 'act-001',
    type: ACTIVITY_TYPE.LOGIN,
    actorName: 'Kwame Asante',
    actorEmail: 'admin@example.com',
    description: 'Signed in.',
    createdAt: '2026-10-14T08:30:00Z',
  },
  {
    id: 'act-002',
    type: ACTIVITY_TYPE.LOGIN,
    actorName: 'Ama Mensah',
    actorEmail: 'user@example.com',
    description: 'Signed in.',
    createdAt: '2026-10-15T17:45:00Z',
  },
  {
    id: 'act-003',
    type: ACTIVITY_TYPE.LOGIN_FAILED,
    actorName: 'Unknown',
    actorEmail: 'someone@example.com',
    description: 'Failed sign-in attempt (wrong email or password).',
    createdAt: '2026-10-15T20:12:00Z',
  },
  {
    id: 'act-004',
    type: ACTIVITY_TYPE.PASSWORD_CHANGED,
    actorName: 'Ama Mensah',
    actorEmail: 'user@example.com',
    description: 'Changed their password.',
    createdAt: '2026-10-10T09:05:00Z',
  },
  {
    id: 'act-005',
    type: ACTIVITY_TYPE.ACCOUNT_DEACTIVATED,
    actorName: 'Kwame Asante',
    actorEmail: 'admin@example.com',
    description: 'Deactivated the account of Kofi Boateng.',
    createdAt: '2026-08-02T10:10:00Z',
  },
  {
    id: 'act-006',
    type: ACTIVITY_TYPE.ROLE_CHANGED,
    actorName: 'Kwame Asante',
    actorEmail: 'admin@example.com',
    description: 'Changed the role of Efua Owusu to User.',
    createdAt: '2026-10-12T16:40:00Z',
  },
]

let nextActivityNumber = 7

// Adds a new event at the top of the list (newest first)
export function recordActivity({ type, actorName, actorEmail, description }) {
  mockActivities.unshift({
    id: `act-${String(nextActivityNumber).padStart(3, '0')}`,
    type,
    actorName,
    actorEmail,
    description,
    createdAt: new Date().toISOString(),
  })
  nextActivityNumber += 1
}