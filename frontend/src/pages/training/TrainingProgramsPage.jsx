import { useState } from 'react'
import { BookOpen, CalendarDays, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label, toDateTimeLocal } from '../../lib/format'
import { trainingService } from '../../services/trainingService'

const filters = [['All', ''], ['Active', 'ACTIVE'], ['Draft', 'DRAFT'], ['Archived', 'ARCHIVED']]
const statusTone = { ACTIVE: 'bg-emerald-50 text-emerald-700', DRAFT: 'bg-amber-50 text-amber-700', ARCHIVED: 'bg-slate-100 text-slate-600' }

export default function TrainingProgramsPage() {
  const { data, loading, error, reload, setData } = useApi(() => trainingService.getMyPrograms(), [])
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const programs = data?.data || []
  const visiblePrograms = programs.filter((program) => !filter || program.status === filter)

  const patch = async (id, changes) => {
    try {
      const { program } = await trainingService.updateProgram(id, changes)
      setData((current) => ({ data: current.data.map((item) => item.id === id ? { ...item, ...program } : item) }))
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    }
  }
  const remove = async (program) => {
    if (!window.confirm(`Delete “${program.title}”? Enrollments will be deleted too.`)) return
    try {
      await trainingService.deleteProgram(program.id)
      setData((current) => ({ data: current.data.filter((item) => item.id !== program.id) }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Learning catalog" title="Training programs" description="Manage course availability, enrollment, and the next scheduled session." actionLabel="Create program" actionTo="/training/create" icon={BookOpen} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter programs by status">
        {filters.map(([text, value]) => <button key={text} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${filter === value ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{text}<span className="ml-2 text-xs opacity-75">{value ? programs.filter((program) => program.status === value).length : programs.length}</span></button>)}
      </div>
      {message && <p className="text-sm text-red-700" role="alert">{message}</p>}
      <AsyncState loading={loading} error={error} onRetry={reload} empty={visiblePrograms.length === 0} emptyTitle={programs.length ? 'No programs in this status' : 'No programs yet'} emptyText={programs.length ? undefined : 'Create your first program to start enrolling learners.'}>
        <div className="grid gap-4 xl:grid-cols-2">
          {visiblePrograms.map((program) => (
            <article key={program.id} className="card-surface p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><BookOpen size={19} /></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[program.status]}`}>{label(program.status)}</span></div>
              <p className="mt-4 text-xs font-semibold uppercase text-slate-400">{program.category}</p>
              <Link to={`/training/${program.id}`} className="mt-1 block text-xl font-bold text-slate-900 hover:text-blue-700">{program.title}</Link>
              <p className="mt-1 text-sm text-slate-500">{[program.duration, label(program.mode), program.instructor].filter(Boolean).join(' / ')}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link to={`/training/learners?programId=${program.id}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-700"><Users size={16} />{program.learnersCount} learners</Link>
                <label className="inline-flex items-center gap-2 text-slate-500"><CalendarDays size={16} /><span className="sr-only">Next session</span>
                  <input type="datetime-local" defaultValue={toDateTimeLocal(program.nextSession)} onBlur={(event) => event.target.value && patch(program.id, { nextSession: new Date(event.target.value).toISOString() })} className="rounded-lg border border-slate-200 px-2 py-1 text-xs" title={program.nextSession ? `Next session ${formatDate(program.nextSession)}` : 'Set next session'} />
                </label>
              </div>
              <div className="mt-4"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Average progress</span><span className="font-semibold text-slate-700">{program.completion}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${program.title} average progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={program.completion}><div className="h-full rounded-full bg-emerald-600" style={{ width: `${program.completion}%` }} /></div></div>
              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                {program.status === 'DRAFT' && <button type="button" onClick={() => patch(program.id, { status: 'ACTIVE' })} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Publish</button>}
                {program.status === 'ACTIVE' && <button type="button" onClick={() => patch(program.id, { status: 'ARCHIVED' })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close enrollment</button>}
                {program.status === 'ARCHIVED' && <button type="button" onClick={() => patch(program.id, { status: 'ACTIVE' })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Reopen enrollment</button>}
                <button type="button" onClick={() => remove(program)} aria-label={`Delete ${program.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      </AsyncState>
    </div>
  )
}
