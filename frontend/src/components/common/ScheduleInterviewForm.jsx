import { useState } from 'react'
import { applicationService } from '../../services/applicationService'

/** Small inline form an employer uses to invite an applicant to an interview. */
export default function ScheduleInterviewForm({ applicationId, onScheduled, onCancel }) {
  const [form, setForm] = useState(() => ({
    date: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10), // tomorrow
    time: '10:00',
    type: 'Technical interview',
    location: '',
    durationMins: 45,
  }))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const change = (key) => (event) => setForm({ ...form, [key]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { interview } = await applicationService.scheduleInterview({
        applicationId,
        scheduledAt: new Date(`${form.date}T${form.time}`).toISOString(),
        type: form.type,
        location: form.location || undefined,
        durationMins: Number(form.durationMins),
      })
      onScheduled?.(interview)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const field = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm'
  return (
    <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:grid-cols-2">
      <label className="text-xs font-semibold text-slate-600">Date<input type="date" required min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={change('date')} className={`mt-1 ${field}`} /></label>
      <label className="text-xs font-semibold text-slate-600">Time<input type="time" required value={form.time} onChange={change('time')} className={`mt-1 ${field}`} /></label>
      <label className="text-xs font-semibold text-slate-600">Interview type<input required value={form.type} onChange={change('type')} className={`mt-1 ${field}`} /></label>
      <label className="text-xs font-semibold text-slate-600">Duration (minutes)<input type="number" min="10" max="480" value={form.durationMins} onChange={change('durationMins')} className={`mt-1 ${field}`} /></label>
      <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Location or meeting link<input value={form.location} onChange={change('location')} placeholder="Office address or video link" className={`mt-1 ${field}`} /></label>
      {error && <p className="text-sm text-red-700 sm:col-span-2" role="alert">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{saving ? 'Sending…' : 'Send invitation'}</button>
        <button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
      </div>
    </form>
  )
}
