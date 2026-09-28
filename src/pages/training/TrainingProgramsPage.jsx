import { useState } from 'react'
import { BookOpen, CalendarDays, Users } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { trainingPrograms as initialPrograms } from '../../data/trainingWorkspace'
import { readWorkspaceData, writeWorkspaceData } from '../../data/workspaceStorage'

const filters = ['All', 'Active', 'Paused', 'Draft']
const programsStorageKey = 'skillbridge-training-programs-v1'

export default function TrainingProgramsPage() {
  const [programs, setPrograms] = useState(() => readWorkspaceData(programsStorageKey, initialPrograms))
  const [filter, setFilter] = useState('All')
  const visiblePrograms = programs.filter((program) => filter === 'All' || program.status === filter)
  const toggleProgram = (id) => {
    const updatedPrograms = programs.map((program) => program.id === id ? { ...program, status: program.status === 'Active' ? 'Paused' : 'Active' } : program)
    setPrograms(updatedPrograms)
    writeWorkspaceData(programsStorageKey, updatedPrograms)
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Learning catalog" title="Training programs" description="Manage course availability, enrollment, and the next scheduled session." actionLabel="Create program" actionTo="/training/create" icon={BookOpen} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter programs by status">
        {filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${filter === item ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{item}<span className="ml-2 text-xs opacity-75">{item === 'All' ? programs.length : programs.filter((program) => program.status === item).length}</span></button>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {visiblePrograms.map((program) => (
          <article key={program.id} className="card-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><BookOpen size={19} /></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${program.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : program.status === 'Draft' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{program.status}</span></div>
            <p className="mt-4 text-xs font-semibold uppercase text-slate-400">{program.category}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{program.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{program.duration} / {program.mode} / {program.instructor}</p>
            <div className="mt-5 flex items-center justify-between text-sm"><span className="inline-flex items-center gap-2 text-slate-600"><Users size={16} />{program.learners} learners</span><span className="inline-flex items-center gap-2 text-slate-500"><CalendarDays size={16} />{program.nextSession}</span></div>
            <div className="mt-4"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Average completion</span><span className="font-semibold text-slate-700">{program.completion}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${program.title} average completion`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={program.completion}><div className="h-full rounded-full bg-emerald-600" style={{ width: `${program.completion}%` }} /></div></div>
            <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">{program.status !== 'Draft' && <button type="button" onClick={() => toggleProgram(program.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{program.status === 'Active' ? 'Pause enrollment' : 'Resume enrollment'}</button>}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
