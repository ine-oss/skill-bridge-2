import { useParams } from 'react-router-dom'
import { BriefcaseBusiness, MapPin, CalendarDays, DollarSign } from 'lucide-react'
import { jobs } from '../../data/jobs'
import Button from '../../components/common/Button'

export default function JobDetailsPage() {
  const { id } = useParams()
  const job = jobs.find((item) => item.id === Number(id)) ?? jobs[0]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="card-surface p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-slate-500">{job.company}</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{job.title}</h1>
          </div>
          <Button>Apply now</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} /> {job.location}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><BriefcaseBusiness size={16} /> {job.employmentType}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><CalendarDays size={16} /> Deadline: {job.deadline}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><DollarSign size={16} /> {job.salary}</div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="text-xl font-bold text-slate-900">About the role</h2>
            <p className="mt-3 text-slate-600">{job.description}</p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Responsibilities</h3>
              <ul className="mt-3 space-y-2 text-slate-600">
                {job.responsibilities.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Requirements</h3>
              <ul className="mt-3 space-y-2 text-slate-600">
                {job.requirements.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">Required skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{skill}</span>
              ))}
            </div>
            <h3 className="mt-6 text-lg font-bold text-slate-900">Benefits</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {job.benefits.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
