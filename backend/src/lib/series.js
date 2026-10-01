// Helpers for dashboard time series.

const DAY = 86_400_000

/** Monday 00:00 of the week containing `date` (local time). */
function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
}

/**
 * Buckets rows into the last `weeks` calendar weeks (oldest first).
 * `fields` maps output keys to { rows, date } where `date` picks the timestamp from a row.
 *   weeklySeries(12, { applications: { rows, date: (r) => r.createdAt } })
 *   → [{ week: '2026-07-06', label: 'Jul 6', applications: 3 }, …]
 */
export function weeklySeries(weeks, fields) {
  const first = startOfWeek(new Date(Date.now() - (weeks - 1) * 7 * DAY))
  const buckets = Array.from({ length: weeks }, (_, index) => {
    const start = new Date(first.getTime() + index * 7 * DAY)
    const row = { week: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`, label: start.toLocaleDateString('en', { month: 'short', day: 'numeric' }) }
    for (const key of Object.keys(fields)) row[key] = 0
    return row
  })
  for (const [key, { rows, date }] of Object.entries(fields)) {
    for (const row of rows) {
      const index = Math.floor((startOfWeek(date(row)).getTime() - first.getTime()) / (7 * DAY))
      if (index >= 0 && index < weeks) buckets[index][key] += 1
    }
  }
  return buckets
}

export const weeksAgo = (weeks) => startOfWeek(new Date(Date.now() - (weeks - 1) * 7 * DAY))

/** Counts values into labelled ranges, e.g. match % → [{ label: '85–100', count }]. */
export function histogram(values, ranges) {
  return ranges.map(([min, max, label]) => ({ label: label || `${min}–${max}`, count: values.filter((value) => value >= min && value <= max).length }))
}

/** Percentage change between the last two periods, or null when there is no base. */
export function change(current, previous) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}
