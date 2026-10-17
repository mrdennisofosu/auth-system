import { delay } from '../mock/delay'
import { mockUsers } from '../mock/mockUsers'
import { mockActivities } from '../mock/mockActivity'
import { ACCOUNT_STATUS } from '../constants/statuses'
import { toPublicUser } from './authService'

// MOCK SERVICE: the numbers and lists for the admin Overview page.
// In Phase 11 this becomes one request, for example GET /api/admin/overview.
export async function getOverview() {
  await delay(500)

  const total = mockUsers.length
  const active = mockUsers.filter((user) => user.status === ACCOUNT_STATUS.ACTIVE).length
  const inactive = total - active

  // The last 6 months, ending at the month of the newest registration
  const newest = new Date(Math.max(...mockUsers.map((user) => new Date(user.createdAt))))
  const months = []
  for (let back = 5; back >= 0; back -= 1) {
    const date = new Date(Date.UTC(newest.getUTCFullYear(), newest.getUTCMonth() - back, 1))
    months.push({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      label: date.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }),
      count: 0,
    })
  }

  mockUsers.forEach((user) => {
    const created = new Date(user.createdAt)
    const bucket = months.find(
      (m) => m.year === created.getUTCFullYear() && m.month === created.getUTCMonth(),
    )
    if (bucket) bucket.count += 1
  })

  const recentUsers = [...mockUsers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(toPublicUser)

  return {
    totals: { total, active, inactive, newThisMonth: months[months.length - 1].count },
    registrationsByMonth: months.map(({ label, count }) => ({ label, count })),
    recentUsers,
    recentActivity: mockActivities.slice(0, 6).map((activity) => ({ ...activity })),
  }
}