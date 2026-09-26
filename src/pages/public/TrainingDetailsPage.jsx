import { useParams } from 'react-router-dom'
import { Clock3, Award, Users } from 'lucide-react'
import { trainingCatalog } from '../../data/training'
import Button from '../../components/common/Button'

export default function TrainingDetailsPage() {
  const { id } = useParams()
  const training = trainingCatalog.find((item) => item.id === Number(id)) ?? trainingCatalog[0]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="card-surface p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">{training.provider}</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{training.title}</h1>
          </div>
          <Button>Enroll now</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Duration</div><div className="mt-2 flex items-center gap-2 font-semibold"><Clock3 size={16} /> {training.duration}</div></div>
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Difficulty</div><div className="mt-2 font-semibold">{training.difficulty}</div></div>
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Certificate</div><div className="mt-2 flex items-center gap-2 font-semibold"><Award size={16} /> {training.certificate ? 'Included' : 'Not included'}</div></div>
        </div>

        <p className="mt-6 text-slate-600">{training.description}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Skills gained</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {training.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{skill}</span>)}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Learners</h3>
            <div className="mt-3 flex items-center gap-2 text-slate-600"><Users size={16} /> 1,240 learners enrolled</div>
          </div>
        </div>
      </div>
    </div>
  )
}
