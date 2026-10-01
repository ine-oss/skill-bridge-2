export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <span className="section-kicker">How it works</span>
      <h1 className="section-title mt-4">From skills gap to employed outcome.</h1>
      <div className="mt-10 space-y-6">
        {[
          'Create a profile and identify your skills and target role.',
          'Build evidence through projects, training, and certificates.',
          'Receive skill gap analysis and recommended learning paths.',
          'Apply to roles matched by your demonstrated ability.',
          'Track interviews and progress through to employment.',
        ].map((step, index) => (
          <div key={step} className="card-surface flex gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">{index + 1}</div>
            <p className="text-lg text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
