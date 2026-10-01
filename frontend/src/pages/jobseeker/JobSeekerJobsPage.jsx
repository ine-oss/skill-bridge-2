import { useState } from 'react'
import JobCard from '../../components/cards/JobCard'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { toJobView } from '../../lib/format'
import { jobService } from '../../services/jobService'

export default function JobSeekerJobsPage() {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const { data, loading, error, reload } = useApi(() => jobService.getJobs({ q: search, limit: 30 }), [search])
  const jobs = (data?.data || []).map(toJobView)

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Find jobs</h1>
          <form onSubmit={(event) => { event.preventDefault(); setSearch(query) }} className="flex gap-2">
            <label className="sr-only" htmlFor="jobseeker-job-search">Search jobs</label>
            <input id="jobseeker-job-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles or skills" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Search</button>
          </form>
        </div>
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={jobs.length === 0} emptyTitle="No jobs found">
            <div className="grid gap-6 md:grid-cols-3">
              {jobs.map((job) => (
                <div key={job.id}>
                  <JobCard job={job} />
                  {typeof job.match === 'number' && <p className="mt-2 text-center text-xs font-semibold text-emerald-700">{job.match}% skill match</p>}
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
