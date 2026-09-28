import { useState } from 'react'
import { BriefcaseBusiness, MapPin, Plus, Users } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { employerJobs as initialJobs } from '../../data/employerWorkspace'
import { readWorkspaceData, writeWorkspaceData } from '../../data/workspaceStorage'

const filters = ['All', 'Active', 'Paused', 'Draft']
const jobsStorageKey = 'skillbridge-employer-jobs-v1'

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState(() => readWorkspaceData(jobsStorageKey, initialJobs))
  const [filter, setFilter] = useState('All')
  const visibleJobs = jobs.filter((job) => filter === 'All' || job.status === filter)
  const toggleStatus = (id) => {
    const updatedJobs = jobs.map((job) => job.id === id ? { ...job, status: job.status === 'Active' ? 'Paused' : 'Active' } : job)
    setJobs(updatedJobs)
    writeWorkspaceData(jobsStorageKey, updatedJobs)
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Recruiting" title="My jobs" description="Manage live listings, check application volume, and keep hiring plans up to date." actionLabel="Post a job" actionTo="/employer/post-job" icon={Plus} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter jobs by status">
        {filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${filter === item ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{item}<span className="ml-2 text-xs opacity-75">{item === 'All' ? jobs.length : jobs.filter((job) => job.status === item).length}</span></button>)}
      </div>
      <div className="space-y-3">
        {visibleJobs.map((job) => (
          <article key={job.id} className="card-surface flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-slate-900">{job.title}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : job.status === 'Draft' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{job.status}</span></div>
              <p className="mt-1 text-sm text-slate-500">{job.team} / {job.type}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin size={14} />{job.location}</span><span className="inline-flex items-center gap-1.5"><Users size={14} />{job.applicants} applicants</span><span>Closes {job.closes}</span></div>
            </div>
            <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
              {job.status !== 'Draft' && <button type="button" onClick={() => toggleStatus(job.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{job.status === 'Active' ? 'Pause listing' : 'Reactivate'}</button>}
              <a href="/employer/applicants" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"><BriefcaseBusiness size={15} /> Applicants</a>
            </div>
          </article>
        ))}
        {visibleJobs.length === 0 && <div className="card-surface p-10 text-center text-sm text-slate-500">No jobs in this status yet.</div>}
      </div>
    </div>
  )
}
