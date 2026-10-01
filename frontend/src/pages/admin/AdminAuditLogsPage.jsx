import { useState } from 'react'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, formatTime, label } from '../../lib/format'
import { adminService } from '../../services/adminService'

const ACTIONS = [['', 'All actions'], ['user.', 'Accounts'], ['job.', 'Jobs'], ['application.', 'Applications'], ['interview.', 'Interviews'], ['program.', 'Training programs'], ['enrollment.', 'Enrollments'], ['verification.', 'Verification'], ['admin.', 'Admin actions']]

export default function AdminAuditLogsPage() {
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)
  const { data, loading, error, reload } = useApi(() => adminService.getAuditLogs({ action, page, limit: 50 }), [action, page])
  const logs = data?.data || []
  const meta = data?.meta

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Audit logs</h1>
        <label><span className="sr-only">Action type</span><select value={action} onChange={(event) => { setAction(event.target.value); setPage(1) }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{ACTIONS.map(([value, text]) => <option key={text} value={value}>{text}</option>)}</select></label>
      </div>
      <div className="mt-6">
        <AsyncState loading={loading} error={error} onRetry={reload} empty={logs.length === 0} emptyTitle="No activity recorded">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Who</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Record</th><th className="px-4 py-3">Details</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-slate-200 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(log.createdAt)} {formatTime(log.createdAt)}</td>
                    <td className="px-4 py-3">{log.actor ? <><span className="font-semibold text-slate-800">{log.actor.name}</span><span className="block text-xs text-slate-500">{label(log.actor.role)}</span></> : <span className="text-slate-400">System / deleted user</span>}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{log.action}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{log.entity}{log.entityId ? ` · ${log.entityId.slice(-8)}` : ''}</td>
                    <td className="max-w-xs break-words px-4 py-3 font-mono text-xs text-slate-500">{log.meta ? JSON.stringify(log.meta) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>Page {meta.page} of {meta.totalPages}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button>
                <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </AsyncState>
      </div>
    </div>
  )
}
