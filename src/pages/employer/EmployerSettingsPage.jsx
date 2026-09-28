import { useState } from 'react'
import { Bell, Building2, Mail, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'

const settingsKey = 'skillbridge-employer-settings-v1'
const defaults = { newApplicants: true, interviewReminders: true, weeklyReport: false }

function readSettings() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey) || '{}') }
  } catch {
    return defaults
  }
}

export default function EmployerSettingsPage() {
  const [settings, setSettings] = useState(readSettings)
  const updateSetting = (key) => setSettings((current) => {
    const next = { ...current, [key]: !current[key] }
    localStorage.setItem(settingsKey, JSON.stringify(next))
    return next
  })
  const options = [
    { key: 'newApplicants', title: 'New applicant alerts', description: 'Get notified when someone applies to one of your active roles.', icon: Users },
    { key: 'interviewReminders', title: 'Interview reminders', description: 'Receive a reminder before a scheduled candidate interview.', icon: Bell },
    { key: 'weeklyReport', title: 'Weekly hiring summary', description: 'Get a weekly overview of applications and role performance.', icon: Mail },
  ]

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Workspace preferences" title="Settings" description="Manage hiring notifications and organization trust settings." />
      <section className="card-surface max-w-4xl divide-y divide-slate-100 px-5 sm:px-6" aria-label="Employer notification settings">
        <h2 className="py-5 text-base font-bold text-slate-900">Notifications</h2>
        {options.map(({ key, title, description, icon: Icon }) => <div key={key} className="flex items-center justify-between gap-4 py-5"><div className="flex min-w-0 items-start gap-3"><span className="rounded-lg bg-slate-100 p-2 text-slate-600"><Icon size={17} /></span><div><h3 className="text-sm font-semibold text-slate-800">{title}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{description}</p></div></div><button type="button" role="switch" aria-label={title} aria-checked={settings[key]} onClick={() => updateSetting(key)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${settings[key] ? 'bg-blue-700' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${settings[key] ? 'left-5' : 'left-0.5'}`} /></button></div>)}
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><ShieldCheck size={17} /></span><div><h3 className="text-sm font-semibold text-slate-800">Company verification</h3><p className="mt-1 text-sm text-slate-500">Build trust before candidates apply.</p></div></div><Link to="/employer/verification" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Manage verification <Building2 size={15} /></Link></div>
        <p className="py-4 text-xs text-slate-500">Preferences are saved in this browser for the frontend demo.</p>
      </section>
    </div>
  )
}
