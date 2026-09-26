import { jobs } from '../../data/jobs'

export default function JobSeekerSavedJobsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Saved jobs</h1>
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">{job.title}</div>
                  <div className="text-sm text-slate-600">{job.company} · {job.location}</div>
                </div>
                <div className="text-sm font-medium text-blue-700">Saved</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
