import { useState } from 'react'
import { CalendarPlus, CheckCircle2, MessageSquare, Search, Star, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import ScheduleInterviewForm from '../../components/common/ScheduleInterviewForm'
import FileLink from '../../components/common/FileLink'
import useApi from '../../hooks/useApi'
import { applicantStatusStyles, toApplicantView } from '../../lib/format'
import { applicationService } from '../../services/applicationService'

const filters = [['All', ''], ['New', 'NEW'], ['Reviewing', 'REVIEWING'], ['Shortlisted', 'SHORTLISTED'], ['Interview', 'INTERVIEW'], ['Rejected', 'REJECTED']]

export default function EmployerApplicantsPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId') || undefined
  const { data, loading, error, reload, setData } = useApi(() => applicationService.getApplications({ jobId, limit: 100 }), [jobId])
  const [filter, setFilter] = useState('')
  const [query, setQuery] = useState('')
  const [scheduling, setScheduling] = useState(null)
  const [message, setMessage] = useState('')

  const applications = data?.data || []
  const applicants = applications.map(toApplicantView)
  const search = query.trim().toLowerCase()
  const visible = applicants.filter((applicant) => {
    const matchesFilter = !filter || applicant.rawStatus === filter
    const matchesSearch = !search || [applicant.name, applicant.role, applicant.skills].some((value) => value.toLowerCase().includes(search))
    return matchesFilter && matchesSearch
  })

  const replace = (application) => setData((current) => ({ ...current, data: current.data.map((item) => item.id === application.id ? application : item) }))
  const updateStatus = async (id, status) => {
    try {
      const { application } = await applicationService.updateStatus(id, status)
      replace(application)
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Hiring pipeline" title="Applicants" description="Review candidates, compare skill matches, and move the strongest people forward." actionLabel="View shortlist" actionTo="/employer/shortlisted" icon={Star} />
      {jobId && <p className="text-sm text-slate-600">Showing applicants for one job. <Link to="/employer/applicants" className="font-semibold text-blue-700">Show all</Link></p>}
      {message && <p className="text-sm text-red-700" role="alert">{message}</p>}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter applicants by status">
          {filters.map(([text, value]) => (
            <button key={text} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${filter === value ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
              {text}<span className="ml-2 text-xs opacity-75">{value ? applicants.filter((applicant) => applicant.rawStatus === value).length : applicants.length}</span>
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">Search applicants</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, role, or skill" className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none" />
        </label>
      </div>

      <AsyncState loading={loading} error={error} onRetry={reload} empty={visible.length === 0} emptyTitle={applicants.length ? 'No applicants match these filters' : 'No applicants yet'} emptyText={applicants.length ? 'Try another status or clear your search.' : 'Share your job listings to start receiving applications.'}>
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((applicant) => (
            <article key={applicant.id} className="card-surface p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">{applicant.initials}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900">{applicant.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{applicant.role} · Applied {applicant.applied}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${applicantStatusStyles[applicant.status] || 'bg-slate-100 text-slate-600'}`}>{applicant.status}</span>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Role skills: {applicant.skills || '—'}</span>
                  <span className="font-bold text-blue-700">{applicant.match}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${applicant.name} skill match`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={applicant.match}>
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${applicant.match}%` }} />
                </div>
              </div>
              {!['WITHDRAWN', 'HIRED', 'REJECTED'].includes(applicant.rawStatus) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {applicant.rawStatus === 'NEW' && <button type="button" onClick={() => updateStatus(applicant.id, 'REVIEWING')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Mark as reviewing</button>}
                  {['NEW', 'REVIEWING'].includes(applicant.rawStatus) && (
                    <button type="button" onClick={() => updateStatus(applicant.id, 'SHORTLISTED')} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"><CheckCircle2 size={16} />Shortlist</button>
                  )}
                  {['SHORTLISTED', 'INTERVIEW'].includes(applicant.rawStatus) && (
                    <button type="button" onClick={() => setScheduling(applicant.id)} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"><CalendarPlus size={16} />Schedule interview</button>
                  )}
                  {applicant.rawStatus === 'INTERVIEW' && <button type="button" onClick={() => updateStatus(applicant.id, 'OFFERED')} className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Make offer</button>}
                  {applicant.resumeUrl && <FileLink url={applicant.resumeUrl} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View CV</FileLink>}
                  <Link to={`/employer/messages?to=${applicant.applicantId}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><MessageSquare size={16} />Message</Link>
                  <button type="button" onClick={() => updateStatus(applicant.id, 'REJECTED')} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-700"><XCircle size={16} />Reject</button>
                </div>
              )}
              {applicant.rawStatus === 'OFFERED' && (
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => updateStatus(applicant.id, 'HIRED')} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Mark as hired</button>
                </div>
              )}
              {scheduling === applicant.id && (
                <ScheduleInterviewForm applicationId={applicant.id} onCancel={() => setScheduling(null)} onScheduled={() => { setScheduling(null); reload() }} />
              )}
            </article>
          ))}
        </div>
      </AsyncState>
    </div>
  )
}
