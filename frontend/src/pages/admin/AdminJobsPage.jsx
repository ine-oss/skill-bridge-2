import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { adminService } from '../../services/adminService'
import { jobService } from '../../services/jobService'

export default function AdminJobsPage() {
  const [status, setStatus] = useState('ALL')
  const { data, loading, error, reload, setData } = useApi(() => adminService.getAllJobs({ status, limit: 100 }), [status])
  const [message, setMessage] = useState('')
  const jobs = data?.data || []

  const update = async (id, next) => {
    try {
      const { job } = await jobService.updateJob(id, { status: next })
      setData((current) => ({ ...current, data: current.data.map((item) => item.id === id ? job : item) }))
    } catch (err) {
      setMessage(err.message)
    }
  }
  const remove = async (job) => {
    if (!window.confirm(`Delete “${job.title}”?`)) return
    try {
      await jobService.deleteJob(job.id)
      setData((current) => ({ ...current, data: current.data.filter((item) => item.id !== job.id) }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
        <label><span className="sr-only">Status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{['ALL', 'ACTIVE', 'DRAFT', 'PAUSED', 'CLOSED'].map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All statuses' : label(item)}</option>)}</select></label>
      </div>
      {message && <p className="mt-3 text-sm text-red-700" role="alert">{message}</p>}
      <div className="mt-6">
        <AsyncState loading={loading} error={error} onRetry={reload} empty={jobs.length === 0} emptyTitle="No jobs">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Applicants</th><th className="px-4 py-3">Posted</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-200">
                    <td className="px-4 py-3"><Link to={`/jobs/${job.id}`} className="font-semibold text-slate-800 hover:text-blue-700">{job.title}</Link></td>
                    <td className="px-4 py-3">{job.company?.name}{job.company?.verified && <span className="ml-1 text-xs text-emerald-700">✓</span>}</td>
                    <td className="px-4 py-3">{label(job.status)}</td>
                    <td className="px-4 py-3">{job.applicantsCount}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(job.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {job.status === 'ACTIVE' ? <button type="button" onClick={() => update(job.id, 'PAUSED')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Take down</button>
                        : job.status !== 'DRAFT' && <button type="button" onClick={() => update(job.id, 'ACTIVE')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Restore</button>}
                      <button type="button" onClick={() => remove(job)} aria-label={`Delete ${job.title}`} className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AsyncState>
      </div>
    </div>
  )
}
