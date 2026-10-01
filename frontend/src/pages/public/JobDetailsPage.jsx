import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BriefcaseBusiness, MapPin, CalendarDays, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react'
import Button from '../../components/common/Button'
import AsyncState from '../../components/common/AsyncState'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import { label, toJobView } from '../../lib/format'
import { applicationService } from '../../services/applicationService'
import { jobService } from '../../services/jobService'

export default function JobDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error, reload, setData } = useApi(() => jobService.getJobById(id), [id, user.isAuthenticated])
  const [coverLetter, setCoverLetter] = useState('')
  const [showApply, setShowApply] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)

  const raw = data?.job
  const job = raw ? toJobView(raw) : null
  const isJobSeeker = user.isAuthenticated && user.role === 'jobseeker'

  const startApply = () => {
    if (!user.isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }
    setShowApply(true)
  }

  const submitApplication = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      await applicationService.submitApplication({ jobId: id, coverLetter: coverLetter || undefined })
      setData((current) => ({ job: { ...current.job, applicationStatus: 'NEW' } }))
      setShowApply(false)
      setMessage({ type: 'success', text: 'Application sent. You can follow it under My applications.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  const toggleSave = async () => {
    try {
      if (raw.saved) await jobService.unsaveJob(id)
      else await jobService.saveJob(id)
      setData((current) => ({ job: { ...current.job, saved: !current.job.saved } }))
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <AsyncState loading={loading} error={error} onRetry={reload}>
        {job && (
          <div className="card-surface p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Link to={`/companies/${job.companyId}`} className="text-sm text-slate-500 hover:text-blue-700">{job.company}</Link>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{job.title}</h1>
                {isJobSeeker && typeof raw.match === 'number' && <p className="mt-2 text-sm font-semibold text-blue-700">{raw.match}% skill match</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {isJobSeeker && (
                  <Button variant="secondary" onClick={toggleSave}>
                    {raw.saved ? <BookmarkCheck size={16} className="mr-2" /> : <Bookmark size={16} className="mr-2" />}
                    {raw.saved ? 'Saved' : 'Save job'}
                  </Button>
                )}
                {raw.applicationStatus ? (
                  <Button variant="success" disabled>Applied · {label(raw.applicationStatus)}</Button>
                ) : (
                  (!user.isAuthenticated || isJobSeeker) && <Button onClick={startApply}>Apply now</Button>
                )}
              </div>
            </div>

            {message.text && <p className={`mt-4 text-sm font-medium ${message.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p>}

            {showApply && (
              <form onSubmit={submitApplication} className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <label htmlFor="coverLetter" className="field-label">Cover letter (optional)</label>
                <textarea id="coverLetter" rows={5} value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Tell the employer why you are a good fit." />
                {raw.missingSkills?.length > 0 && <p className="mt-2 text-xs text-slate-500">Skills you haven't added yet: {raw.missingSkills.join(', ')}</p>}
                <div className="mt-4 flex gap-2">
                  <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send application'}</Button>
                  <Button variant="ghost" onClick={() => setShowApply(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} /> {job.location}</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><BriefcaseBusiness size={16} /> {job.employmentType} · {job.mode}</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><CalendarDays size={16} /> Deadline: {job.deadline}</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><DollarSign size={16} /> {job.salary}</div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
              <div>
                <h2 className="text-xl font-bold text-slate-900">About the role</h2>
                <p className="mt-3 whitespace-pre-line text-slate-600">{job.description}</p>
                {job.responsibilities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900">Responsibilities</h3>
                    <ul className="mt-3 space-y-2 text-slate-600">{job.responsibilities.map((item) => <li key={item}>• {item}</li>)}</ul>
                  </div>
                )}
                {job.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900">Requirements</h3>
                    <ul className="mt-3 space-y-2 text-slate-600">{job.requirements.map((item) => <li key={item}>• {item}</li>)}</ul>
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">Required skills</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{skill}</span>)}
                </div>
                {job.benefits.length > 0 && (
                  <>
                    <h3 className="mt-6 text-lg font-bold text-slate-900">Benefits</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">{job.benefits.map((item) => <li key={item}>• {item}</li>)}</ul>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </AsyncState>
    </div>
  )
}
