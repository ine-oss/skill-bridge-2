import { useState } from 'react'
import { Bell, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'

const settingsKey = 'skillbridge-training-settings-v1'
const defaults = { enrollmentEmail: true, weeklySummary: true, certificateAlerts: true, profileVisibility: true }

function readSettings() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey) || '{}') }
  } catch {
    return defaults
  }
}

export default function TrainingSettingsPage() {
  const [settings, setSettings] = useState(readSettings)
  const updateSetting = (key) => setSettings((current) => {
    const next = { ...current, [key]: !current[key] }
    localStorage.setItem(settingsKey, JSON.stringify(next))
    return next
  })
  const options = [
    { key: 'enrollmentEmail', title: 'New enrollment emails', description: 'Get an email when a learner joins one of your programs.', icon: Mail },
    { key: 'weeklySummary', title: 'Weekly learning summary', description: 'Receive a weekly overview of attendance and course progress.', icon: Bell },
    { key: 'certificateAlerts', title: 'Certificate review reminders', description: 'Be notified when a learner is ready to receive a certificate.', icon: ShieldCheck },
    { key: 'profileVisibility', title: 'Public provider profile', description: 'Allow learners to find your organization in the training catalog.', icon: LockKeyhole },
  ]

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Workspace preferences" title="Settings" description="Choose how your team receives updates and how learners discover your organization." />
      <section className="card-surface max-w-4xl divide-y divide-slate-100 px-5 sm:px-6" aria-label="Training provider preferences">
        {options.map(({ key, title, description, icon: Icon }) => <div key={key} className="flex items-center justify-between gap-4 py-5"><div className="flex min-w-0 items-start gap-3"><span className="rounded-lg bg-slate-100 p-2 text-slate-600"><Icon size={17} /></span><div><h2 className="text-sm font-semibold text-slate-800">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-500">{description}</p></div></div><button type="button" role="switch" aria-label={title} aria-checked={settings[key]} onClick={() => updateSetting(key)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${settings[key] ? 'bg-blue-700' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${settings[key] ? 'left-5' : 'left-0.5'}`} /></button></div>)}
        <p className="py-4 text-xs text-slate-500">Preferences are saved in this browser for the frontend demo.</p>
      </section>
    </div>
  )
}
