import { delay } from '../mock/delay'
import { mockSupportRequests } from '../mock/mockSupport'
import { recordActivity } from '../mock/mockActivity'
import { ACTIVITY_TYPE } from '../constants/activity'
import { ROLES } from '../constants/roles'
import { SUPPORT_STATUS } from '../constants/statuses'
import { supportStatusMeta } from '../utils/supportLabels'
import { ApiError } from './apiError'
import { QUICK_REPLIES } from '../constants/quickReplies'

// MOCK SERVICE for support requests, used by BOTH dashboards.
// In Phase 11 each function becomes a real request. The real backend also checks
// WHO is asking (here we pass the person in, as `actor` / `author` / `user`).

let nextNumber = mockSupportRequests.length + 1
let nextReplyNumber = 100

const copy = (item) => ({ ...item, replies: item.replies.map((entry) => ({ ...entry })) })
const byLatest = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)

function find(id) {
  const item = mockSupportRequests.find((request) => request.id === id)
  if (!item) throw new ApiError('Support request not found.', { status: 404, code: 'NOT_FOUND' })
  return item
}

function requireAdmin(person) {
  if (person.role !== ROLES.ADMIN) {
    throw new ApiError('Only administrators can do this.', { status: 403, code: 'FORBIDDEN' })
  }
}

function logAction(actor, description) {
  recordActivity({
    type: ACTIVITY_TYPE.ADMIN_ACTION,
    actorName: actor.fullName,
    actorEmail: actor.email,
    description,
  })
}

// ---------------------------------------------------------------- ADMIN

export async function listSupportRequests({ search = '', status = '', page = 1, pageSize = 8 } = {}) {
  await delay(300)

  const term = search.trim().toLowerCase()

  const filtered = mockSupportRequests
    .filter(
      (item) =>
        !term ||
        item.subject.toLowerCase().includes(term) ||
        item.userName.toLowerCase().includes(term) ||
        item.userEmail.toLowerCase().includes(term),
    )
    .filter((item) => !status || item.status === status)
    .sort(byLatest)

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize).map(copy),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  }
}

export async function replyToRequest(id, message, author) {
  await delay(700)
  requireAdmin(author)

  const item = find(id)
  nextReplyNumber += 1
  item.replies.push({
    id: `r-${nextReplyNumber}`,
    authorId: author.id,
    authorName: author.fullName,
    authorRole: author.role,
    message: message.trim(),
    createdAt: new Date().toISOString(),
  })

  // A first reply means somebody is working on it
  if (item.status === SUPPORT_STATUS.PENDING) item.status = SUPPORT_STATUS.IN_PROGRESS
  item.updatedAt = new Date().toISOString()

  logAction(author, `Replied to the support request "${item.subject}".`)
  return copy(item)
}

export async function updateRequestStatus(id, status, actor) {
  await delay(600)
  requireAdmin(actor)

  const item = find(id)
  item.status = status
  item.updatedAt = new Date().toISOString()

  logAction(
    actor,
    `Marked the support request "${item.subject}" as ${supportStatusMeta(status).label.toLowerCase()}.`,
  )
  return copy(item)
}

// ---------------------------------------------------------------- USER

// A person's own requests, most recently updated first.
export async function listMyRequests(userId) {
  await delay(400)

  return mockSupportRequests
    .filter((item) => item.userId === userId)
    .sort(byLatest)
    .map(copy)
}

// Input: { subject, message }
export async function createSupportRequest({ subject, message }, user) {
  await delay(800)

  const now = new Date().toISOString()
  const item = {
    id: `s-${String(nextNumber).padStart(3, '0')}`,
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    subject: subject.trim(),
    message: message.trim(),
    status: SUPPORT_STATUS.PENDING,
    createdAt: now,
    updatedAt: now,
    replies: [],
  }
  nextNumber += 1
  mockSupportRequests.push(item)

  return copy(item)
}

// The user's ONLY way to write back: choose one of the preset replies.
// The server owns the list, so no free text can be sent. A reply is allowed only
// when the last message came from an administrator, so nobody can flood the admin.
export async function sendQuickReply(id, presetId, user) {
  await delay(600)

  const item = find(id)

  if (item.userId !== user.id) {
    throw new ApiError('Support request not found.', { status: 404, code: 'NOT_FOUND' })
  }

  const preset = QUICK_REPLIES.find((reply) => reply.id === presetId)
  if (!preset) {
    throw new ApiError('That reply is not available.', { status: 400, code: 'INVALID_REPLY' })
  }

  const last = item.replies[item.replies.length - 1]
  if (!last || last.authorRole !== ROLES.ADMIN) {
    throw new ApiError('Please wait for support to reply before sending another message.', {
      status: 409,
      code: 'WAIT_FOR_SUPPORT',
    })
  }

  nextReplyNumber += 1
  item.replies.push({
    id: `r-${nextReplyNumber}`,
    authorId: user.id,
    authorName: user.fullName,
    authorRole: user.role,
    message: preset.message,
    createdAt: new Date().toISOString(),
  })

  if (preset.effect === 'resolve') item.status = SUPPORT_STATUS.RESOLVED
  if (preset.effect === 'reopen') item.status = SUPPORT_STATUS.IN_PROGRESS
  item.updatedAt = new Date().toISOString()

  return copy(item)
}