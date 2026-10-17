import { delay } from '../mock/delay'
import { mockUsers } from '../mock/mockUsers'
import { createToken, resetTokens, verificationTokens } from '../mock/mockTokens'
import { recordActivity } from '../mock/mockActivity'
import { ACCOUNT_STATUS } from '../constants/statuses'
import { ACTIVITY_TYPE } from '../constants/activity'
import { ROLES } from '../constants/roles'
import { ApiError } from './apiError'

// MOCK SERVICE: pretends to be the server. In Phase 11 each function body
// becomes a real API request, and nothing that calls these functions changes.
// Fields marked "dev" (devVerificationToken, devResetToken) exist ONLY because
// there is no real email. A real backend would put those links in an email.

// Only these fields are ever sent to the UI. A real API never returns the password.
export function toPublicUser(user) {
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

function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase()
  return mockUsers.find((account) => account.email.toLowerCase() === normalized)
}

function expiredTokenError(what) {
  return new ApiError(`This ${what} link has expired.`, { status: 410, code: 'TOKEN_EXPIRED' })
}

function invalidTokenError(what) {
  return new ApiError(`This ${what} link is not valid.`, { status: 400, code: 'TOKEN_INVALID' })
}

// ---------------------------------------------------------------- LOGIN / LOGOUT

export async function login({ email, password }) {
  await delay()

  const normalizedEmail = email.trim().toLowerCase()
  const user = findUserByEmail(email)

  // One message for "unknown email" and "wrong password": never reveal which emails exist
  if (!user || user.password !== password) {
    recordActivity({
      type: ACTIVITY_TYPE.LOGIN_FAILED,
      actorName: user ? user.fullName : 'Unknown',
      actorEmail: normalizedEmail,
      description: 'Failed sign-in attempt (wrong email or password).',
    })
    throw new ApiError('Invalid email or password.', { status: 401, code: 'INVALID_CREDENTIALS' })
  }

  if (user.status === ACCOUNT_STATUS.INACTIVE) {
    recordActivity({
      type: ACTIVITY_TYPE.LOGIN_FAILED,
      actorName: user.fullName,
      actorEmail: user.email,
      description: 'Sign-in blocked: the account is deactivated.',
    })
    throw new ApiError(
      'This account has been deactivated. Please contact an administrator.',
      { status: 403, code: 'ACCOUNT_DEACTIVATED' },
    )
  }

  if (!user.emailVerified) {
    throw new ApiError('Please verify your email address before signing in.', {
      status: 403,
      code: 'EMAIL_NOT_VERIFIED',
    })
  }

  user.lastLogin = new Date().toISOString()
  recordActivity({
    type: ACTIVITY_TYPE.LOGIN,
    actorName: user.fullName,
    actorEmail: user.email,
    description: 'Signed in.',
  })
  return toPublicUser(user)
}

export async function logout() {
  await delay(300)
}

// ---------------------------------------------------------------- REGISTRATION

// Input: { fullName, email, password }
export async function register(payload) {
  await delay(900)

  const email = payload.email.trim().toLowerCase()

  if (findUserByEmail(email)) {
    throw new ApiError('An account with this email address already exists.', {
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
    })
  }

  const newUser = {
    id: `u-${String(mockUsers.length + 1).padStart(3, '0')}`,
    fullName: payload.fullName.trim(),
    email,
    password: payload.password, // MOCK ONLY: a real backend stores a hash, never the password
    role: ROLES.USER,
    status: ACCOUNT_STATUS.ACTIVE,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  }
  mockUsers.push(newUser)

  const token = createToken('verify')
  verificationTokens.set(token, { email })

  recordActivity({
    type: ACTIVITY_TYPE.REGISTER,
    actorName: newUser.fullName,
    actorEmail: email,
    description: 'Registered a new account.',
  })

  return {
    email,
    message: 'Registration successful. Please verify your email address.',
    devVerificationToken: token, // dev only
  }
}

