export default function JobSeekerRoadmapPage() {
  const steps = [
    'Learn JavaScript',
    'Learn React',
    'Build Projects',
    'Upload Evidence',
    'Complete Training',
    'Apply for Jobs',
    'Interview',
    'Employment',
  ]

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Career roadmap</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className={`rounded-2xl border p-5 ${index < 3 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</div>
              <div className="text-lg font-bold text-slate-900">{step}</div>
              <div className="mt-3 text-sm text-slate-600">{index < 3 ? 'Completed' : 'In progress'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
