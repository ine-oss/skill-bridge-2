import { useState } from 'react'
import { Building2, Check } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'

const profileKey = 'skillbridge-training-profile-v1'
const emptyProfile = { name: '', focus: '', location: '', website: '', email: '', about: '' }

function readProfile() {
  try {
    return { ...emptyProfile, ...JSON.parse(localStorage.getItem(profileKey) || '{}') }
  } catch {
    return emptyProfile
  }
}

export default function TrainingProfilePage() {
  const [profile, setProfile] = useState(readProfile)
  const [saved, setSaved] = useState(false)
  const updateField = (event) => {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))
    setSaved(false)
  }
  const saveProfile = (event) => {
    event.preventDefault()
    localStorage.setItem(profileKey, JSON.stringify(profile))
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Provider workspace" title="Organization profile" description="Keep your provider details accurate so learners know who is delivering each program." />
      <form onSubmit={saveProfile} className="card-surface max-w-4xl space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><Building2 size={19} /></span><div><h2 className="font-bold text-slate-900">Provider information</h2><p className="mt-1 text-sm text-slate-500">These details appear alongside your training programs.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="provider-name" className="field-label">Organization name</label><input id="provider-name" name="name" required value={profile.name} onChange={updateField} placeholder="e.g. Skill Bridge Academy" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="provider-focus" className="field-label">Primary training area</label><input id="provider-focus" name="focus" required value={profile.focus} onChange={updateField} placeholder="e.g. Technology and design" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="provider-location" className="field-label">Location</label><input id="provider-location" name="location" value={profile.location} onChange={updateField} placeholder="City, country" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div><label htmlFor="provider-website" className="field-label">Website</label><input id="provider-website" name="website" type="url" value={profile.website} onChange={updateField} placeholder="https://example.com" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div className="sm:col-span-2"><label htmlFor="provider-email" className="field-label">Contact email</label><input id="provider-email" name="email" type="email" required value={profile.email} onChange={updateField} placeholder="training@example.com" className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" /></div>
          <div className="sm:col-span-2"><label htmlFor="provider-about" className="field-label">About your organization</label><textarea id="provider-about" name="about" rows="5" value={profile.about} onChange={updateField} placeholder="Describe your teaching approach and the learners you support." className="w-full resize-y rounded-lg border border-slate-200 px-3.5 py-3 text-sm leading-6" /></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5"><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"><Check size={16} />Save profile</button>{saved && <p role="status" className="text-sm font-medium text-emerald-700">Profile saved on this device.</p>}</div>
      </form>
    </div>
  )
}
