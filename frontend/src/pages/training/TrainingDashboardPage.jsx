import { useState } from 'react'
import { AlertTriangle, Award, BookOpen, CalendarDays, Clock3, GraduationCap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import BarList from '../../components/dashboard/BarList'
import ChartCard from '../../components/dashboard/ChartCard'
import ColumnChart from '../../components/dashboard/ColumnChart'
import StatTile from '../../components/dashboard/StatTile'
import TrendChart from '../../components/dashboard/TrendChart'
import { lineLegend } from '../../components/dashboard/viz'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, formatTime, label } from '../../lib/format'
import { trainingService } from '../../services/trainingService'
import { userService } from '../../services/userService'

const TRAINING_SERIES = [{ key: 'enrollments', label: 'Enrollments' }, { key: 'completions', label: 'Completions' }]
const avatarColors = ['bg-sky-100 text-sky-700', 'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
const sessionColors = ['border-sky-200 bg-sky-50 text-sky-700', 'border-emerald-200 bg-emerald-50 text-emerald-700', 'border-violet-200 bg-violet-50 text-violet-700']

export default function TrainingDashboardPage() {
  const stats = useApi(() => userService.getDashboard(), [])
  const enrollments = useApi(() => trainingService.getEnrollments(), [])
  const programs = useApi(() => trainingService.getMyPrograms(), [])
  const [courseFilter, setCourseFilter] = useState('All programs')

  const s = stats.data
  const all = enrollments.data?.data || []
  const courses = ['All programs', ...new Set(all.map((item) => item.program.title))]
  const visibleEnrollments = all.filter((item) => courseFilter === 'All programs' || item.program.title === courseFilter).slice(0, 8)
  const sessions = (programs.data?.data || [])
    .filter((program) => program.nextSession && new Date(program.nextSession) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.nextSession) - new Date(b.nextSession))
    .slice(0, 3)
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">{today}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Training provider dashboard</h1>
          <p className="mt-2 text-base text-slate-500">A clear view of your learners, programs, and upcoming sessions.</p>
        </div>
        <Link to="/training/create" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <BookOpen size={17} /> Create a program
        </Link>
      </header>

      <AsyncState loading={stats.loading} error={stats.error} onRetry={stats.reload}>
        {s && (
          <>
            <section aria-label="Training provider metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile label="New enrollments · last 4 weeks" value={s.enrollmentsTrend.recent} delta={{ value: s.enrollmentsTrend.change, period: 'vs previous 4 weeks' }} trend={s.charts.weekly.map((row) => row.enrollments)} icon={Users} />
              <StatTile label="Active learners" value={s.activeLearners} sub={`${s.learners} enrolled in total · ${s.programs} active programs`} icon={BookOpen} />
              <StatTile label="Completion rate" value={`${s.completionRate}%`} sub={`${s.certificates} certificates issued · avg progress ${s.averageCompletion}%`} meter={s.completionRate} icon={GraduationCap} />
              <StatTile label="Learners at risk" value={s.atRisk} sub="Active, under 25% progress" icon={AlertTriangle} tone={s.atRisk ? 'warning' : undefined} />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
              <ChartCard title="Enrollments and completions" subtitle="Per week, last 12 weeks" legend={lineLegend(TRAINING_SERIES)} table={{ columns: ['Week of', 'Enrollments', 'Completions'], rows: s.charts.weekly.map((row) => [row.label, row.enrollments, row.completions]) }}>
                <TrendChart data={s.charts.weekly} series={TRAINING_SERIES} />
              </ChartCard>
              <ChartCard title="Where learners are" subtitle="Learners by course progress" table={{ columns: ['Progress', 'Learners'], rows: s.charts.progressDistribution.map((row) => [row.label, row.count]) }}>
                <ColumnChart data={s.charts.progressDistribution} name="Learners" />
              </ChartCard>
            </div>

            <ChartCard title="Program performance" subtitle="Learners per program, with average progress and completions" table={{ columns: ['Program', 'Learners', 'Avg progress', 'Completed'], rows: s.charts.byProgram.map((row) => [row.title, row.learners, `${row.averageProgress}%`, row.completed]) }}>
              <BarList rows={s.charts.byProgram.map((row) => ({ key: row.id, label: row.title, value: row.learners, display: `${row.learners} learners`, note: `avg ${row.averageProgress}% · ${row.completed} completed`, href: `/training/learners?programId=${row.id}`, muted: row.status !== 'ACTIVE' }))} empty="Create a program to see its performance" />
            </ChartCard>
          </>
        )}
      </AsyncState>

      <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm" aria-labelledby="enrollments-title">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="enrollments-title" className="text-lg font-bold text-slate-800">Recent Course Enrollments</h2>
              <p className="mt-1 text-sm text-slate-500">Learner activity across your programs</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="dashboard-course-filter">Filter enrollments by program</label>
              <select id="dashboard-course-filter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                {courses.map((course) => <option key={course}>{course}</option>)}
              </select>
              <Link to="/training/learners" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View all learners</Link>
            </div>
          </div>
          <AsyncState loading={enrollments.loading} error={enrollments.error} onRetry={enrollments.reload} empty={visibleEnrollments.length === 0} emptyTitle="No enrollments yet">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th className="px-6 py-3">Student name</th><th className="px-4 py-3">Registered course</th><th className="px-4 py-3">Progress</th><th className="px-6 py-3">Enrollment date</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleEnrollments.map((item, index) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[index % avatarColors.length]}`}>{item.learner.initials}</span><span className="whitespace-nowrap text-sm font-semibold text-slate-800">{item.learner.name}</span></div></td>
                      <td className="px-4 py-4 text-sm text-slate-600">{item.program.title}</td>
                      <td className="px-4 py-4">
                        <div className="flex min-w-28 items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${item.learner.name} course progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={item.progress}><div className="h-full rounded-full bg-blue-600" style={{ width: `${item.progress}%` }} /></div>
                          <span className="w-9 text-right text-xs font-semibold text-slate-600">{item.progress}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{formatDate(item.enrolledAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
              <span>Showing {visibleEnrollments.length} recent enrollments</span>
              <span className="inline-flex items-center gap-1.5"><Users size={14} /> Live data</span>
            </div>
          </AsyncState>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm" aria-labelledby="schedule-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="schedule-title" className="text-lg font-bold text-slate-800">Upcoming Class Schedules</h2>
              <p className="mt-1 text-sm text-slate-500">Next session of each program</p>
            </div>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><CalendarDays size={19} /></span>
          </div>
          <div className="mt-5 space-y-3">
            {sessions.length === 0 && !programs.loading && <p className="text-sm text-slate-500">No sessions scheduled. Set a “next session” date on your programs.</p>}
            {sessions.map((program, index) => {
              const date = new Date(program.nextSession)
              return (
                <article key={program.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex gap-3">
                    <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-center ${sessionColors[index % sessionColors.length]}`}>
                      <span className="text-base font-bold leading-5">{String(date.getDate()).padStart(2, '0')}</span>
                      <span className="text-[10px] font-bold tracking-wide">{date.toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-800">{program.title}</h3>
                      <p className="mt-1 truncate text-xs text-slate-500">{program.category || label(program.mode)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {formatTime(program.nextSession)}</span>
                    {program.instructor && <span className="inline-flex items-center gap-1.5"><Award size={14} /> {program.instructor}</span>}
                  </div>
                </article>
              )
            })}
          </div>
          <Link to="/training/analytics" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">View training analytics <span className="ml-1" aria-hidden="true">-&gt;</span></Link>
        </section>
      </div>
    </div>
  )
}
