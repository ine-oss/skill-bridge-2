import { useState } from 'react'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { applicationService } from '../../services/applicationService'

const STATUSES = ['NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN']

export default function AdminApplicationsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const { data, loading, error, reload } = useApi(() => applicationService.getApplications({ status, page, limit: 25 }), [status, page])
  const applications = data?.data || []
  const meta = data?.meta

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
        <label><span className="sr-only">Status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
      </div>
      <div className="mt-6">
        <AsyncState loading={loading} error={error} onRetry={reload} empty={applications.length === 0} emptyTitle="No applications">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Match</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Applied</th></tr></thead>
              <tbody>
                {applications.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.applicant?.name}</td>
                    <td className="px-4 py-3">{item.job?.title}</td>
                    <td className="px-4 py-3">{item.job?.company?.name}</td>
                    <td className="px-4 py-3">{item.match}%</td>
                    <td className="px-4 py-3">{label(item.status)}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>Page {meta.page} of {meta.totalPages} · {meta.total} applications</span>
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
