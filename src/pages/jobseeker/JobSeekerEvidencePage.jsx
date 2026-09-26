export default function JobSeekerEvidencePage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Evidence</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            'Project screenshots',
            'Certificates',
            'Training completion',
            'GitHub repositories',
            'Work samples',
            'References',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 p-4 text-slate-700">{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
