import { ArrowRight, BriefcaseBusiness, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { label } from '../../lib/format'
import { applicationService } from '../../services/applicationService'
import { jobService } from '../../services/jobService'

const PIPELINE = ['NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED']

function lastSixMonths(applications) {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleString('en', { month: 'short' }), value: 0 })
  }
  applications.forEach((application) => {
    const date = new Date(application.createdAt)
    const month = months.find((item) => item.key === `${date.getFullYear()}-${date.getMonth()}`)
    if (month) month.value += 1
  })
  return months
}

export default function EmployerAnalyticsPage() {
  const { data, loading, error, reload } = useApi(async () => {
    const [jobs, applications] = await Promise.all([jobService.getMyJobs(), applicationService.getApplications({ limit: 100 })])
    return { jobs: jobs.data, applications: applications.data }
  }, [])

  const jobs = data?.jobs || []
  const applications = data?.applications || []
  const activeJobs = jobs.filter((job) => job.status === 'ACTIVE')
  const averageMatch = applications.length ? Math.round(applications.reduce((total, item) => total + item.match, 0) / applications.length) : 0
  const monthly = lastSixMonths(applications)
  const peak = Math.max(1, ...monthly.map((month) => month.value))
  const maxApplicants = Math.max(1, ...activeJobs.map((job) => job.applicantsCount))

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Employer workspace" title="Hiring analytics" description="See how your open roles are attracting and moving candidates through the hiring process." actionLabel="Review applicants" actionTo="/employer/applicants" icon={ArrowRight} />
      <AsyncState loading={loading} error={error} onRetry={reload}>
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Hiring analytics summary">
          {[[BriefcaseBusiness, 'Active roles', activeJobs.length, 'Currently accepting candidates', 'bg-blue-50 text-blue-700'], [Users, 'Applications', applications.length, 'Across all your roles', 'bg-emerald-50 text-emerald-700'], [TrendingUp, 'Average candidate match', `${averageMatch}%`, 'Skills match across applicants', 'bg-amber-50 text-amber-700']].map(([Icon, text, value, detail, color]) => <div key={text} className="card-surface p-5"><span className={`inline-flex rounded-lg p-2 ${color}`}><Icon size={18} /></span><p className="mt-4 text-sm text-slate-500">{text}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}
        </section>
        <section className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
          <div className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Application activity</h2>
            <p className="mt-1 text-sm text-slate-500">Applications received per month</p>
            <div className="mt-8 flex h-56 items-end justify-around gap-4 border-b border-slate-100 px-3">
              {monthly.map((month) => <div key={month.key} className="flex h-full w-full max-w-20 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-slate-500">{month.value}</span><div className="w-full rounded-t-md bg-blue-700" style={{ height: `${(month.value / peak) * 80}%`, minHeight: month.value ? 4 : 0 }} /><span className="pb-3 text-xs text-slate-500">{month.label}</span></div>)}
            </div>
            <h3 className="mt-6 text-sm font-bold text-slate-900">Pipeline</h3>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {PIPELINE.map((status) => <div key={status} className="rounded-lg bg-slate-50 p-3 text-center"><p className="text-xl font-bold text-slate-900">{applications.filter((item) => item.status === status).length}</p><p className="text-xs text-slate-500">{label(status)}</p></div>)}
            </div>
          </div>
          <div className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Role performance</h2>
            <p className="mt-1 text-sm text-slate-500">Applicants per active opening</p>
            <div className="mt-5 space-y-5">
              {activeJobs.length === 0 && <p className="text-sm text-slate-500">No active roles.</p>}
              {activeJobs.map((job) => <div key={job.id}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{job.title}</span><span className="font-semibold text-slate-800">{job.applicantsCount}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${(job.applicantsCount / maxApplicants) * 100}%` }} /></div></div>)}
            </div>
            <Link to="/employer/jobs" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Manage job listings <ArrowRight size={15} /></Link>
          </div>
        </section>
      </AsyncState>
    </div>
  )
}
