import { ArrowRight, MapPin, Briefcase, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

export default function JobCard({ job }) {
  return (
    <div className="card-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge tone="blue">{job.employmentType}</Badge>
            {job.mode && <Badge tone="green">{job.mode}</Badge>}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.company}</p>
        </div>
        <div className="rounded-xl bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">{job.salary}</div>
      </div>

      <div className="mb-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {job.location}</div>
        <div className="flex items-center gap-2"><Briefcase size={16} className="text-slate-400" /> {job.experience}</div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500"><BadgeCheck size={16} className="text-emerald-500" /> {job.posted}</div>
        <Link to={`/jobs/${job.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
          View details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
