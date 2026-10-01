import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Check } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { trainingService } from '../../services/trainingService'

const initialForm = { title: '', category: '', type: 'Course', duration: '', mode: 'ONLINE', difficulty: 'BEGINNER', instructor: '', skills: '', nextSession: '', certificate: true, description: '' }
const field = 'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm'

export default function TrainingCreatePage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (status) => {
    setSaving(true)
    setError('')
    try {
      await trainingService.createProgram({
        title: form.title,
        category: form.category || undefined,
        type: form.type || undefined,
        duration: form.duration || undefined,
        mode: form.mode,
        difficulty: form.difficulty,
        instructor: form.instructor || undefined,
        certificate: form.certificate,
        nextSession: form.nextSession ? new Date(form.nextSession).toISOString() : undefined,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        description: form.description,
        status,
      })
      navigate('/training/programs')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Learning catalog" title="Create a program" description="Set up a learning opportunity and make it available to learners." />
      <form onSubmit={(event) => { event.preventDefault(); submit('ACTIVE') }} className="card-surface max-w-4xl space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700"><BookOpen size={19} /></span><div><h2 className="font-bold text-slate-900">Program details</h2><p className="mt-1 text-sm text-slate-500">The skills you list are used to recommend this program to job seekers with matching gaps.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="program-title" className="field-label">Program title</label><input id="program-title" name="title" value={form.title} onChange={updateField} required placeholder="e.g. Introduction to data analysis" className={field} /></div>
          <div><label htmlFor="program-category" className="field-label">Learning area</label><input id="program-category" name="category" value={form.category} onChange={updateField} required placeholder="e.g. Data and analytics" className={field} /></div>
          <div><label htmlFor="program-type" className="field-label">Program type</label><select id="program-type" name="type" value={form.type} onChange={updateField} className={field}><option>Course</option><option>Bootcamp</option><option>Programme</option><option>Workshop</option></select></div>
          <div><label htmlFor="program-duration" className="field-label">Duration</label><input id="program-duration" name="duration" value={form.duration} onChange={updateField} required placeholder="e.g. 6 weeks" className={field} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="program-mode" className="field-label">Delivery mode</label><select id="program-mode" name="mode" value={form.mode} onChange={updateField} className={field}><option value="ONLINE">Online</option><option value="HYBRID">Hybrid</option><option value="IN_PERSON">In person</option></select></div>
            <div><label htmlFor="program-difficulty" className="field-label">Level</label><select id="program-difficulty" name="difficulty" value={form.difficulty} onChange={updateField} className={field}><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></div>
          </div>
          <div><label htmlFor="program-instructor" className="field-label">Lead instructor</label><input id="program-instructor" name="instructor" value={form.instructor} onChange={updateField} required placeholder="Instructor name" className={field} /></div>
          <div><label htmlFor="program-next" className="field-label">First / next session (optional)</label><input id="program-next" name="nextSession" type="datetime-local" value={form.nextSession} onChange={updateField} className={field} /></div>
          <div className="sm:col-span-2"><label htmlFor="program-skills" className="field-label">Skills taught (comma separated)</label><input id="program-skills" name="skills" value={form.skills} onChange={updateField} required placeholder="SQL, Excel, Power BI" className={field} /></div>
          <div className="sm:col-span-2"><label htmlFor="program-description" className="field-label">Program overview</label><textarea id="program-description" name="description" value={form.description} onChange={updateField} required minLength="30" rows="5" placeholder="Describe the skills learners will build and how the program is delivered." className={`${field} resize-y leading-6`} /></div>
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2"><input type="checkbox" name="certificate" checked={form.certificate} onChange={updateField} className="h-4 w-4 accent-blue-700" /> Issue a certificate when learners complete the program</label>
        </div>
        {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><Check size={16} />{saving ? 'Saving…' : 'Publish program'}</button>
          <button type="button" disabled={saving} onClick={(event) => event.currentTarget.form.reportValidity() && submit('DRAFT')} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Save as draft</button>
        </div>
      </form>
    </div>
  )
}
