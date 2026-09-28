import { ArrowRight, BriefcaseBusiness, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { employerApplicants, employerJobs } from '../../data/employerWorkspace'

const monthlyActivity = [
  { label: 'Apr', value: 36 }, { label: 'May', value: 48 }, { label: 'Jun', value: 42 },
  { label: 'Jul', value: 62 }, { label: 'Aug', value: 74 }, { label: 'Sep', value: 88 },
]

export default function EmployerAnalyticsPage() {
  const activeJobs = employerJobs.filter((job) => job.status === 'Active')
  const applicantCount = employerJobs.reduce((total, job) => total + job.applicants, 0)
  const averageMatch = Math.round(employerApplicants.reduce((total, applicant) => total + applicant.match, 0) / employerApplicants.length)

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Employer workspace" title="Hiring analytics" description="See how your open roles are attracting and moving candidates through the hiring process." actionLabel="Review applicants" actionTo="/employer/applicants" icon={ArrowRight} />
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Hiring analytics summary">
        {[[BriefcaseBusiness, 'Active roles', activeJobs.length, 'Currently accepting candidates', 'bg-blue-50 text-blue-700'], [Users, 'Applications', applicantCount, 'Across open roles', 'bg-emerald-50 text-emerald-700'], [TrendingUp, 'Average candidate match', `${averageMatch}%`, 'Skills match across recent applicants', 'bg-amber-50 text-amber-700']].map(([Icon, label, value, detail, color]) => <div key={label} className="card-surface p-5"><span className={`inline-flex rounded-lg p-2 ${color}`}><Icon size={18} /></span><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}
      </section>
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
        <div className="card-surface p-5 sm:p-6"><div><h2 className="text-lg font-bold text-slate-900">Application activity</h2><p className="mt-1 text-sm text-slate-500">Applications by month across your open roles</p></div><div className="mt-8 flex h-56 items-end justify-around gap-4 border-b border-slate-100 px-3">{monthlyActivity.map((month) => <div key={month.label} className="flex h-full w-full max-w-20 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-slate-500">{month.value}</span><div className="w-full rounded-t-md bg-blue-700" style={{ height: `${month.value}%` }} /><span className="pb-3 text-xs text-slate-500">{month.label}</span></div>)}</div><p className="mt-3 text-xs text-slate-400">Illustrative workspace activity</p></div>
        <div className="card-surface p-5 sm:p-6"><h2 className="text-lg font-bold text-slate-900">Role performance</h2><p className="mt-1 text-sm text-slate-500">Applicants per active opening</p><div className="mt-5 space-y-5">{activeJobs.map((job) => <div key={job.id}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{job.title}</span><span className="font-semibold text-slate-800">{job.applicants}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, job.applicants * 2)}%` }} /></div></div>)}</div><Link to="/employer/jobs" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Manage job listings <ArrowRight size={15} /></Link></div>
      </section>
    </div>
  )
}
