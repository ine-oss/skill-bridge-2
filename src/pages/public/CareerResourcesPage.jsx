export default function CareerResourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <span className="section-kicker">Career resources</span>
      <h1 className="section-title mt-4">Guides for your next move.</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          'How to write a strong CV for a skills-based application.',
          'Preparing for a portfolio review and technical screening.',
          'Understanding the difference between skill gaps and job readiness.',
          'How to build a credible evidence profile for employers.',
        ].map((item) => (
          <div key={item} className="card-surface p-6">{item}</div>
        ))}
      </div>
    </div>
  )
}
