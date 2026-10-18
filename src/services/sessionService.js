import { delay } from '../mock/delay'
import { currentSession, mockSessions } from '../mock/mockSessions'
import { mockUsers } from '../mock/mockUsers'
import { recordActivity } from '../mock/mockActivity'
import { ACTIVITY_TYPE } from '../constants/activity'
import { ApiError } from './apiError'

// MOCK SERVICE for "where am I signed in". In Phase 11 this becomes
// GET /api/me/sessions and DELETE /api/me/sessions/:id (the backend knows who is asking).

function toPublic(session) {
  return {
    id: session.id,
    device: session.device,
    ip: session.ip,
    location: session.location,
    startedAt: session.startedAt,
    lastActive: session.lastActive,
    trusted: session.trusted,
    current: session.id === currentSession.id,
  }
}

function logSessionEvent(userId, description) {
  const user = mockUsers.find((account) => account.id === userId)
  if (!user) return

  recordActivity({
    type: ACTIVITY_TYPE.SESSION_REVOKED,
    actorName: user.fullName,
    actorEmail: user.email,
    description,
  })
}

// Active (not signed out) sessions, this device first, then most recent first.
export async function listSessions(userId) {
  await delay(400)

  const current = mockSessions.find((session) => session.id === currentSession.id)
  if (current) current.lastActive = new Date().toISOString()

  return mockSessions
    .filter((session) => session.userId === userId && !session.revoked)
    .map(toPublic)
    .sort(
      (a, b) =>
        Number(b.current) - Number(a.current) || new Date(b.lastActive) - new Date(a.lastActive),
    )
}

export async function revokeSession(userId, sessionId) {
  await delay(500)

  const session = mockSessions.find(
    (item) => item.id === sessionId && item.userId === userId && !item.revoked,
  )

  if (!session || session.id === currentSession.id) {
    throw new ApiError('That session cannot be signed out here.', {
      status: 400,
      code: 'INVALID_SESSION',
    })
  }

  session.revoked = true
  logSessionEvent(userId, `Signed out a session (${session.device}, ${session.location}).`)
}

export async function revokeOtherSessions(userId) {
  await delay(600)

  const others = mockSessions.filter(
    (session) => session.userId === userId && !session.revoked && session.id !== currentSession.id,
  )
  others.forEach((session) => {
    session.revoked = true
  })

  if (others.length > 0) {
    logSessionEvent(userId, `Signed out all other sessions (${others.length}).`)
  }
}