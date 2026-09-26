import { jobs } from '../../data/jobs'

export default function JobSeekerMatchedJobsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Matched jobs</h1>
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xl font-bold text-slate-900">{job.title}</div>
                  <div className="text-sm text-slate-600">{job.company}</div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">85% match</div>
              </div>
              <div className="mt-3 text-sm text-slate-600">Matched: HTML, CSS, JavaScript. Missing: React, SQL.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
