import ProgressBar from '../../components/common/ProgressBar'
import { skillGapData } from '../../data/skills'

export default function JobSeekerSkillGapPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="mb-6">
          <div className="text-sm uppercase tracking-[0.2em] text-blue-600">Target career</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{skillGapData.targetCareer}</h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Current skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillGapData.currentSkills.map((skill) => <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{skill}</span>)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Required skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillGapData.requiredSkills.map((skill) => <span key={skill} className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{skill}</span>)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Missing skills</h2>
            <ul className="mt-4 space-y-2 text-slate-700">
              {skillGapData.missingSkills.map((skill) => <li key={skill}>• {skill}</li>)}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Recommended learning</h2>
            <ul className="mt-4 space-y-2 text-slate-700">
              {skillGapData.recommendedLearning.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-900">Skill strength</h2>
          <div className="mt-5 space-y-4">
            {skillGapData.skillStrength.map((skill) => (
              <ProgressBar key={skill.skill} value={skill.value} label={skill.skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
