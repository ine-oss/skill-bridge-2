export default function FAQPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <span className="section-kicker">FAQ</span>
      <h1 className="section-title mt-4">Frequently asked questions.</h1>
      <div className="mt-10 space-y-4">
        {[
          ['What is Skill Bridge?', 'Skill Bridge is a skills-to-employment platform connecting learners, employers, and training providers.'],
          ['How does matching work?', 'The platform evaluates skills, training, and evidence to recommend opportunities with the best fit.'],
          ['Can employers verify talent?', 'Yes, employers can review portfolios, evidence, and certifications for better hiring decisions.'],
        ].map(([question, answer]) => (
          <div key={question} className="card-surface p-5">
            <h3 className="text-lg font-bold text-slate-900">{question}</h3>
            <p className="mt-2 text-slate-600">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
