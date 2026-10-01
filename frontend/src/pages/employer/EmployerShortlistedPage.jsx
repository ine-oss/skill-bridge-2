import { useState } from 'react'
import { ArrowRight, CalendarPlus, CheckCircle2, MessageSquare, UserRoundMinus } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import ScheduleInterviewForm from '../../components/common/ScheduleInterviewForm'
import useApi from '../../hooks/useApi'
import { toApplicantView } from '../../lib/format'
import { applicationService } from '../../services/applicationService'

export default function EmployerShortlistedPage() {
  const { data, loading, error, reload, setData } = useApi(() => applicationService.getApplications({ status: 'SHORTLISTED', limit: 100 }), [])
  const [scheduling, setScheduling] = useState(null)
  const [message, setMessage] = useState('')
  const shortlist = (data?.data || []).map(toApplicantView)

  const drop = (id) => setData((current) => ({ ...current, data: current.data.filter((item) => item.id !== id) }))
  const removeCandidate = async (id) => {
    try {
      await applicationService.updateStatus(id, 'REVIEWING', 'Removed from shortlist')
      drop(id)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Hiring pipeline" title="Shortlisted" description="Keep promising candidates together and move them toward a conversation." actionLabel="All applicants" actionTo="/employer/applicants" icon={ArrowRight} />
      {message && <p className="text-sm text-red-700" role="alert">{message}</p>}
      <AsyncState loading={loading} error={error} onRetry={reload}>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><CheckCircle2 size={20} className="shrink-0 text-emerald-700" /><p className="text-sm text-emerald-900"><span className="font-bold">{shortlist.length} candidates</span> are ready for the next step.</p></div>
        {shortlist.length === 0 ? (
          <div className="card-surface mt-6 p-10 text-center"><p className="font-semibold text-slate-800">Your shortlist is clear</p><p className="mt-1 text-sm text-slate-500">Move candidates here from the applicant list when they are a strong fit.</p><Link to="/employer/applicants" className="mt-4 inline-flex text-sm font-semibold text-blue-700">Review applicants</Link></div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {shortlist.map((candidate) => (
              <article key={candidate.id} className="card-surface p-5 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">{candidate.initials}</span><div className="min-w-0 flex-1"><h2 className="font-bold text-slate-900">{candidate.name}</h2><p className="mt-1 text-sm text-slate-500">{candidate.role}</p></div><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{candidate.match}% match</span></div>
                <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">{candidate.skills}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setScheduling(candidate.id)} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"><CalendarPlus size={16} />Invite to interview</button>
                  <Link to={`/employer/messages?to=${candidate.applicantId}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><MessageSquare size={16} />Message</Link>
                  <button type="button" onClick={() => removeCandidate(candidate.id)} className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"><UserRoundMinus size={16} />Remove</button>
                </div>
                {scheduling === candidate.id && <ScheduleInterviewForm applicationId={candidate.id} onCancel={() => setScheduling(null)} onScheduled={() => { setScheduling(null); drop(candidate.id) }} />}
              </article>
            ))}
          </div>
        )}
      </AsyncState>
    </div>
  )
}
