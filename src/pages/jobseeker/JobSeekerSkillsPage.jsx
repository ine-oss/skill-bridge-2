import { userSkills } from '../../data/skills'

export default function JobSeekerSkillsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">My skills</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {userSkills.map((skill) => (
            <div key={skill.name} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold text-slate-900">{skill.name}</div>
                <div className="text-sm text-slate-500">{skill.level}</div>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${skill.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
