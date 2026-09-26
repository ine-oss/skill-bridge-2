import StatCard from '../../components/common/StatCard'

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Employer dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Active jobs" value="12" subtitle="Hiring now" accent="blue" />
        <StatCard title="Applications" value="184" subtitle="Last 30 days" accent="green" />
        <StatCard title="Shortlisted" value="41" subtitle="Strong fits" accent="amber" />
        <StatCard title="Interviews" value="11" subtitle="Scheduled" accent="slate" />
        <StatCard title="Hires" value="6" subtitle="This quarter" accent="green" />
      </div>
    </div>
  )
}
