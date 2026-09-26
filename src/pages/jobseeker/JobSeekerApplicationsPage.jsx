import { applications } from '../../data/applications'

export default function JobSeekerApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
        <div className="mt-6 space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xl font-bold text-slate-900">{application.jobTitle}</div>
                  <div className="text-sm text-slate-600">{application.company}</div>
                </div>
                <div className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{application.status}</div>
              </div>
              <div className="mt-3 text-sm text-slate-600">Match: {application.match}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
