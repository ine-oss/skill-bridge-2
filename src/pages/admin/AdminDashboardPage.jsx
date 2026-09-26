import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '../../components/common/StatCard'
import { dashboardStats } from '../../data/users'

const chartData = [
  { name: 'Jan', users: 1200, jobs: 300 },
  { name: 'Feb', users: 1450, jobs: 330 },
  { name: 'Mar', users: 1700, jobs: 360 },
  { name: 'Apr', users: 2050, jobs: 400 },
  { name: 'May', users: 2360, jobs: 430 },
  { name: 'Jun', users: 2600, jobs: 470 },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total users" value={dashboardStats.totalUsers.toLocaleString()} subtitle="Overall" accent="blue" />
        <StatCard title="Job seekers" value={dashboardStats.jobSeekers.toLocaleString()} subtitle="Active profiles" accent="green" />
        <StatCard title="Employers" value={dashboardStats.employers.toLocaleString()} subtitle="Registered" accent="amber" />
        <StatCard title="Training providers" value={dashboardStats.trainingProviders.toLocaleString()} subtitle="Partners" accent="slate" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active jobs" value={dashboardStats.activeJobs.toLocaleString()} subtitle="Open roles" accent="blue" />
        <StatCard title="Applications" value={dashboardStats.applications.toLocaleString()} subtitle="Ongoing" accent="green" />
        <StatCard title="Verified companies" value={dashboardStats.verifiedCompanies.toLocaleString()} subtitle="Trust score" accent="amber" />
        <StatCard title="Training programs" value={dashboardStats.trainingPrograms.toLocaleString()} subtitle="Available" accent="slate" />
      </div>

      <div className="card-surface p-6">
        <h2 className="text-2xl font-bold text-slate-900">Platform analytics</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="jobs" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
