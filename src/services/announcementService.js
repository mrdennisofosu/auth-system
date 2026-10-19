import { delay } from '../mock/delay'
import { mockAnnouncements } from '../mock/mockAnnouncements'
import { recordActivity } from '../mock/mockActivity'
import { ACTIVITY_TYPE } from '../constants/activity'
import { ANNOUNCEMENT_STATUS } from '../constants/statuses'
import { ApiError } from './apiError'

// MOCK SERVICE for announcements.
// In Phase 11 each function becomes a real request (GET/POST/PATCH/DELETE /api/announcements...).
// `actor` is the administrator: { fullName, email }.

// DEVELOPMENT SWITCH for the PUBLIC list (removed with the mock layer):
//   'normal' = works, 'error' = fails, 'empty' = returns nothing
const MOCK_MODE = 'normal'

let nextNumber = mockAnnouncements.length + 1

function find(id) {
  const announcement = mockAnnouncements.find((item) => item.id === id)
  if (!announcement) {
    throw new ApiError('Announcement not found.', { status: 404, code: 'ANNOUNCEMENT_NOT_FOUND' })
  }
  return announcement
}

function logAction(actor, description) {
  recordActivity({
    type: ACTIVITY_TYPE.ADMIN_ACTION,
    actorName: actor.fullName,
    actorEmail: actor.email,
    description,
  })
}

const byNewest = (a, b) =>
  new Date(b.publishedAt ?? b.createdAt) - new Date(a.publishedAt ?? a.createdAt)

// ---------------------------------------------------------------- PUBLIC (everyone)

// Published announcements only, newest first.
export async function getPublishedAnnouncements({ limit } = {}) {
  await delay()

  if (MOCK_MODE === 'error') {
    throw new ApiError('We could not load the announcements. Please try again.', {
      status: 500,
      code: 'SERVER_ERROR',
    })
  }

  if (MOCK_MODE === 'empty') return []

  const published = mockAnnouncements
    .filter((item) => item.status === ANNOUNCEMENT_STATUS.PUBLISHED)
    .sort(byNewest)
    .map((item) => ({ ...item }))

  return limit ? published.slice(0, limit) : published
}

// One published announcement (drafts are never visible here).
export async function getPublishedAnnouncement(id) {
  await delay(300)

  const announcement = mockAnnouncements.find((item) => item.id === id)
  if (!announcement || announcement.status !== ANNOUNCEMENT_STATUS.PUBLISHED) {
    throw new ApiError('This announcement could not be found.', {
      status: 404,
      code: 'ANNOUNCEMENT_NOT_FOUND',
    })
  }
  return { ...announcement }
}

// ---------------------------------------------------------------- ADMIN

// All announcements (drafts and published) with search, status filter and pagination.
export async function listAnnouncements({ search = '', status = '', page = 1, pageSize = 8 } = {}) {
  await delay(300)

  const term = search.trim().toLowerCase()

  const filtered = mockAnnouncements
    .filter(
      (item) =>
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term),
    )
    .filter((item) => !status || item.status === status)
    .sort(byNewest)

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize).map((item) => ({ ...item })),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  }
}

// Input: { title, content, publish }
export async function createAnnouncement({ title, content, publish }, actor) {
  await delay(700)

  const now = new Date().toISOString()
  const announcement = {
    id: `a-${String(nextNumber).padStart(3, '0')}`,
    title: title.trim(),
    content: content.trim(),
    status: publish ? ANNOUNCEMENT_STATUS.PUBLISHED : ANNOUNCEMENT_STATUS.DRAFT,
    createdAt: now,
    publishedAt: publish ? now : null,
  }
  nextNumber += 1
  mockAnnouncements.push(announcement)

  logAction(
    actor,
    `${publish ? 'Published' : 'Created a draft of'} the announcement "${announcement.title}".`,
  )
  return { ...announcement }
}

// Input: { title, content }
export async function updateAnnouncement(id, { title, content }, actor) {
  await delay(700)

  const announcement = find(id)
  announcement.title = title.trim()
  announcement.content = content.trim()

  logAction(actor, `Edited the announcement "${announcement.title}".`)
  return { ...announcement }
}

export async function setAnnouncementPublished(id, published, actor) {
  await delay(600)

  const announcement = find(id)
  announcement.status = published ? ANNOUNCEMENT_STATUS.PUBLISHED : ANNOUNCEMENT_STATUS.DRAFT
  announcement.publishedAt = published ? new Date().toISOString() : null

  logAction(
    actor,
    `${published ? 'Published' : 'Unpublished'} the announcement "${announcement.title}".`,
  )
  return { ...announcement }
}

export async function deleteAnnouncement(id, actor) {
  await delay(600)

  const announcement = find(id)
  mockAnnouncements.splice(mockAnnouncements.indexOf(announcement), 1)

  logAction(actor, `Deleted the announcement "${announcement.title}".`)
}

// What a VISITOR (not signed in) may see: title, date and a short opening line.
// The full text is only available to signed-in people (getPublishedAnnouncement).
function makeExcerpt(content, maxLength = 90) {
  const text = content.trim().replace(/\s+/g, ' ')
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
}

export async function getAnnouncementTeasers({ limit } = {}) {
  await delay()

  if (MOCK_MODE === 'error') {
    throw new ApiError('We could not load the announcements. Please try again.', {
      status: 500,
      code: 'SERVER_ERROR',
    })
  }

  if (MOCK_MODE === 'empty') return []

  const teasers = mockAnnouncements
    .filter((item) => item.status === ANNOUNCEMENT_STATUS.PUBLISHED)
    .sort(byNewest)
    .map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: makeExcerpt(item.content),
      publishedAt: item.publishedAt,
    }))

  return limit ? teasers.slice(0, limit) : teasers
}