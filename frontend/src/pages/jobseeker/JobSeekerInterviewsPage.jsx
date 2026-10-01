import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, formatTime, label } from '../../lib/format'
import { applicationService } from '../../services/applicationService'

export default function JobSeekerInterviewsPage() {
  const { data, loading, error, reload } = useApi(() => applicationService.getInterviews(), [])
  const interviews = data?.data || []

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Interviews</h1>
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={interviews.length === 0} emptyTitle="No interviews yet" emptyText="When an employer invites you, the details will appear here.">
            <div className="space-y-4">
              {interviews.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{item.type} · {item.job.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.company.name}{item.location ? ` · ${item.location}` : ''}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : item.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{label(item.status)}</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-700">{formatDate(item.scheduledAt, { weekday: 'short', day: 'numeric', month: 'short' })} · {formatTime(item.scheduledAt)} ({item.durationMins} min)</div>
                  {item.notes && <p className="mt-2 text-sm text-slate-600">{item.notes}</p>}
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
