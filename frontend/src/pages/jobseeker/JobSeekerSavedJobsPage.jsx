import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { jobService } from '../../services/jobService'

export default function JobSeekerSavedJobsPage() {
  const { data, loading, error, reload, setData } = useApi(() => jobService.getSavedJobs(), [])
  const jobs = data?.data || []

  const unsave = async (id) => {
    await jobService.unsaveJob(id)
    setData((current) => ({ data: current.data.filter((job) => job.id !== id) }))
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Saved jobs</h1>
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={jobs.length === 0} emptyTitle="No saved jobs" emptyText="Use “Save job” on any job page to keep it here.">
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-slate-900 hover:text-blue-700">{job.title}</Link>
                      <div className="text-sm text-slate-600">{job.company?.name} · {job.location}</div>
                    </div>
                    <button type="button" onClick={() => unsave(job.id)} className="text-sm font-medium text-slate-500 hover:text-red-700">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
