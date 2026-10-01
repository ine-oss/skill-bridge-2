import { useState } from 'react'
import { Award, Search, Users } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { trainingService } from '../../services/trainingService'

const avatarColors = ['bg-sky-100 text-sky-700', 'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
const learnerState = (item) => (item.status === 'COMPLETED' ? 'Completed' : item.status === 'DROPPED' ? 'Dropped' : item.progress >= 50 ? 'On track' : 'Needs attention')
const stateTone = { Completed: 'bg-blue-50 text-blue-700', 'On track': 'bg-emerald-50 text-emerald-700', 'Needs attention': 'bg-amber-50 text-amber-700', Dropped: 'bg-slate-100 text-slate-500' }

export default function TrainingLearnersPage() {
  const [searchParams] = useSearchParams()
  const { data, loading, error, reload, setData } = useApi(() => trainingService.getEnrollments(), [])
  const [search, setSearch] = useState('')
  const [programId, setProgramId] = useState(searchParams.get('programId') || '')
  const [message, setMessage] = useState('')

  const learners = data?.data || []
  const programs = [...new Map(learners.map((item) => [item.program.id, item.program.title])).entries()]
  const visible = learners.filter((item) => (!programId || item.program.id === programId) && `${item.learner.name} ${item.learner.email}`.toLowerCase().includes(search.toLowerCase()))

  const markComplete = async (id) => {
    try {
      const { enrollment } = await trainingService.updateEnrollment(id, { status: 'COMPLETED' })
      setData((current) => ({ data: current.data.map((item) => item.id === id ? { ...item, ...enrollment } : item) }))
      setMessage(enrollment.certificate ? `Completed — certificate ${enrollment.certificate.code} issued.` : 'Marked as completed.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Learner management" title="Learners" description="Track enrollment and progress, and confirm completion to issue certificates." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5"><p className="text-sm text-slate-500">Learners shown</p><p className="mt-2 text-3xl font-bold text-slate-900">{visible.length}</p></div>
        <div className="card-surface p-5"><p className="text-sm text-slate-500">On track</p><p className="mt-2 text-3xl font-bold text-emerald-700">{visible.filter((item) => learnerState(item) === 'On track').length}</p></div>
        <div className="card-surface p-5"><p className="text-sm text-slate-500">Need attention</p><p className="mt-2 text-3xl font-bold text-amber-700">{visible.filter((item) => learnerState(item) === 'Needs attention').length}</p></div>
      </div>
      {message && <p className="text-sm font-medium text-slate-700" role="status">{message}</p>}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Users size={17} className="text-blue-700" />Enrollment register</div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative"><span className="sr-only">Search learners</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search learners" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm sm:w-56" /></label>
            <label><span className="sr-only">Filter by program</span><select value={programId} onChange={(event) => setProgramId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-56"><option value="">All programs</option>{programs.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
          </div>
        </div>
        <AsyncState loading={loading} error={error} onRetry={reload} empty={visible.length === 0} emptyTitle="No learners match">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500"><tr><th className="px-5 py-3">Learner</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Enrolled</th><th className="px-4 py-3">Status</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item, index) => {
                  const state = learnerState(item)
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[index % avatarColors.length]}`}>{item.learner.initials}</span><span><span className="block text-sm font-semibold text-slate-800">{item.learner.name}</span><span className="mt-1 block text-xs text-slate-500">{item.learner.email}</span></span></div></td>
                      <td className="px-4 py-4 text-sm text-slate-600">{item.program.title}</td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${item.progress}%` }} /></div><span className="text-xs font-semibold text-slate-600">{item.progress}%</span></div></td>
                      <td className="px-4 py-4 text-sm text-slate-500">{formatDate(item.enrolledAt)}</td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stateTone[state]}`}>{state}</span></td>
                      <td className="px-5 py-4 text-right">
                        {item.certificate ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><Award size={14} />{item.certificate.code}</span>
                          : ['ENROLLED', 'IN_PROGRESS'].includes(item.status) && <button type="button" onClick={() => markComplete(item.id)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Mark complete</button>}
                        {!item.certificate && item.status === 'COMPLETED' && <span className="text-xs text-slate-500">{label(item.status)}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {visible.length} of {learners.length} learners</div>
        </AsyncState>
      </section>
    </div>
  )
}
