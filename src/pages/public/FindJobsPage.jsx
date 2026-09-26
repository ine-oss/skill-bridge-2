import JobCard from '../../components/cards/JobCard'
import { jobs } from '../../data/jobs'

export default function FindJobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8">
        <span className="section-kicker">Find jobs</span>
        <h1 className="section-title mt-4">Search opportunities that match your skills.</h1>
      </div>
      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-5">
        <input className="rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Search roles" />
        <input className="rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Location" />
        <select className="rounded-xl border border-slate-200 px-3 py-2.5"><option>Job type</option></select>
        <select className="rounded-xl border border-slate-200 px-3 py-2.5"><option>Experience</option></select>
        <button className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white">Search</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  )
}
