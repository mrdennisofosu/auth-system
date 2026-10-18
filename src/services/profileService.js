import { delay } from '../mock/delay'
import { mockUsers } from '../mock/mockUsers'
import { recordActivity } from '../mock/mockActivity'
import { ACTIVITY_TYPE } from '../constants/activity'
import { ApiError } from './apiError'
import { toPublicUser } from './authService'

// MOCK SERVICE: a signed-in person editing their own profile.
// In Phase 11 this becomes PATCH /api/me. Input: { fullName, email }
// (A real system would also ask the person to verify a changed email address.)
export async function updateProfile(userId, { fullName, email }) {
  await delay(800)

  const user = mockUsers.find((account) => account.id === userId)
  if (!user) throw new ApiError('Account not found.', { status: 404, code: 'USER_NOT_FOUND' })

  const normalized = email.trim().toLowerCase()
  const taken = mockUsers.some(
    (account) => account.id !== userId && account.email.toLowerCase() === normalized,
  )
  if (taken) {
    throw new ApiError('Another account already uses this email address.', {
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
    })
  }

  user.fullName = fullName.trim()
  user.email = normalized

  recordActivity({
    type: ACTIVITY_TYPE.PROFILE_UPDATED,
    actorName: user.fullName,
    actorEmail: user.email,
    description: 'Updated their profile information.',
  })

  return toPublicUser(user)
}