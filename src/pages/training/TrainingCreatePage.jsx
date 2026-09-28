import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Check } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { trainingPrograms } from '../../data/trainingWorkspace'
import { readWorkspaceData, writeWorkspaceData } from '../../data/workspaceStorage'

const programsStorageKey = 'skillbridge-training-programs-v1'
const initialForm = { title: '', category: '', duration: '', mode: 'Online', instructor: '', description: '' }

export default function TrainingCreatePage() {
  const [form, setForm] = useState(initialForm)
  const navigate = useNavigate()
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const publishProgram = (event) => {
    event.preventDefault()
    const programs = readWorkspaceData(programsStorageKey, trainingPrograms)
    const program = { ...form, id: Math.max(0, ...programs.map((item) => Number(item.id) || 0)) + 1, learners: 0, completion: 0, status: 'Active', nextSession: 'Not scheduled' }
    writeWorkspaceData(programsStorageKey, [...programs, program])
    navigate('/training/programs')
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Learning catalog" title="Create a program" description="Set up a learning opportunity and make it available to learners." />
      <form onSubmit={publishProgram} className="card-surface max-w-4xl space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700"><BookOpen size={19} /></span><div><h2 className="font-bold text-slate-900">Program details</h2><p className="mt-1 text-sm text-slate-500">You can update availability after publishing.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="program-title" className="field-label">Program title</label><input id="program-title" name="title" value={form.title} onChange={updateField} required placeholder="e.g. Introduction to data analysis" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="program-category" className="field-label">Learning area</label><input id="program-category" name="category" value={form.category} onChange={updateField} required placeholder="e.g. Data and analytics" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="program-duration" className="field-label">Duration</label><input id="program-duration" name="duration" value={form.duration} onChange={updateField} required placeholder="e.g. 6 weeks" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="program-mode" className="field-label">Delivery mode</label><select id="program-mode" name="mode" value={form.mode} onChange={updateField} className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm"><option>Online</option><option>Hybrid</option><option>In person</option></select></div>
          <div><label htmlFor="program-instructor" className="field-label">Lead instructor</label><input id="program-instructor" name="instructor" value={form.instructor} onChange={updateField} required placeholder="Instructor name" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div className="sm:col-span-2"><label htmlFor="program-description" className="field-label">Program overview</label><textarea id="program-description" name="description" value={form.description} onChange={updateField} required minLength="30" rows="5" placeholder="Describe the skills learners will build and how the program is delivered." className="w-full resize-y rounded-lg border border-slate-200 px-3.5 py-3 text-sm leading-6" /></div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center"><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"><Check size={16} />Publish program</button><p className="text-xs leading-5 text-slate-500">This demo saves the program in this browser.</p></div>
      </form>
    </div>
  )
}
