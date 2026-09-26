import StatCard from '../../components/common/StatCard'

export default function TrainingDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Training provider dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Programs" value="8" subtitle="Active courses" accent="blue" />
        <StatCard title="Learners" value="1,240" subtitle="Enrolled" accent="green" />
        <StatCard title="Certificates" value="312" subtitle="Issued" accent="amber" />
        <StatCard title="Completion" value="72%" subtitle="Average" accent="slate" />
      </div>
    </div>
  )
}
