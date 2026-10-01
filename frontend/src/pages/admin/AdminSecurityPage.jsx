import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, formatTime, label } from '../../lib/format'
import { adminService } from '../../services/adminService'

export default function AdminSecurityPage() {
  const suspended = useApi(() => adminService.getUsers({ status: 'SUSPENDED', limit: 50 }), [])
  const logins = useApi(() => adminService.getAuditLogs({ action: 'user.password', limit: 20 }), [])

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Security</h1>
        <p className="mt-2 text-sm text-slate-500">Suspended accounts and recent password activity. Change your own password under Settings.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-lg font-bold text-slate-900">Suspended accounts</h2>
          <div className="mt-4">
            <AsyncState loading={suspended.loading} error={suspended.error} onRetry={suspended.reload} empty={(suspended.data?.data || []).length === 0} emptyTitle="No suspended accounts">
              <ul className="divide-y divide-slate-100">{(suspended.data?.data || []).map((user) => <li key={user.id} className="flex justify-between py-3 text-sm"><span><span className="font-semibold text-slate-800">{user.name}</span> <span className="text-slate-500">· {user.email}</span></span><span className="text-slate-500">{label(user.role)}</span></li>)}</ul>
            </AsyncState>
          </div>
        </section>
        <section className="card-surface p-6">
          <h2 className="text-lg font-bold text-slate-900">Password resets and changes</h2>
          <div className="mt-4">
            <AsyncState loading={logins.loading} error={logins.error} onRetry={logins.reload} empty={(logins.data?.data || []).length === 0} emptyTitle="No recent password activity">
              <ul className="divide-y divide-slate-100">{(logins.data?.data || []).map((log) => <li key={log.id} className="flex justify-between gap-3 py-3 text-sm"><span><span className="font-semibold text-slate-800">{log.actor?.name || 'Unknown'}</span> <span className="font-mono text-xs text-slate-500">{log.action}</span></span><span className="whitespace-nowrap text-slate-500">{formatDate(log.createdAt)} {formatTime(log.createdAt)}</span></li>)}</ul>
            </AsyncState>
          </div>
        </section>
      </div>
    </div>
  )
}
