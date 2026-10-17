import { delay } from '../mock/delay'
import { mockUsers } from '../mock/mockUsers'
import { ACCOUNT_STATUS } from '../constants/statuses'
import { ApiError } from './apiError'

// MOCK SERVICE: pretends to be the server. Same inputs and outputs a real API
// would have, so components never need to change when the backend arrives.
//
// In Phase 11, the body of each function becomes a real request, for example:
//   const response = await fetch('/api/auth/login', { method: 'POST', ... })
//   if (!response.ok) throw new ApiError(...)
//   return response.json()
// ...and nothing that CALLS these functions has to change.

// Only these fields are ever sent to the UI. A real API never returns the password.
function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  }
}

export async function login({ email, password }) {
  await delay()

  const user = mockUsers.find(
    (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
  )

  // One message for both "unknown email" and "wrong password", on purpose:
  // it avoids revealing which emails have accounts.
  if (!user || user.password !== password) {
    throw new ApiError('Invalid email or password.', {
      status: 401,
      code: 'INVALID_CREDENTIALS',
    })
  }

  if (user.status === ACCOUNT_STATUS.INACTIVE) {
    throw new ApiError(
      'This account has been deactivated. Please contact an administrator.',
      { status: 403, code: 'ACCOUNT_DEACTIVATED' },
    )
  }

  user.lastLogin = new Date().toISOString()
  return toPublicUser(user)
}

export async function logout() {
  await delay(300)
}
// MOCK: registration.
// Input (what the backend will eventually receive): { fullName, email, password }
// For now it only checks whether the email is taken and returns success.
// Phase 3, Step 1 will also save the new account in the mock database and
// start email verification.
export async function register(payload) {
  await delay(900)

  const email = payload.email.trim().toLowerCase()
  const alreadyRegistered = mockUsers.some(
    (account) => account.email.toLowerCase() === email,
  )

  if (alreadyRegistered) {
    throw new ApiError('An account with this email address already exists.', {
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
    })
  }

  return {
    email,
    message: 'Registration successful. Please verify your email address.',
  }
}