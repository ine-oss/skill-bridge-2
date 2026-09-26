import { skillCategories } from '../../data/skills'

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <span className="section-kicker">Skills</span>
      <h1 className="section-title mt-4">Explore skill categories that drive job readiness.</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {skillCategories.map((category) => (
          <div key={category.id} className="card-surface p-6">
            <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
