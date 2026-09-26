export default function JobSeekerPortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            { title: 'Project: SkillBridge UI', type: 'Web app', detail: 'Built a responsive front-end for a skills-to-employment platform.' },
            { title: 'Certificate: Meta Front-End Developer', type: 'Certification', detail: 'Completed guided coursework in modern UI engineering.' },
            { title: 'Experience: Volunteer Designer', type: 'Experience', detail: 'Created landing pages for community-based campaigns.' },
            { title: 'Evidence: Coding challenge', type: 'Evidence', detail: 'Solved real-world frontend tasks with accessible UI patterns.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
              <div className="text-sm text-blue-700">{item.type}</div>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
