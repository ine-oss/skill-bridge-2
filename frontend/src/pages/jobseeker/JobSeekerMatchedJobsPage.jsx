import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { jobService } from '../../services/jobService'

const tone = (match) => (match >= 75 ? 'bg-emerald-100 text-emerald-700' : match >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600')

export default function JobSeekerMatchedJobsPage() {
  const { data, loading, error, reload } = useApi(() => jobService.getMatchedJobs(), [])
  const jobs = data?.data || []

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Matched jobs</h1>
        <p className="mt-2 text-sm text-slate-500">Ranked by how well your skill scores cover each job's required skills.</p>
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={jobs.length === 0} emptyTitle="No open jobs right now">
            <div className="space-y-4">
              {jobs.map((job) => {
                const matched = job.skills.filter((skill) => !job.missingSkills.includes(skill))
                return (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="block rounded-2xl border border-slate-200 p-5 hover:border-blue-200">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-xl font-bold text-slate-900">{job.title}</div>
                        <div className="text-sm text-slate-600">{job.company?.name} · {job.location}</div>
                      </div>
                      <div className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${tone(job.match)}`}>{job.match}% match</div>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">
                      {matched.length > 0 && <>Matched: {matched.join(', ')}. </>}
                      {job.missingSkills.length > 0 ? <>Missing: {job.missingSkills.join(', ')}.</> : 'You have every required skill.'}
                    </div>
                  </Link>
                )
              })}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
