import { delay } from '../mock/delay'
import { mockAnnouncements } from '../mock/mockAnnouncements'
import { ANNOUNCEMENT_STATUS } from '../constants/statuses'
import { ApiError } from './apiError'

// MOCK SERVICE. In Phase 11 the body becomes a real request, for example:
//   fetch('/api/announcements?status=published&limit=3')
// and nothing that calls this function has to change.

// DEVELOPMENT SWITCH (removed with the mock layer): lets us test every state.
//   'normal' = works, 'error' = fails, 'empty' = returns nothing
const MOCK_MODE = 'normal'

// Returns published announcements only, newest first.
export async function getPublishedAnnouncements({ limit } = {}) {
  await delay()

  if (MOCK_MODE === 'error') {
    throw new ApiError('We could not load the announcements. Please try again.', {
      status: 500,
      code: 'SERVER_ERROR',
    })
  }

  if (MOCK_MODE === 'empty') {
    return []
  }

  const published = mockAnnouncements
    .filter((announcement) => announcement.status === ANNOUNCEMENT_STATUS.PUBLISHED)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map((announcement) => ({ ...announcement })) // copies, so the UI can't alter the mock data

  return limit ? published.slice(0, limit) : published
}