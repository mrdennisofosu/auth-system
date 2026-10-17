// "2026-10-12T09:00:00Z" -> "12 Oct 2026"
export function formatDate(isoString) {
  if (!isoString) return '-'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString))
}