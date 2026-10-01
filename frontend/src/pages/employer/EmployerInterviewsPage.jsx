import { useState } from 'react'
import { CalendarDays, Check, Clock3, MapPin, X } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDay, formatTime, label } from '../../lib/format'
import { applicationService } from '../../services/applicationService'

export default function EmployerInterviewsPage() {
  const { data, loading, error, reload, setData } = useApi(() => applicationService.getInterviews(), [])
  const [message, setMessage] = useState('')
  const interviews = data?.data || []
  const scheduled = interviews.filter((item) => item.status === 'SCHEDULED')

  const setStatus = async (id, status) => {
    try {
      await applicationService.updateInterview(id, { status })
      setData((current) => ({ data: current.data.map((item) => item.id === id ? { ...item, status } : item) }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Candidate pipeline" title="Interviews" description="Keep upcoming conversations and follow-up actions in view." actionLabel="Review applicants" actionTo="/employer/applicants" icon={CalendarDays} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Scheduled', scheduled.length], ['Today', scheduled.filter((item) => formatDay(item.scheduledAt) === 'Today').length], ['Completed', interviews.filter((item) => item.status === 'COMPLETED').length]].map(([text, value]) => <div key={text} className="card-surface p-5"><p className="text-sm font-medium text-slate-500">{text}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}
      </div>
      {message && <p className="text-sm text-red-700" role="alert">{message}</p>}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Interview schedule</h2><p className="mt-1 text-sm text-slate-500">Schedule new interviews from the applicants or shortlist page.</p></div>
        <AsyncState loading={loading} error={error} onRetry={reload} empty={interviews.length === 0} emptyTitle="No interviews yet">
          <div className="divide-y divide-slate-100">
            {interviews.map((interview) => (
              <article key={interview.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{interview.candidate.initials}</span><div><h3 className="font-semibold text-slate-900">{interview.candidate.name}</h3><p className="mt-1 text-sm text-slate-500">{interview.job.title} / {interview.type}</p></div></div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600"><span className="inline-flex items-center gap-1.5"><CalendarDays size={16} />{formatDay(interview.scheduledAt)}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={16} />{formatTime(interview.scheduledAt)}</span>{interview.location && <span className="inline-flex items-center gap-1.5"><MapPin size={16} />{interview.location}</span>}</div>
                {interview.status === 'SCHEDULED' ? (
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setStatus(interview.id, 'COMPLETED')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Check size={15} />Mark complete</button>
                    <button type="button" onClick={() => setStatus(interview.id, 'CANCELLED')} aria-label="Cancel interview" className="rounded-lg px-2 py-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><X size={16} /></button>
                  </div>
                ) : (
                  <span className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${interview.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{label(interview.status)}</span>
                )}
              </article>
            ))}
          </div>
        </AsyncState>
      </section>
    </div>
  )
}
