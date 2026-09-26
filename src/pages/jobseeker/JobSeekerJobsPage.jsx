import JobCard from '../../components/cards/JobCard'
import { jobs } from '../../data/jobs'

export default function JobSeekerJobsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Find jobs</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </div>
    </div>
  )
}
