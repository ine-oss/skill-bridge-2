import { label as statusLabel } from '../../lib/format'
import { SERIES, TRACK } from './viz'

/** Hiring funnel: each stage's bar is its share of everyone who applied, with stage-to-stage conversion. */
export default function Funnel({ stages, rejected }) {
  const total = stages[0]?.count || 0
  if (!total) return <p className="py-6 text-center text-sm text-slate-500">No applications yet</p>
  return (
    <div>
      <ol className="space-y-2.5">
        {stages.map((stage, index) => {
          const share = Math.round((stage.count / total) * 100)
          const previous = index ? stages[index - 1].count : null
          const conversion = previous ? Math.round((stage.count / previous) * 100) : null
          return (
            <li key={stage.status} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm" title={`${statusLabel(stage.status)}: ${stage.count} (${share}% of applicants)`}>
              <span className="leading-tight">
                <span className="block font-medium text-slate-700">{statusLabel(stage.status)}</span>
                {conversion !== null && <span className="block text-[11px] text-slate-500">{conversion}% of previous</span>}
              </span>
              <span className="h-5 overflow-hidden rounded-md" style={{ background: TRACK }}>
                <span className="block h-full rounded-md" style={{ width: `${Math.max(stage.count ? 3 : 0, share)}%`, background: SERIES[0] }} />
              </span>
              <span className="text-right font-semibold tabular-nums text-slate-900">{stage.count}</span>
            </li>
          )
        })}
      </ol>
      {typeof rejected === 'number' && rejected > 0 && <p className="mt-3 text-xs text-slate-500">{rejected} rejected along the way · bars show everyone who reached each stage</p>}
    </div>
  )
}
