import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'
import { trainingService } from '../../services/trainingService'
import { userService } from '../../services/userService'

export default function JobSeekerRoadmapPage() {
  const { data, loading, error, reload } = useApi(async () => {
    const [profile, evidence, enrollments, applications] = await Promise.all([
      userService.getJobSeekerProfile(),
      userService.getEvidence(),
      trainingService.getEnrollments(),
      applicationService.getApplications({ limit: 100 }),
    ])
    return { profile: profile.profile, evidence: evidence.data, enrollments: enrollments.data, applications: applications.data }
  }, [])

  const statuses = (data?.applications || []).map((item) => item.status)
  const steps = data ? [
    ['Add your skills', data.profile.skills.length > 0, '/jobseeker/skills'],
    ['Complete your profile', data.profile.profileCompletion >= 80, '/jobseeker/portfolio'],
    ['Upload evidence', data.evidence.length > 0, '/jobseeker/evidence'],
    ['Start training', data.enrollments.length > 0, '/training'],
    ['Complete training', data.enrollments.some((item) => item.status === 'COMPLETED'), '/jobseeker/training'],
    ['Apply for jobs', statuses.length > 0, '/jobseeker/matched-jobs'],
    ['Interview', statuses.some((status) => ['INTERVIEW', 'OFFERED', 'HIRED'].includes(status)), '/jobseeker/interviews'],
    ['Employment', statuses.includes('HIRED'), '/jobseeker/applications'],
  ] : []
  const nextIndex = steps.findIndex(([, done]) => !done)

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Career roadmap</h1>
        <p className="mt-2 text-sm text-slate-500">Each step updates automatically from your profile, training and applications.</p>
        <div className="mt-8">
          <AsyncState loading={loading} error={error} onRetry={reload}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {steps.map(([step, done, link], index) => (
                <Link to={link} key={step} className={`rounded-2xl border p-5 transition hover:shadow-sm ${done ? 'border-emerald-200 bg-emerald-50' : index === nextIndex ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</div>
                  <div className="text-lg font-bold text-slate-900">{step}</div>
                  <div className="mt-3 text-sm text-slate-600">{done ? 'Completed' : index === nextIndex ? 'Your next step' : 'Not started'}</div>
                </Link>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
