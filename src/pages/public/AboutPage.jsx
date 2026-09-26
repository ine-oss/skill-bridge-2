export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <span className="section-kicker">About Skill Bridge</span>
      <h1 className="section-title mt-4">Connecting skills, learning, and opportunity.</h1>
      <p className="mt-5 max-w-3xl text-lg text-slate-600">
        Skill Bridge was designed to help people transition from learning to work by making skills visible, measurable, and actionable.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="card-surface p-6"><h3 className="text-xl font-bold">For learners</h3><p className="mt-2 text-slate-600">Track skills, close gaps, and access training that matches real job needs.</p></div>
        <div className="card-surface p-6"><h3 className="text-xl font-bold">For employers</h3><p className="mt-2 text-slate-600">Hire based on verified evidence, skill alignment, and job readiness.</p></div>
        <div className="card-surface p-6"><h3 className="text-xl font-bold">For trainers</h3><p className="mt-2 text-slate-600">Support learner progression with measurable outcomes and completion tracking.</p></div>
      </div>
    </div>
  )
}
