import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Check } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { employerJobs } from '../../data/employerWorkspace'
import { readWorkspaceData, writeWorkspaceData } from '../../data/workspaceStorage'

const jobsStorageKey = 'skillbridge-employer-jobs-v1'
const initialForm = { title: '', team: '', location: '', type: 'Full-time', salary: '', description: '' }

export default function EmployerPostJobPage() {
  const [form, setForm] = useState(initialForm)
  const navigate = useNavigate()
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const publishJob = (event) => {
    event.preventDefault()
    const jobs = readWorkspaceData(jobsStorageKey, employerJobs)
    const closeDate = new Date()
    closeDate.setDate(closeDate.getDate() + 30)
    const dateLabel = (date) => new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(date)
    const job = { ...form, id: Math.max(0, ...jobs.map((item) => Number(item.id) || 0)) + 1, status: 'Active', applicants: 0, posted: dateLabel(new Date()), closes: dateLabel(closeDate) }
    writeWorkspaceData(jobsStorageKey, [...jobs, job])
    navigate('/employer/jobs')
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Hiring" title="Post a job" description="Create a clear listing so candidates can quickly understand the opportunity." />
      <form onSubmit={publishJob} className="card-surface max-w-4xl space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><BriefcaseBusiness size={19} /></span><div><h2 className="font-bold text-slate-900">Role details</h2><p className="mt-1 text-sm text-slate-500">Required fields are marked in the form.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="job-title" className="field-label">Job title</label><input id="job-title" name="title" value={form.title} onChange={updateField} required placeholder="e.g. Product designer" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="job-team" className="field-label">Team</label><input id="job-team" name="team" value={form.team} onChange={updateField} required placeholder="e.g. Product and design" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="job-location" className="field-label">Location</label><input id="job-location" name="location" value={form.location} onChange={updateField} required placeholder="City / remote" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="job-type" className="field-label">Employment type</label><select id="job-type" name="type" value={form.type} onChange={updateField} className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></div>
          <div className="sm:col-span-2"><label htmlFor="job-salary" className="field-label">Salary range (optional)</label><input id="job-salary" name="salary" value={form.salary} onChange={updateField} placeholder="e.g. RWF 1,200,000 - 1,800,000 / month" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div className="sm:col-span-2"><label htmlFor="job-description" className="field-label">Role description</label><textarea id="job-description" name="description" value={form.description} onChange={updateField} required minLength="30" rows="6" placeholder="Describe the role, responsibilities, and experience candidates will gain." className="w-full resize-y rounded-lg border border-slate-200 px-3.5 py-3 text-sm leading-6" /></div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center"><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"><Check size={16} />Publish listing</button><p className="text-xs leading-5 text-slate-500">This demo saves the listing in this browser.</p></div>
      </form>
    </div>
  )
}