// ---------------------------------------------------------------- EMAIL VERIFICATION

export async function verifyEmail(token) {
  await delay(1200)

  if (token === 'expired-token') throw expiredTokenError('verification')

  const entry = verificationTokens.get(token)
  if (!entry) throw invalidTokenError('verification')

  const user = findUserByEmail(entry.email)
  if (user && !user.emailVerified) {
    user.emailVerified = true
    recordActivity({
      type: ACTIVITY_TYPE.EMAIL_VERIFIED,
      actorName: user.fullName,
      actorEmail: user.email,
      description: 'Verified their email address.',
    })
  }

  // (Real tokens are single-use. Ours stay valid so testing is easy.)
  return { email: entry.email, message: 'Your email address has been verified.' }
}

// Input: { email }
export async function resendVerificationEmail(payload) {
  await delay(800)

  const account = findUserByEmail(payload.email)

  if (account && account.emailVerified) {
    throw new ApiError('This email address is already verified. You can sign in.', {
      status: 409,
      code: 'ALREADY_VERIFIED',
    })
  }

  // Unknown addresses get the SAME answer, so we never reveal which emails have accounts
  return {
    email: payload.email.trim().toLowerCase(),
    message: 'If an account exists for this address, a new verification link has been sent.',
  }
}

// ---------------------------------------------------------------- PASSWORD RESET

// Input: { email }
export async function requestPasswordReset(payload) {
  await delay(900)

  const user = findUserByEmail(payload.email)
  let token = null

  if (user) {
    token = createToken('reset')
    resetTokens.set(token, { email: user.email })
    recordActivity({
      type: ACTIVITY_TYPE.PASSWORD_RESET_REQUESTED,
      actorName: user.fullName,
      actorEmail: user.email,
      description: 'Requested a password reset.',
    })
  }

  // Same message whether or not the account exists
  return {
    message: 'If an account exists for this address, a password reset link has been sent.',
    devResetToken: token, // dev only
  }
}

// Checks a reset link BEFORE showing the "new password" form
export async function validateResetToken(token) {
  await delay(800)

  if (token === 'expired-token') throw expiredTokenError('password reset')
  if (!resetTokens.has(token)) throw invalidTokenError('password reset')

  return { valid: true }
}

// Input: { token, password }
export async function resetPassword({ token, password }) {
  await delay(1000)

  if (token === 'expired-token') throw expiredTokenError('password reset')

  const entry = resetTokens.get(token)
  if (!entry) throw invalidTokenError('password reset')

  const user = findUserByEmail(entry.email)
  if (!user) throw invalidTokenError('password reset')

  user.password = password // MOCK ONLY
  if (token !== 'valid-token') resetTokens.delete(token) // single-use (except our test token)

  recordActivity({
    type: ACTIVITY_TYPE.PASSWORD_RESET,
    actorName: user.fullName,
    actorEmail: user.email,
    description: 'Reset their password using an emailed link.',
  })

  return { message: 'Your password has been updated.' }
}

// ---------------------------------------------------------------- PASSWORD CHANGE (signed in)

// Input: { userId, currentPassword, newPassword }
// The page for this is built with the user dashboard (Security section).
export async function changePassword({ userId, currentPassword, newPassword }) {
  await delay(900)

  const user = mockUsers.find((account) => account.id === userId)

  if (!user || user.password !== currentPassword) {
    throw new ApiError('Your current password is incorrect.', {
      status: 400,
      code: 'CURRENT_PASSWORD_INCORRECT',
    })
  }

  if (newPassword === currentPassword) {
    throw new ApiError('Choose a password that is different from your current one.', {
      status: 400,
      code: 'SAME_PASSWORD',
    })
  }

  user.password = newPassword // MOCK ONLY
  recordActivity({
    type: ACTIVITY_TYPE.PASSWORD_CHANGED,
    actorName: user.fullName,
    actorEmail: user.email,
    description: 'Changed their password.',
  })

  return { message: 'Your password has been changed.' }
}