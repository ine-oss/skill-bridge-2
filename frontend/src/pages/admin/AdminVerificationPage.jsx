import { useState } from 'react'
import AsyncState from '../../components/common/AsyncState'
import FileLink from '../../components/common/FileLink'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { adminService } from '../../services/adminService'

export default function AdminVerificationPage() {
  const [status, setStatus] = useState('UNDER_REVIEW')
  const { data, loading, error, reload } = useApi(() => adminService.getVerifications(status), [status])
  const [notes, setNotes] = useState({})
  const [message, setMessage] = useState('')
  const requests = data?.data || []

  const review = async (id, decision) => {
    try {
      await adminService.reviewVerification(id, decision, notes[id] || undefined)
      setMessage(`Request ${decision === 'APPROVED' ? 'approved' : 'rejected'}.`)
      reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Verification</h1>
        <label><span className="sr-only">Show requests</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="UNDER_REVIEW">Waiting for review</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="ALL">All</option></select></label>
      </div>
      {message && <p className="mt-3 text-sm font-medium text-slate-700" role="status">{message}</p>}
      <div className="mt-6">
        <AsyncState loading={loading} error={error} onRetry={reload} empty={requests.length === 0} emptyTitle="Nothing to review" emptyText="New verification requests will appear here.">
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{request.user.company?.name || request.user.trainingProvider?.name || request.user.name}</h2>
                    <p className="text-sm text-slate-500">{label(request.user.role)} · {request.user.email} · submitted {formatDate(request.createdAt)}</p>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{label(request.status)}</span>
                </div>
                <dl className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                  {Object.entries(request.details || {}).map(([key, value]) => (
                    <div key={key}><dt className="text-xs font-semibold uppercase text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</dt><dd className="break-words text-slate-700">{/url$/i.test(key) && typeof value === 'string' ? <FileLink url={value}>{value.startsWith('/api/files/') ? 'Open document' : value}</FileLink> : typeof value === 'object' ? JSON.stringify(value) : String(value)}</dd></div>
                  ))}
                </dl>
                {request.reviewerNote && <p className="mt-3 text-sm text-slate-600">Note: {request.reviewerNote}</p>}
                {request.status === 'UNDER_REVIEW' && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <label className="flex-1"><span className="sr-only">Note to the user</span><input value={notes[request.id] || ''} onChange={(event) => setNotes({ ...notes, [request.id]: event.target.value })} placeholder="Optional note (shown to the user if rejected)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
                    <button type="button" onClick={() => review(request.id, 'APPROVED')} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Approve</button>
                    <button type="button" onClick={() => review(request.id, 'REJECTED')} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Reject</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </AsyncState>
      </div>
    </div>
  )
}
