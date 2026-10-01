import { BriefcaseBusiness, ShieldCheck, Trophy, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import BarList from '../../components/dashboard/BarList'
import ChartCard from '../../components/dashboard/ChartCard'
import Funnel from '../../components/dashboard/Funnel'
import GroupedBars from '../../components/dashboard/GroupedBars'
import StatTile from '../../components/dashboard/StatTile'
import TrendChart from '../../components/dashboard/TrendChart'
import { lineLegend } from '../../components/dashboard/viz'
import useApi from '../../hooks/useApi'
import { label, timeAgo } from '../../lib/format'
import { userService } from '../../services/userService'

const ACTIVITY = [{ key: 'users', label: 'New users' }, { key: 'applications', label: 'Applications' }, { key: 'enrollments', label: 'Enrollments' }]
const GAP = [{ key: 'jobs', label: 'Open jobs asking for it' }, { key: 'talent', label: 'Job seekers strong in it' }]

export default function AdminDashboardPage() {
  const { data: s, loading, error, reload } = useApi(() => userService.getDashboard(), [])
  const charts = s?.charts
  const activity = charts ? charts.activity.map((row, index) => ({ ...row, users: charts.signups[index].total })) : []
  // Current status counts → "reached at least this stage"
  const funnel = charts ? charts.pipeline.map((stage, index) => ({ status: stage.status, count: charts.pipeline.slice(index).reduce((sum, item) => sum + item.count, 0) })) : []

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Platform overview</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Live activity across job seekers, employers and training providers.</p>
        </div>
        <Link to="/admin/analytics" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Detailed analytics →</Link>
      </header>

      <AsyncState loading={loading} error={error} onRetry={reload}>
        {s && (
          <>
            <section aria-label="Platform metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatTile label="Users" value={s.totalUsers.toLocaleString()} delta={{ value: s.signupsTrend.change, period: 'sign-ups vs previous 4 weeks' }} trend={charts.signups.map((row) => row.total)} icon={Users} />
              <StatTile label="Applications" value={s.applications.toLocaleString()} delta={{ value: s.applicationsTrend.change, period: 'vs previous 4 weeks' }} trend={charts.activity.map((row) => row.applications)} icon={UserPlus} />
              <StatTile label="Active jobs" value={s.activeJobs} sub={`${s.verifiedCompanies} verified companies · ${s.trainingPrograms} programs`} icon={BriefcaseBusiness} />
              <StatTile label="People hired" value={s.hires} sub="Applications marked hired" icon={Trophy} />
              <Link to="/admin/verification" className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <StatTile label="Waiting for verification" value={s.pendingVerifications} sub={s.pendingVerifications ? 'Review now →' : 'All caught up'} icon={ShieldCheck} tone={s.pendingVerifications ? 'warning' : undefined} />
              </Link>
            </section>

            <ChartCard title="Platform activity" subtitle="Per week, last 12 weeks" legend={lineLegend(ACTIVITY)} table={{ columns: ['Week of', 'New users', 'Applications', 'Enrollments'], rows: activity.map((row) => [row.label, row.users, row.applications, row.enrollments]) }}>
              <TrendChart data={activity} series={ACTIVITY} height={260} />
            </ChartCard>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartCard title="Skills gap" subtitle="Most requested skills in open jobs vs job seekers scoring 70%+ in them" legend={GAP.map((item, index) => ({ label: item.label, color: ['#2a78d6', '#eb6834'][index], shape: 'rect' }))} table={{ columns: ['Skill', 'Open jobs', 'Strong job seekers'], rows: charts.skillsGap.map((row) => [row.skill, row.jobs, row.talent]) }}>
                <GroupedBars data={charts.skillsGap} categoryKey="skill" series={GAP} />
              </ChartCard>
              <ChartCard title="Hiring pipeline" subtitle="Applications that reached each stage, platform-wide" table={{ columns: ['Stage', 'Applications'], rows: funnel.map((row) => [label(row.status), row.count]) }}>
                <Funnel stages={funnel} rejected={charts.rejected} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartCard title="Users by role" table={{ columns: ['Role', 'Users'], rows: [['Job seekers', s.jobSeekers], ['Employers', s.employers], ['Training providers', s.trainingProviders], ['Admins', s.admins]] }}>
                <BarList rows={[
                  { label: 'Job seekers', value: s.jobSeekers, href: '/admin/users' },
                  { label: 'Employers', value: s.employers, href: '/admin/users' },
                  { label: 'Training providers', value: s.trainingProviders, href: '/admin/users' },
                  { label: 'Admins', value: s.admins, href: '/admin/users' },
                ]} />
              </ChartCard>
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between"><h2 className="text-base font-semibold text-slate-900">Newest accounts</h2><Link to="/admin/users" className="text-sm font-semibold text-blue-700">All users</Link></div>
                <ul className="mt-4 divide-y divide-slate-100">
                  {charts.latestUsers.map((user) => (
                    <li key={user.id} className="flex items-center gap-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">{user.initials}</span>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-500">{label(user.role)} · {label(user.verificationStatus)}</p></div>
                      <span className="shrink-0 text-xs text-slate-500">{timeAgo(user.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </AsyncState>
    </div>
  )
}
