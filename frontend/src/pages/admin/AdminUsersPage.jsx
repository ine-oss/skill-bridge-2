import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import AsyncState from '../../components/common/AsyncState'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { adminService } from '../../services/adminService'

const statusTone = { ACTIVE: 'bg-emerald-50 text-emerald-700', PENDING: 'bg-amber-50 text-amber-700', SUSPENDED: 'bg-red-50 text-red-700' }

export default function AdminUsersPage() {
  const { user: me } = useAuth()
  const [filters, setFilters] = useState({ q: '', role: '', status: '', page: 1 })
  const [query, setQuery] = useState('')
  const { data, loading, error, reload, setData } = useApi(() => adminService.getUsers({ ...filters, limit: 25 }), [filters])
  const [message, setMessage] = useState('')
  const users = data?.data || []
  const meta = data?.meta

  const replace = (updated) => setData((current) => ({ ...current, data: current.data.map((item) => item.id === updated.id ? updated : item) }))
  const setStatus = async (id, status) => {
    try {
      const { user } = await adminService.updateUser(id, { status })
      replace(user)
    } catch (err) {
      setMessage(err.message)
    }
  }
  const remove = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name} (${user.email}) and all their data?`)) return
    try {
      await adminService.deleteUser(user.id)
      reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        <form onSubmit={(event) => { event.preventDefault(); setFilters({ ...filters, q: query, page: 1 }) }} className="flex flex-wrap gap-2">
          <label className="relative"><span className="sr-only">Search users</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or email" className="rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" /></label>
          <label><span className="sr-only">Role</span><select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">All roles</option>{['jobseeker', 'employer', 'training', 'admin'].map((role) => <option key={role} value={role}>{label(role)}</option>)}</select></label>
          <label><span className="sr-only">Status</span><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">All statuses</option>{['ACTIVE', 'PENDING', 'SUSPENDED'].map((status) => <option key={status} value={status}>{label(status)}</option>)}</select></label>
          <button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Search</button>
        </form>
      </div>
      {message && <p className="mt-3 text-sm text-red-700" role="alert">{message}</p>}
      <div className="mt-6">
        <AsyncState loading={loading} error={error} onRetry={reload} empty={users.length === 0} emptyTitle="No users found">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Verification</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-slate-800">{user.name}</td>
                    <td className="px-4 py-3">{label(user.role)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusTone[user.status]}`}>{label(user.status)}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-600">{label(user.verificationStatus)}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {user.id !== me.id && (
                        <>
                          {user.status === 'SUSPENDED'
                            ? <button type="button" onClick={() => setStatus(user.id, 'ACTIVE')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Reactivate</button>
                            : <button type="button" onClick={() => setStatus(user.id, 'SUSPENDED')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700">Suspend</button>}
                          <button type="button" onClick={() => remove(user)} aria-label={`Delete ${user.name}`} className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>Page {meta.page} of {meta.totalPages} · {meta.total} users</span>
              <div className="flex gap-2">
                <button type="button" disabled={meta.page <= 1} onClick={() => setFilters({ ...filters, page: meta.page - 1 })} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button>
                <button type="button" disabled={meta.page >= meta.totalPages} onClick={() => setFilters({ ...filters, page: meta.page + 1 })} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </AsyncState>
      </div>
    </div>
  )
}
