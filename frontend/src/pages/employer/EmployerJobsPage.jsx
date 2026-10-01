import { useState } from 'react'
import { BriefcaseBusiness, MapPin, Plus, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { jobService } from '../../services/jobService'

const filters = [['All', ''], ['Active', 'ACTIVE'], ['Paused', 'PAUSED'], ['Draft', 'DRAFT'], ['Closed', 'CLOSED']]
const statusTone = { ACTIVE: 'bg-emerald-50 text-emerald-700', DRAFT: 'bg-amber-50 text-amber-700', PAUSED: 'bg-slate-100 text-slate-600', CLOSED: 'bg-red-50 text-red-700' }

export default function EmployerJobsPage() {
  const { data, loading, error, reload, setData } = useApi(() => jobService.getMyJobs(), [])
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const jobs = data?.data || []
  const visibleJobs = jobs.filter((job) => !filter || job.status === filter)

  const setStatus = async (id, status) => {
    try {
      const { job } = await jobService.updateJob(id, { status })
      setData((current) => ({ data: current.data.map((item) => item.id === id ? job : item) }))
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    }
  }
  const remove = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? Its applications will be deleted too.`)) return
    try {
      await jobService.deleteJob(job.id)
      setData((current) => ({ data: current.data.filter((item) => item.id !== job.id) }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Recruiting" title="My jobs" description="Manage live listings, check application volume, and keep hiring plans up to date." actionLabel="Post a job" actionTo="/employer/post-job" icon={Plus} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter jobs by status">
        {filters.map(([text, value]) => <button key={text} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${filter === value ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{text}<span className="ml-2 text-xs opacity-75">{value ? jobs.filter((job) => job.status === value).length : jobs.length}</span></button>)}
      </div>
      {message && <p className="text-sm text-red-700" role="alert">{message}</p>}
      <AsyncState loading={loading} error={error} onRetry={reload} empty={visibleJobs.length === 0} emptyTitle={jobs.length ? 'No jobs in this status' : 'No jobs yet'} emptyText={jobs.length ? undefined : 'Post your first job to start receiving applicants.'}>
        <div className="space-y-3">
          {visibleJobs.map((job) => (
            <article key={job.id} className="card-surface flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Link to={`/jobs/${job.id}`} className="text-lg font-bold text-slate-900 hover:text-blue-700">{job.title}</Link><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[job.status]}`}>{label(job.status)}</span></div>
                <p className="mt-1 text-sm text-slate-500">{job.team || 'No team'} / {label(job.employmentType)} · {label(job.mode)}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin size={14} />{job.location}</span><span className="inline-flex items-center gap-1.5"><Users size={14} />{job.applicantsCount} applicants</span><span>Closes {job.deadline ? formatDate(job.deadline) : 'when filled'}</span></div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
                {job.status === 'DRAFT' && <button type="button" onClick={() => setStatus(job.id, 'ACTIVE')} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Publish</button>}
                {['ACTIVE', 'PAUSED'].includes(job.status) && <button type="button" onClick={() => setStatus(job.id, job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{job.status === 'ACTIVE' ? 'Pause listing' : 'Reactivate'}</button>}
                {job.status !== 'CLOSED' && job.status !== 'DRAFT' && <button type="button" onClick={() => setStatus(job.id, 'CLOSED')} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>}
                <Link to={`/employer/applicants?jobId=${job.id}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"><BriefcaseBusiness size={15} /> Applicants</Link>
                <button type="button" onClick={() => remove(job)} aria-label={`Delete ${job.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      </AsyncState>
    </div>
  )
}
