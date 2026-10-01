import { ArrowRight, Award, BookOpen, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { trainingService } from '../../services/trainingService'

function enrollmentsByMonth(enrollments) {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleString('en', { month: 'short' }), value: 0 }
  })
  enrollments.forEach((item) => {
    const date = new Date(item.enrolledAt)
    const month = months.find((entry) => entry.key === `${date.getFullYear()}-${date.getMonth()}`)
    if (month) month.value += 1
  })
  return months
}

export default function TrainingAnalyticsPage() {
  const { data, loading, error, reload } = useApi(async () => {
    const [programs, enrollments, certificates] = await Promise.all([trainingService.getMyPrograms(), trainingService.getEnrollments(), trainingService.getCertificates()])
    return { programs: programs.data, enrollments: enrollments.data, certificates: certificates.data }
  }, [])

  const programs = data?.programs || []
  const enrollments = data?.enrollments || []
  const activePrograms = programs.filter((program) => program.status === 'ACTIVE')
  const averageProgress = enrollments.length ? Math.round(enrollments.reduce((total, item) => total + item.progress, 0) / enrollments.length) : 0
  const monthly = enrollmentsByMonth(enrollments)
  const peak = Math.max(1, ...monthly.map((month) => month.value))

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Provider insights" title="Analytics" description="Monitor enrollment, learner progress, and program outcomes at a glance." actionLabel="View programs" actionTo="/training/programs" icon={ArrowRight} />
      <AsyncState loading={loading} error={error} onRetry={reload}>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Training metrics">
          {[[Users, 'Enrolled learners', enrollments.length, 'Across all programs', 'text-blue-700 bg-blue-50'], [BookOpen, 'Active programs', activePrograms.length, `${programs.length} programs in total`, 'text-emerald-700 bg-emerald-50'], [TrendingUp, 'Average progress', `${averageProgress}%`, 'From current learners', 'text-amber-700 bg-amber-50'], [Award, 'Certificates issued', data?.certificates.length ?? 0, 'All time', 'text-rose-700 bg-rose-50']].map(([Icon, text, value, detail, color]) => <div key={text} className="card-surface p-5"><span className={`inline-flex rounded-lg p-2 ${color}`}><Icon size={18} /></span><p className="mt-4 text-sm text-slate-500">{text}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}
        </section>
        <section className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
          <div className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Enrollment trend</h2>
            <p className="mt-1 text-sm text-slate-500">New enrollments per month</p>
            <div className="mt-8 flex h-56 items-end justify-around gap-4 border-b border-slate-100 px-4">{monthly.map((month) => <div key={month.key} className="flex h-full w-full max-w-24 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-slate-600">{month.value}</span><div className="w-full rounded-t-md bg-emerald-600 transition-all" style={{ height: `${(month.value / peak) * 80}%`, minHeight: month.value ? 4 : 0 }} /><span className="pb-3 text-xs text-slate-500">{month.label}</span></div>)}</div>
          </div>
          <div className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Program performance</h2>
            <p className="mt-1 text-sm text-slate-500">Average learner progress</p>
            <div className="mt-5 space-y-5">
              {activePrograms.length === 0 && <p className="text-sm text-slate-500">No active programs.</p>}
              {activePrograms.map((program) => <div key={program.id}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{program.title}</span><span className="font-semibold text-slate-800">{program.completion}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${program.completion}%` }} /></div></div>)}
            </div>
            <Link to="/training/learners" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Review learner progress <ArrowRight size={15} /></Link>
          </div>
        </section>
      </AsyncState>
    </div>
  )
}
