import { delay } from '../mock/delay'
import { mockActivities } from '../mock/mockActivity'
import { getActivityMeta } from '../utils/activityLabels'

// MOCK SERVICE for the activity log (admin). In Phase 11 this becomes GET /api/activity-logs.
// group = a filter such as 'signins' or 'failed'; from / to = dates like '2026-10-01'.
export async function listActivities({
  search = '',
  group = '',
  from = '',
  to = '',
  page = 1,
  pageSize = 10,
} = {}) {
  await delay(300)

  const term = search.trim().toLowerCase()
  const fromTime = from ? new Date(`${from}T00:00:00Z`).getTime() : null
  const toTime = to ? new Date(`${to}T23:59:59.999Z`).getTime() : null

  const filtered = mockActivities
    .filter((activity) => {
      const time = new Date(activity.createdAt).getTime()

      return (
        (!term ||
          activity.actorName.toLowerCase().includes(term) ||
          activity.actorEmail.toLowerCase().includes(term) ||
          activity.description.toLowerCase().includes(term)) &&
        (!group || getActivityMeta(activity.type).group === group) &&
        (fromTime === null || time >= fromTime) &&
        (toTime === null || time <= toTime)
      )
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize).map((activity) => ({ ...activity })),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  }
}

// One person's own recent activity (used on the Security pages).
export async function listRecentActivityForUser(email, limit = 5) {
  await delay(300)

  const normalized = email.toLowerCase()
  return mockActivities
    .filter((activity) => activity.actorEmail.toLowerCase() === normalized)
    .slice(0, limit)
    .map((activity) => ({ ...activity }))
}