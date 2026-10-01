import { BookOpen, CalendarDays, Clock3, FileText, Send, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import AsyncState from '../../components/common/AsyncState'
import NotificationsList from '../../components/common/NotificationsList'
import BarList from '../../components/dashboard/BarList'
import ChartCard from '../../components/dashboard/ChartCard'
import ColumnChart from '../../components/dashboard/ColumnChart'
import StatTile from '../../components/dashboard/StatTile'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import useApi from '../../hooks/useApi'
import { formatDay, formatTime, label } from '../../lib/format'
import { applicationService } from '../../services/applicationService'
import { userService } from '../../services/userService'

export default function JobSeekerDashboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { data: s, loading, error, reload } = useApi(() => userService.getDashboard(), [])
  const interviews = useApi(() => applicationService.getInterviews({ upcoming: true }), [])
  const charts = s?.charts
  const best = charts?.topMatches[0]
  const firstName = (user.name || '').split(' ')[0]
  const missing = charts?.marketDemand.filter((row) => !row.have) || []
  const upcoming = (interviews.data?.data || []).slice(0, 3)

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-[#222724] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{t('dashboard')}</p>
            <h1 className="mt-2 text-3xl font-bold">{firstName ? `${firstName}, your pathway is moving forward.` : 'Your pathway is moving forward.'}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/jobseeker/matched-jobs"><Button className="bg-white !text-slate-900 hover:bg-slate-100">See matched jobs</Button></Link>
              <Link to="/jobseeker/skills"><Button variant="ghost" className="!text-white ring-1 ring-white/30 hover:bg-white/10">Update skills</Button></Link>
            </div>
          </div>
          {best && (
            <Link to={`/jobs/${best.id}`} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10 lg:min-w-72">
              <p className="text-sm text-slate-300">Best job match</p>
              <p className="mt-1 text-5xl font-semibold tracking-tight">{best.match}%</p>
              <p className="mt-2 text-sm text-slate-200">{best.title} · {best.company}</p>
            </Link>
          )}
        </div>
      </section>

      <AsyncState loading={loading} error={error} onRetry={reload}>
        {s && (
          <>
            <section aria-label="Your progress" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Link to="/jobseeker/portfolio" className="block h-full rounded-2xl"><StatTile label={t('completeProfile')} value={`${s.profileCompletion}%`} sub={`${s.skillsCount} skills · ${s.evidenceCount} evidence items`} meter={s.profileCompletion} icon={FileText} /></Link>
              <Link to="/jobseeker/applications" className="block h-full rounded-2xl"><StatTile label="Active applications" value={s.activeApplications} sub={`${s.totalApplications} sent in total · ${s.savedJobs} saved jobs`} icon={Send} /></Link>
              <Link to="/jobseeker/interviews" className="block h-full rounded-2xl"><StatTile label="Upcoming interviews" value={s.upcomingInterviews} sub={s.upcomingInterviews ? 'Prepare with your skill gap page' : 'Keep applying — invites show here'} icon={CalendarDays} /></Link>
              <Link to="/jobseeker/training" className="block h-full rounded-2xl"><StatTile label="Training in progress" value={s.activeTraining} sub={`${charts.training.filter((row) => row.status === 'COMPLETED').length} completed`} icon={BookOpen} /></Link>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartCard
                title="Your skills vs. what employers ask for"
                subtitle="Most requested skills in open jobs, with your score"
                action={missing.length > 0 && <Link to="/jobseeker/skills" className="text-sm font-semibold text-blue-700">Add skills</Link>}
                table={{ columns: ['Skill', 'Open jobs', 'Your score'], rows: charts.marketDemand.map((row) => [row.skill, row.jobs, row.have ? `${row.score}%` : 'Not on profile']) }}
              >
                <BarList max={100} rows={charts.marketDemand.map((row) => ({ key: row.skill, label: row.skill, value: row.have ? row.score : 0, display: row.have ? `${row.score}%` : 'Missing', note: `${row.jobs} open job${row.jobs > 1 ? 's' : ''}` }))} empty="No open jobs right now" />
                {missing.length > 0 && <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><Sparkles size={16} className="mt-0.5 shrink-0" aria-hidden="true" />Adding {missing.slice(0, 3).map((row) => row.skill).join(', ')} would raise your match for more jobs. <Link to="/jobseeker/skill-gap" className="font-semibold underline">See training</Link></p>}
              </ChartCard>

              <ChartCard title="Your top job matches" subtitle="Share of each job's required skills you cover" table={{ columns: ['Job', 'Company', 'Match'], rows: charts.topMatches.map((row) => [row.title, row.company, `${row.match}%`]) }}>
                <BarList max={100} rows={charts.topMatches.map((row) => ({ key: row.id, label: row.title, note: row.company, value: row.match, display: `${row.match}%`, href: `/jobs/${row.id}` }))} empty="Add skills to see your matches" />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <ChartCard title="Where your applications are" subtitle="Current stage of each application" table={{ columns: ['Stage', 'Applications'], rows: charts.pipeline.map((row) => [label(row.status), row.count]) }}>
                <ColumnChart data={charts.pipeline.map((row) => ({ label: label(row.status), count: row.count }))} name="Applications" height={200} />
              </ChartCard>
              <ChartCard title="Training progress" action={<Link to="/training" className="text-sm font-semibold text-blue-700">Browse programs</Link>} table={{ columns: ['Program', 'Progress'], rows: charts.training.map((row) => [row.title, `${row.progress}%`]) }}>
                <BarList max={100} rows={charts.training.map((row) => ({ key: row.id, label: row.title, value: row.progress, display: row.status === 'COMPLETED' ? 'Completed' : `${row.progress}%`, href: `/training/${row.programId}` }))} empty="Enroll in a program to close your skill gaps" />
              </ChartCard>
            </div>
          </>
        )}
      </AsyncState>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold text-slate-900">Upcoming interviews</h2><Link to="/jobseeker/interviews" className="text-sm font-semibold text-blue-700">All</Link></div>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 && !interviews.loading && <p className="text-sm text-slate-500">No interviews scheduled yet.</p>}
            {upcoming.map((interview) => (
              <div key={interview.id} className="rounded-xl border border-slate-100 p-4">
                <div className="font-semibold text-slate-900">{interview.job.title}</div>
                <div className="mt-1 text-sm text-slate-500">{interview.company.name} · {interview.type}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"><Clock3 size={12} /> {formatDay(interview.scheduledAt)}, {formatTime(interview.scheduledAt)}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold text-slate-900">{t('notifications')}</h2><Link to="/jobseeker/notifications" className="text-sm font-semibold text-blue-700">All</Link></div>
          <div className="mt-4"><NotificationsList limit={4} /></div>
        </section>
      </div>
    </div>
  )
}
