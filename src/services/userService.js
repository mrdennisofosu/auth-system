import { delay } from '../mock/delay'
import { mockUsers } from '../mock/mockUsers'
import { recordActivity } from '../mock/mockActivity'
import { ACTIVITY_TYPE } from '../constants/activity'
import { ACCOUNT_STATUS } from '../constants/statuses'
import { ROLES } from '../constants/roles'
import { roleLabel } from '../utils/labels'
import { ApiError } from './apiError'
import { toPublicUser } from './authService'

// MOCK SERVICE for administrators managing users.
// In Phase 11 each body becomes a real request (GET /api/users, PATCH /api/users/:id ...).
// `actor` is the administrator performing the action: { id, fullName, email }.

export const TEMP_PASSWORD = 'Welcome@123' // MOCK ONLY

function findById(id) {
  const user = mockUsers.find((account) => account.id === id)
  if (!user) throw new ApiError('User not found.', { status: 404, code: 'USER_NOT_FOUND' })
  return user
}

function emailTaken(email, exceptId) {
  const normalized = email.trim().toLowerCase()
  return mockUsers.some(
    (account) => account.id !== exceptId && account.email.toLowerCase() === normalized,
  )
}

function logAdminAction(actor, type, description) {
  recordActivity({ type, actorName: actor.fullName, actorEmail: actor.email, description })
}

// Search + filters + pagination, newest first.
export async function listUsers({ search = '', role = '', status = '', page = 1, pageSize = 8 } = {}) {
  await delay(300)

  const term = search.trim().toLowerCase()

  const filtered = mockUsers
    .filter(
      (account) =>
        !term ||
        account.fullName.toLowerCase().includes(term) ||
        account.email.toLowerCase().includes(term),
    )
    .filter((account) => !role || account.role === role)
    .filter((account) => !status || account.status === status)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize).map(toPublicUser),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  }
}

// Input: { fullName, email, role }. Returns { user, temporaryPassword }.
export async function createUser({ fullName, email, role }, actor) {
  await delay(800)

  if (emailTaken(email)) {
    throw new ApiError('An account with this email address already exists.', {
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
    })
  }

  const newUser = {
    id: `u-${String(mockUsers.length + 1).padStart(3, '0')}`,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password: TEMP_PASSWORD,
    role,
    status: ACCOUNT_STATUS.ACTIVE,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  }
  mockUsers.push(newUser)

  logAdminAction(actor, ACTIVITY_TYPE.ADMIN_ACTION, `Created the account of ${newUser.fullName}.`)
  return { user: toPublicUser(newUser), temporaryPassword: TEMP_PASSWORD }
}

// Input: { fullName, email }
export async function updateUser(id, { fullName, email }, actor) {
  await delay(700)

  const user = findById(id)

  if (emailTaken(email, id)) {
    throw new ApiError('Another account already uses this email address.', {
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
    })
  }

  user.fullName = fullName.trim()
  user.email = email.trim().toLowerCase()

  logAdminAction(actor, ACTIVITY_TYPE.ADMIN_ACTION, `Updated the details of ${user.fullName}.`)
  return toPublicUser(user)
}

export async function changeUserRole(id, role, actor) {
  await delay(700)

  const user = findById(id)

  if (id === actor.id) {
    throw new ApiError('You cannot change your own role.', { status: 400, code: 'SELF_ACTION' })
  }

  const adminCount = mockUsers.filter((account) => account.role === ROLES.ADMIN).length
  if (user.role === ROLES.ADMIN && role !== ROLES.ADMIN && adminCount <= 1) {
    throw new ApiError('There must be at least one administrator.', {
      status: 400,
      code: 'LAST_ADMIN',
    })
  }

  user.role = role
  logAdminAction(
    actor,
    ACTIVITY_TYPE.ROLE_CHANGED,
    `Changed the role of ${user.fullName} to ${roleLabel(role)}.`,
  )
  return toPublicUser(user)
}

export async function setUserStatus(id, status, actor) {
  await delay(700)

  const user = findById(id)

  if (id === actor.id) {
    throw new ApiError('You cannot deactivate your own account.', {
      status: 400,
      code: 'SELF_ACTION',
    })
  }

  user.status = status
  const activated = status === ACCOUNT_STATUS.ACTIVE
  logAdminAction(
    actor,
    activated ? ACTIVITY_TYPE.ACCOUNT_ACTIVATED : ACTIVITY_TYPE.ACCOUNT_DEACTIVATED,
    `${activated ? 'Activated' : 'Deactivated'} the account of ${user.fullName}.`,
  )
  return toPublicUser(user)
}