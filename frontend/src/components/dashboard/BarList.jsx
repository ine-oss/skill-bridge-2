import { Link } from 'react-router-dom'
import { SERIES, TRACK } from './viz'

/**
 * Horizontal bars in plain HTML — handles long labels well and stays readable on phones.
 * rows: [{ key, label, value, display?, note?, href?, muted? }]; max defaults to the largest value.
 */
export default function BarList({ rows, max, color = SERIES[0], empty = 'No data yet' }) {
  const top = max ?? Math.max(1, ...rows.map((row) => row.value))
  if (!rows.length) return <p className="py-6 text-center text-sm text-slate-500">{empty}</p>
  return (
    <ul className="space-y-3.5">
      {rows.map((row) => {
        const width = Math.max(row.value > 0 ? 2 : 0, (row.value / top) * 100)
        const name = row.href ? <Link to={row.href} className="truncate font-medium text-slate-800 hover:text-blue-700">{row.label}</Link> : <span className="truncate font-medium text-slate-800">{row.label}</span>
        return (
          <li key={row.key ?? row.label} className="group" title={`${row.label}: ${row.display ?? row.value}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-baseline gap-2">{name}{row.note && <span className="shrink-0 text-xs text-slate-500">{row.note}</span>}</span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-900">{row.display ?? row.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: TRACK }}>
              <div className="h-full rounded-full transition-[filter] group-hover:brightness-110" style={{ width: `${width}%`, background: row.muted ? '#b9b8b1' : color }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
