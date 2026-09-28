import { useState } from 'react'
import { CalendarDays, Check, Clock3, Video } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { employerInterviews as scheduledInterviews } from '../../data/employerWorkspace'

export default function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState(scheduledInterviews)
  const markComplete = (id) => setInterviews((current) => current.map((interview) => interview.id === id ? { ...interview, complete: true } : interview))

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Candidate pipeline" title="Interviews" description="Keep upcoming conversations and follow-up actions in view." actionLabel="Review applicants" actionTo="/employer/applicants" icon={CalendarDays} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Scheduled', interviews.filter((item) => !item.complete).length], ['Today', interviews.filter((item) => item.date === 'Today' && !item.complete).length], ['Completed', interviews.filter((item) => item.complete).length]].map(([label, value]) => <div key={label} className="card-surface p-5"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}
      </div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Interview schedule</h2><p className="mt-1 text-sm text-slate-500">Confirm the time and follow up after each conversation.</p></div>
        <div className="divide-y divide-slate-100">
          {interviews.map((interview) => (
            <article key={interview.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{interview.initials}</span><div><h3 className="font-semibold text-slate-900">{interview.name}</h3><p className="mt-1 text-sm text-slate-500">{interview.role} / {interview.type}</p></div></div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600"><span className="inline-flex items-center gap-1.5"><CalendarDays size={16} />{interview.date}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={16} />{interview.time}</span><span className="inline-flex items-center gap-1.5"><Video size={16} />Video call</span></div>
              <button type="button" disabled={interview.complete} onClick={() => markComplete(interview.id)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:border-emerald-100 disabled:bg-emerald-50 disabled:text-emerald-700"><Check size={15} />{interview.complete ? 'Completed' : 'Mark complete'}</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
