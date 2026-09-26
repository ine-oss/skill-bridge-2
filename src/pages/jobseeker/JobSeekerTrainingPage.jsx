import { trainingCatalog } from '../../data/training'

export default function JobSeekerTrainingPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Training</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {trainingCatalog.map((training) => (
            <div key={training.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="text-xl font-bold text-slate-900">{training.title}</div>
              <div className="mt-1 text-sm text-slate-600">{training.provider}</div>
              <div className="mt-3 text-sm text-slate-500">Progress: {training.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
