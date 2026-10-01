import { INK } from './viz'

/** Recharts tooltip: value first (strong), series name second, keyed with a short line in the series colour. */
export default function ChartTooltip({ active, payload, label, format = (v) => v, labelFormat = (l) => l }) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-36 rounded-lg border border-black/10 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-xs font-medium" style={{ color: INK.muted }}>{labelFormat(label)}</p>
      <ul className="space-y-1">
        {payload.map((item) => (
          <li key={item.dataKey} className="flex items-center gap-2 text-sm">
            <span className="h-0.5 w-3 rounded-full" style={{ background: item.color || item.payload?.fill }} aria-hidden="true" />
            <span className="font-semibold tabular-nums" style={{ color: INK.primary }}>{format(item.value, item)}</span>
            <span style={{ color: INK.secondary }}>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
