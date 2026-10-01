import { useState } from 'react'
import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { adminService } from '../../services/adminService'
import { trainingService } from '../../services/trainingService'

export default function AdminTrainingPage() {
  const [status, setStatus] = useState('ALL')
  const { data, loading, error, reload, setData } = useApi(() => adminService.getAllPrograms({ status, limit: 100 }), [status])
  const [message, setMessage] = useState('')
  const programs = data?.data || []

  const update = async (id, next) => {
    try {
      const { program } = await trainingService.updateProgram(id, { status: next })
      setData((current) => ({ ...current, data: current.data.map((item) => item.id === id ? program : item) }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Training programs</h1>
        <label><span className="sr-only">Status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All statuses' : label(item)}</option>)}</select></label>
      </div>
      {message && <p className="mt-3 text-sm text-red-700" role="alert">{message}</p>}
      <div className="mt-6">
        <AsyncState loading={loading} error={error} onRetry={reload} empty={programs.length === 0} emptyTitle="No programs">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Program</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Learners</th><th className="px-4 py-3">Created</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-t border-slate-200">
                    <td className="px-4 py-3"><Link to={`/training/${program.id}`} className="font-semibold text-slate-800 hover:text-blue-700">{program.title}</Link></td>
                    <td className="px-4 py-3">{program.provider?.name}{program.provider?.verified && <span className="ml-1 text-xs text-emerald-700">✓</span>}</td>
                    <td className="px-4 py-3">{label(program.status)}</td>
                    <td className="px-4 py-3">{program.learnersCount}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(program.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {program.status === 'ACTIVE'
                        ? <button type="button" onClick={() => update(program.id, 'ARCHIVED')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Archive</button>
                        : program.status === 'ARCHIVED' && <button type="button" onClick={() => update(program.id, 'ACTIVE')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Restore</button>}
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
