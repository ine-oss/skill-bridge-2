import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { INK, SERIES, STATUS, TRACK } from './viz'

/**
 * KPI tile: label · value · optional delta (vs a named period) · optional sparkline or meter.
 *   delta: { value: 12, period: 'vs previous 4 weeks', goodWhenUp: true }
 *   trend: [3, 5, 4, …]   meter: 0–100
 */
export default function StatTile({ label, value, sub, delta, trend, meter, icon: Icon, tone }) {
  const direction = delta?.value > 0 ? 'up' : delta?.value < 0 ? 'down' : 'flat'
  const good = direction === 'flat' ? null : (direction === 'up') === (delta?.goodWhenUp !== false)
  const DeltaIcon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus
  const toneClass = tone === 'warning' ? 'bg-amber-50 text-amber-700' : tone === 'critical' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'

  return (
    <div className="flex h-full min-h-36 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && <span className={`rounded-lg p-1.5 ${toneClass}`}><Icon size={16} aria-hidden="true" /></span>}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <div className="mt-auto pt-2">
        {delta && delta.value !== null && delta.value !== undefined ? (
          <p className="flex items-center gap-1 text-xs">
            <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: good === null ? INK.secondary : good ? STATUS.goodText : STATUS.criticalText }}>
              <DeltaIcon size={14} aria-hidden="true" />{delta.value > 0 ? '+' : ''}{delta.value}%
            </span>
            <span className="text-slate-500">{delta.period}</span>
          </p>
        ) : sub ? <p className="text-xs text-slate-500">{sub}</p> : null}
        {typeof meter === 'number' && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: TRACK }} role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={meter}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, meter)}%`, background: SERIES[0] }} />
          </div>
        )}
        {trend?.length > 1 && (
          <div className="mt-2 h-8" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.map((y, x) => ({ x, y }))} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <Line type="monotone" dataKey="y" stroke={SERIES[0]} strokeWidth={2} dot={false} isAnimationActive={false}
                  activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
