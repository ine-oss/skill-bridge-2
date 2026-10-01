import { BriefcaseBusiness, CalendarDays, Clock3, Gauge, PlusCircle, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import BarList from '../../components/dashboard/BarList'
import ChartCard from '../../components/dashboard/ChartCard'
import ColumnChart from '../../components/dashboard/ColumnChart'
import Funnel from '../../components/dashboard/Funnel'
import StatTile from '../../components/dashboard/StatTile'
import TrendChart from '../../components/dashboard/TrendChart'
import useApi from '../../hooks/useApi'
import { applicantStatusStyles, formatDay, formatTime, label, toApplicantView } from '../../lib/format'
import { applicationService } from '../../services/applicationService'
import { userService } from '../../services/userService'

export default function EmployerDashboardPage() {
  const stats = useApi(() => userService.getDashboard(), [])
  const applications = useApi(() => applicationService.getApplications({ limit: 6 }), [])
  const interviews = useApi(() => applicationService.getInterviews({ upcoming: true, status: 'SCHEDULED' }), [])

  const s = stats.data
  const charts = s?.charts
  const recentApplicants = (applications.data?.data || []).map(toApplicantView)
  const upcoming = (interviews.data?.data || []).slice(0, 4)

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Employer workspace" title="Hiring dashboard" description="Live numbers from your job listings, applicants and interviews." actionLabel="Post a job" actionTo="/employer/post-job" icon={PlusCircle} />

      <AsyncState loading={stats.loading} error={stats.error} onRetry={stats.reload}>
        {s && (
          <>
            <section aria-label="Hiring metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile label="Applications · last 4 weeks" value={s.applicationsTrend.recent} delta={{ value: s.applicationsTrend.change, period: 'vs previous 4 weeks' }} trend={charts.weekly.map((row) => row.applications)} icon={Users} />
              <StatTile label="Active jobs" value={s.activeJobs} sub={`${s.jobs.DRAFT || 0} draft${s.jobs.DRAFT === 1 ? '' : 's'} · ${s.jobs.PAUSED || 0} paused`} icon={BriefcaseBusiness} />
              <StatTile label="Average skill match" value={`${s.averageMatch}%`} sub={`${s.applicants} applicants in total`} meter={s.averageMatch} icon={Gauge} />
              <StatTile label="Upcoming interviews" value={s.upcomingInterviews} sub={`${s.shortlisted} shortlisted · ${s.hires} hired`} icon={CalendarDays} />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
              <ChartCard title="Applications per week" subtitle="Last 12 weeks, across all your jobs" table={{ columns: ['Week of', 'Applications'], rows: charts.weekly.map((row) => [row.label, row.applications]) }}>
                <TrendChart data={charts.weekly} series={[{ key: 'applications', label: 'Applications' }]} />
              </ChartCard>
              <ChartCard title="Hiring funnel" subtitle="How far applicants have progressed" table={{ columns: ['Stage', 'Applicants'], rows: charts.funnel.map((row) => [label(row.status), row.count]) }}>
                <Funnel stages={charts.funnel} rejected={charts.rejected} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartCard title="Applicants by job" subtitle="With the average skill match for each role" table={{ columns: ['Job', 'Applicants', 'Avg match'], rows: charts.byJob.map((row) => [row.title, row.applicants, row.averageMatch === null ? '—' : `${row.averageMatch}%`]) }}>
                <BarList rows={charts.byJob.map((row) => ({ key: row.id, label: row.title, value: row.applicants, note: row.averageMatch === null ? label(row.status) : `avg match ${row.averageMatch}%`, href: `/employer/applicants?jobId=${row.id}`, muted: row.status !== 'ACTIVE' }))} empty="Publish a job to start receiving applicants" />
              </ChartCard>
              <ChartCard title="Skill match of applicants" subtitle="How well applicants' skills cover your requirements" table={{ columns: ['Match', 'Applicants'], rows: charts.matchDistribution.map((row) => [row.label, row.count]) }}>
                <ColumnChart data={charts.matchDistribution} name="Applicants" />
              </ChartCard>
            </div>
          </>
        )}
      </AsyncState>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm" aria-labelledby="recent-applicants-title">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-6 py-4">
            <h2 id="recent-applicants-title" className="text-base font-semibold text-slate-900">Recent applicants</h2>
            <Link to="/employer/applicants" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View all</Link>
          </div>
          <AsyncState loading={applications.loading} error={applications.error} onRetry={applications.reload} empty={recentApplicants.length === 0} emptyTitle="No applicants yet">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead className="bg-slate-50 text-xs font-medium text-slate-500"><tr><th className="px-6 py-2.5">Candidate</th><th className="px-4 py-2.5">Role</th><th className="px-4 py-2.5 text-right">Match</th><th className="px-6 py-2.5">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{applicant.initials}</span><div><p className="text-sm font-semibold text-slate-800">{applicant.name}</p><p className="text-xs text-slate-500">Applied {applicant.applied}</p></div></div></td>
                      <td className="px-4 py-3 text-sm text-slate-600">{applicant.role}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-slate-800">{applicant.match}%</td>
                      <td className="px-6 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${applicantStatusStyles[applicant.status] || 'bg-slate-100 text-slate-600'}`}>{applicant.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AsyncState>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" aria-labelledby="interviews-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="interviews-title" className="text-base font-semibold text-slate-900">Upcoming interviews</h2>
            <Link to="/employer/interviews" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Manage</Link>
          </div>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 && !interviews.loading && <p className="text-sm text-slate-500">No interviews scheduled.</p>}
            {upcoming.map((interview) => (
              <article key={interview.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">{interview.candidate.initials}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-800">{interview.candidate.name}</h3>
                  <p className="truncate text-xs text-slate-500">{interview.type} · {interview.job.title}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-500"><Clock3 size={13} />{formatDay(interview.scheduledAt)}, {formatTime(interview.scheduledAt)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
