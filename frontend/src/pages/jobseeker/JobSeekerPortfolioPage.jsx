import { useState } from 'react'
import AsyncState from '../../components/common/AsyncState'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import useApi from '../../hooks/useApi'
import { userService } from '../../services/userService'

const LIST_FIELDS = [
  ['education', 'Education', 'One per line, e.g. B.Sc. Computer Engineering, UTB'],
  ['experience', 'Experience', 'One per line, e.g. Frontend Developer, Northstar Labs (2024–2026)'],
  ['certifications', 'Certifications', 'One per line'],
  ['languages', 'Languages', 'One per line'],
]
const TEXT_FIELDS = [
  ['headline', 'Headline', 'Frontend developer focused on accessible products'],
  ['targetCareer', 'Target career', 'Frontend Developer'],
  ['location', 'Location', 'Kigali, Rwanda'],
  ['portfolioUrl', 'Portfolio website', 'https://'],
  ['githubUrl', 'GitHub', 'https://github.com/…'],
  ['linkedinUrl', 'LinkedIn', 'https://linkedin.com/in/…'],
]

const toForm = (profile) => ({
  ...Object.fromEntries(TEXT_FIELDS.map(([key]) => [key, profile[key] || ''])),
  bio: profile.bio || '',
  ...Object.fromEntries(LIST_FIELDS.map(([key]) => [key, (profile[key] || []).join('\n')])),
})

export default function JobSeekerPortfolioPage() {
  const { data, loading, error, reload, setData } = useApi(() => userService.getJobSeekerProfile(), [])
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)
  const values = form ?? (data ? toForm(data.profile) : null)
  const change = (key) => (event) => setForm({ ...values, [key]: event.target.value })

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = { bio: values.bio || null }
      TEXT_FIELDS.forEach(([key]) => { payload[key] = values[key].trim() || null })
      LIST_FIELDS.forEach(([key]) => { payload[key] = values[key].split('\n').map((line) => line.trim()).filter(Boolean) })
      const { profile } = await userService.updateJobSeekerProfile(payload)
      setData({ profile })
      setForm(null)
      setStatus({ type: 'success', text: `Profile saved — ${profile.profileCompletion}% complete.` })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
          {data && <span className="text-sm font-semibold text-blue-700">{data.profile.profileCompletion}% complete</span>}
        </div>
        <p className="mt-2 text-sm text-slate-500">This is what employers see when they review your applications.</p>
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload}>
            {values && (
              <form onSubmit={save} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {TEXT_FIELDS.map(([key, text, placeholder]) => (
                    <Input key={key} id={`profile-${key}`} label={text} placeholder={placeholder} type={key.endsWith('Url') ? 'url' : 'text'} value={values[key]} onChange={change(key)} />
                  ))}
                </div>
                <div>
                  <label htmlFor="profile-bio" className="field-label">About you</label>
                  <textarea id="profile-bio" rows="4" value={values.bio} onChange={change('bio')} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {LIST_FIELDS.map(([key, text, placeholder]) => (
                    <div key={key}>
                      <label htmlFor={`profile-${key}`} className="field-label">{text}</label>
                      <textarea id={`profile-${key}`} rows="4" placeholder={placeholder} value={values[key]} onChange={change(key)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
                  {status.text && <span className={`text-sm font-medium ${status.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{status.text}</span>}
                </div>
              </form>
            )}
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
