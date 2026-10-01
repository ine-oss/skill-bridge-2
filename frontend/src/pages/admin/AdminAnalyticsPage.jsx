import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { label } from '../../lib/format'
import { adminService } from '../../services/adminService'

export default function AdminAnalyticsPage() {
  const [months, setMonths] = useState(6)
  const { data, loading, error, reload } = useApi(() => adminService.getAnalytics(months), [months])
  const statusRows = Object.entries(data?.applicationsByStatus || {}).map(([status, count]) => ({ status: label(status), count }))
  const roleRows = Object.entries(data?.usersByRole || {}).map(([role, count]) => ({ role: label(role), count }))

  return (
    <div className="space-y-6">
      <div className="card-surface flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <label><span className="sr-only">Period</span><select value={months} onChange={(event) => setMonths(Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value={3}>Last 3 months</option><option value={6}>Last 6 months</option><option value={12}>Last 12 months</option></select></label>
      </div>
      <AsyncState loading={loading} error={error} onRetry={reload}>
        <div className="card-surface p-6">
          <h2 className="text-xl font-bold text-slate-900">Growth</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.months || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" name="New users" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="jobs" name="Jobs posted" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="applications" name="Applications" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="enrollments" name="Enrollments" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-slate-900">Hiring pipeline</h2>
            <div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={statusRows} layout="vertical"><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="status" width={90} /><Tooltip /><Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-slate-900">Users by role</h2>
            <ul className="mt-4 space-y-3">{roleRows.map((row) => <li key={row.role} className="flex justify-between text-sm"><span className="text-slate-600">{row.role}</span><span className="font-semibold text-slate-900">{row.count}</span></li>)}</ul>
          </div>
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-slate-900">Most requested skills</h2>
            <p className="text-xs text-slate-500">Across active job listings</p>
            <ul className="mt-4 space-y-3">{(data?.topSkills || []).map((row) => <li key={row.skill} className="flex justify-between text-sm"><span className="text-slate-600">{row.skill}</span><span className="font-semibold text-slate-900">{row.jobs} jobs</span></li>)}</ul>
          </div>
        </div>
      </AsyncState>
    </div>
  )
}
