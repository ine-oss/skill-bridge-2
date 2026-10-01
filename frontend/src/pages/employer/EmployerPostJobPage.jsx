import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Check } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { jobService } from '../../services/jobService'

const initialForm = { title: '', team: '', location: '', employmentType: 'FULL_TIME', mode: 'ONSITE', experience: '', salary: '', deadline: '', skills: '', description: '', responsibilities: '', requirements: '', benefits: '' }
const lines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean)
const field = 'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm'

export default function EmployerPostJobPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (status) => {
    setSaving(true)
    setError('')
    try {
      await jobService.createJob({
        title: form.title,
        team: form.team || undefined,
        location: form.location,
        employmentType: form.employmentType,
        mode: form.mode,
        experience: form.experience || undefined,
        salary: form.salary || undefined,
        deadline: form.deadline || undefined,
        description: form.description,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        responsibilities: lines(form.responsibilities),
        requirements: lines(form.requirements),
        benefits: lines(form.benefits),
        status,
      })
      navigate('/employer/jobs')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const publish = (event) => {
    event.preventDefault()
    submit('ACTIVE')
  }
  const saveDraft = (event) => {
    const formElement = event.currentTarget.form
    if (formElement.reportValidity()) submit('DRAFT')
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Hiring" title="Post a job" description="Create a clear listing so candidates can quickly understand the opportunity." />
      <form onSubmit={publish} className="card-surface max-w-4xl space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><BriefcaseBusiness size={19} /></span><div><h2 className="font-bold text-slate-900">Role details</h2><p className="mt-1 text-sm text-slate-500">Required skills power candidate matching, so list them carefully.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="job-title" className="field-label">Job title</label><input id="job-title" name="title" value={form.title} onChange={updateField} required placeholder="e.g. Product designer" className={field} /></div>
          <div><label htmlFor="job-team" className="field-label">Team (optional)</label><input id="job-team" name="team" value={form.team} onChange={updateField} placeholder="e.g. Product and design" className={field} /></div>
          <div><label htmlFor="job-location" className="field-label">Location</label><input id="job-location" name="location" value={form.location} onChange={updateField} required placeholder="City / remote" className={field} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="job-type" className="field-label">Employment type</label><select id="job-type" name="employmentType" value={form.employmentType} onChange={updateField} className={field}><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option><option value="TEMPORARY">Temporary</option></select></div>
            <div><label htmlFor="job-mode" className="field-label">Work mode</label><select id="job-mode" name="mode" value={form.mode} onChange={updateField} className={field}><option value="ONSITE">On-site</option><option value="HYBRID">Hybrid</option><option value="REMOTE">Remote</option></select></div>
          </div>
          <div><label htmlFor="job-experience" className="field-label">Experience (optional)</label><input id="job-experience" name="experience" value={form.experience} onChange={updateField} placeholder="e.g. 2-4 years" className={field} /></div>
          <div><label htmlFor="job-deadline" className="field-label">Application deadline (optional)</label><input id="job-deadline" name="deadline" type="date" min={new Date().toISOString().slice(0, 10)} value={form.deadline} onChange={updateField} className={field} /></div>
          <div className="sm:col-span-2"><label htmlFor="job-salary" className="field-label">Salary range (optional)</label><input id="job-salary" name="salary" value={form.salary} onChange={updateField} placeholder="e.g. RWF 1,200,000 - 1,800,000 / month" className={field} /></div>
          <div className="sm:col-span-2"><label htmlFor="job-skills" className="field-label">Required skills (comma separated)</label><input id="job-skills" name="skills" value={form.skills} onChange={updateField} required placeholder="React, JavaScript, Git" className={field} /></div>
          <div className="sm:col-span-2"><label htmlFor="job-description" className="field-label">Role description</label><textarea id="job-description" name="description" value={form.description} onChange={updateField} required minLength="30" rows="6" placeholder="Describe the role, responsibilities, and experience candidates will gain." className={`${field} resize-y leading-6`} /></div>
          <div><label htmlFor="job-responsibilities" className="field-label">Responsibilities (one per line)</label><textarea id="job-responsibilities" name="responsibilities" value={form.responsibilities} onChange={updateField} rows="4" className={field} /></div>
          <div><label htmlFor="job-requirements" className="field-label">Requirements (one per line)</label><textarea id="job-requirements" name="requirements" value={form.requirements} onChange={updateField} rows="4" className={field} /></div>
          <div className="sm:col-span-2"><label htmlFor="job-benefits" className="field-label">Benefits (one per line)</label><textarea id="job-benefits" name="benefits" value={form.benefits} onChange={updateField} rows="3" className={field} /></div>
        </div>
        {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><Check size={16} />{saving ? 'Saving…' : 'Publish listing'}</button>
          <button type="button" disabled={saving} onClick={saveDraft} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Save as draft</button>
        </div>
      </form>
    </div>
  )
}
