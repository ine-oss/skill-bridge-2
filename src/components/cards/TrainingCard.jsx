import { Clock3, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

export default function TrainingCard({ training }) {
  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Badge tone="amber">{training.type}</Badge>
        <div className="text-sm font-medium text-slate-500">{training.difficulty}</div>
      </div>
      <h3 className="text-xl font-bold text-slate-900">{training.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{training.provider}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <Clock3 size={16} /> {training.duration}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {training.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{skill}</span>
        ))}
      </div>
      <Link to={`/training/${training.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
        Explore course <ArrowRight size={16} />
      </Link>
    </div>
  )
}
