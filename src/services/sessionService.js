import { delay } from '../mock/delay'
import { createDefaultSessions, sessionsByUser } from '../mock/mockSessions'
import { ApiError } from './apiError'

// MOCK SERVICE for "where am I signed in". In Phase 11 this becomes the backend's
// real session list (GET /api/me/sessions, DELETE /api/me/sessions/:id).

function sessionsFor(userId) {
  if (!sessionsByUser.has(userId)) sessionsByUser.set(userId, createDefaultSessions())
  return sessionsByUser.get(userId)
}

export async function listSessions(userId) {
  await delay(400)
  return sessionsFor(userId).map((session) => ({ ...session }))
}

export async function revokeSession(userId, sessionId) {
  await delay(500)

  const sessions = sessionsFor(userId)
  const session = sessions.find((item) => item.id === sessionId)

  if (!session || session.current) {
    throw new ApiError('That session cannot be signed out.', { status: 400, code: 'INVALID_SESSION' })
  }

  sessionsByUser.set(userId, sessions.filter((item) => item.id !== sessionId))
}

export async function revokeOtherSessions(userId) {
  await delay(600)
  sessionsByUser.set(userId, sessionsFor(userId).filter((item) => item.current))
}