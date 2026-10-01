import { useState } from 'react'
import JobCard from '../../components/cards/JobCard'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { toJobView } from '../../lib/format'
import { jobService } from '../../services/jobService'

const emptyFilters = { q: '', type: '', mode: '' }

export default function FindJobsPage() {
  const [form, setForm] = useState(emptyFilters)
  const [filters, setFilters] = useState(emptyFilters)
  const { data, loading, error, reload } = useApi(() => jobService.getJobs({ ...filters, limit: 30 }), [filters])
  const jobs = (data?.data || []).map(toJobView)

  const handleSubmit = (event) => {
    event.preventDefault()
    setFilters(form)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8">
        <span className="section-kicker">Find jobs</span>
        <h1 className="section-title mt-4">Search opportunities that match your skills.</h1>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <label className="sr-only" htmlFor="job-search">Search roles</label>
        <input id="job-search" value={form.q} onChange={(event) => setForm({ ...form, q: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Search roles, skills or companies" />
        <label className="sr-only" htmlFor="job-type">Job type</label>
        <select id="job-type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5">
          <option value="">Any job type</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
        <label className="sr-only" htmlFor="job-mode">Work mode</label>
        <select id="job-mode" value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5">
          <option value="">Any work mode</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">On-site</option>
        </select>
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white">Search</button>
      </form>
      <AsyncState loading={loading} error={error} onRetry={reload} empty={jobs.length === 0} emptyTitle="No jobs match your search" emptyText="Try a different keyword or clear the filters.">
        <p className="mb-4 text-sm text-slate-500">{data?.meta.total} jobs found</p>
        <div className="grid gap-6 lg:grid-cols-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </AsyncState>
    </div>
  )
}
