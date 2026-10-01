import { useState } from 'react'
import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import ProgressBar from '../../components/common/ProgressBar'
import useApi from '../../hooks/useApi'
import { jobService } from '../../services/jobService'
import { skillService } from '../../services/skillService'

export default function JobSeekerSkillGapPage() {
  const [jobId, setJobId] = useState('')
  const jobs = useApi(() => jobService.getJobs({ limit: 100 }), [])
  const { data: gap, loading, error, reload } = useApi(() => skillService.getSkillGap('me', jobId || undefined), [jobId])

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-blue-600">Target career</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{gap?.targetCareer || 'Most in-demand skills'}</h1>
            {gap && <p className="mt-1 text-sm font-semibold text-blue-700">{gap.match}% ready</p>}
          </div>
          <div>
            <label htmlFor="gap-job" className="field-label">Compare against a specific job</label>
            <select id="gap-job" value={jobId} onChange={(event) => setJobId(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm md:w-72">
              <option value="">My target career</option>
              {(jobs.data?.data || []).map((job) => <option key={job.id} value={job.id}>{job.title} — {job.company?.name}</option>)}
            </select>
          </div>
        </div>

        <AsyncState loading={loading} error={error} onRetry={reload}>
          {gap && (
            <>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Current skills</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {gap.currentSkills.length === 0 && <Link to="/jobseeker/skills" className="text-sm font-semibold text-blue-700">Add your skills</Link>}
                    {gap.currentSkills.map((skill) => <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{skill}</span>)}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Required skills</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {gap.requiredSkills.map((skill) => <span key={skill} className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{skill}</span>)}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Missing skills</h2>
                  {gap.missingSkills.length === 0 ? <p className="mt-4 text-sm text-emerald-700">You have every required skill. Keep raising your scores.</p> : (
                    <ul className="mt-4 space-y-2 text-slate-700">{gap.missingSkills.map((skill) => <li key={skill}>• {skill}</li>)}</ul>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Recommended training</h2>
                  {gap.recommendedTraining.length === 0 ? <p className="mt-4 text-sm text-slate-500">No matching programs yet. <Link to="/training" className="font-semibold text-blue-700">Browse all training</Link></p> : (
                    <ul className="mt-4 space-y-2">
                      {gap.recommendedTraining.map((program) => <li key={program.id}><Link to={`/training/${program.id}`} className="font-semibold text-blue-700">{program.title}</Link> <span className="text-sm text-slate-500">· {program.provider?.name}</span></li>)}
                    </ul>
                  )}
                </div>
              </div>

              {gap.skillStrength.length > 0 && (
                <div className="mt-8 rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Skill strength</h2>
                  <div className="mt-5 space-y-4">
                    {gap.skillStrength.map((skill) => <ProgressBar key={skill.skill} value={skill.value} label={skill.skill} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </AsyncState>
      </div>
    </div>
  )
}
