import { useEffect, useState } from 'react'
import { Building2, Check, CheckCircle2, ImagePlus, LockKeyhole, MailPlus, ShieldCheck, Users, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const profileStorageKey = 'skillbridge-company-profile-v1'
const recruitersStorageKey = 'skillbridge-company-recruiters-v1'
const verificationItems = ['Business registration document', 'Company contact details', 'Official website or business presence']
const settingsTabs = [
  { id: 'profile', label: 'Profile Info', icon: Building2 },
  { id: 'verification', label: 'Company Verification', icon: ShieldCheck },
  { id: 'recruiters', label: 'Manage Recruiters', icon: Users },
  { id: 'security', label: 'Security / Password', icon: LockKeyhole },
]

function readStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

const emptyProfile = { companyName: '', industry: '', website: '', headquarters: '', overview: '', logoDataUrl: '' }

export default function EmployerCompanyProfilePage() {
  const { user } = useAuth()
  const savedProfile = readStoredValue(profileStorageKey, {})
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm] = useState({ ...emptyProfile, companyName: user.companyName || '', ...savedProfile })
  const [logoError, setLogoError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [recruiters, setRecruiters] = useState(() => readStoredValue(recruitersStorageKey, []))
  const [recruiterEmail, setRecruiterEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => readStoredValue('skillbridge-company-two-factor', false))

  useEffect(() => {
    if (!form.logoDataUrl?.startsWith('data:image/')) return undefined
    const previewUrl = URL.createObjectURL(new Blob([Uint8Array.from(atob(form.logoDataUrl.split(',')[1]), (char) => char.charCodeAt(0))], { type: form.logoDataUrl.match(/^data:(.*?);/)?.[1] || 'image/png' }))
    return () => URL.revokeObjectURL(previewUrl)
  }, [form.logoDataUrl])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSaveMessage('')
  }

  const acceptLogo = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('Choose an image file such as PNG, JPG, or WebP.')
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setLogoError('Please choose an image smaller than 1.5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({ ...current, logoDataUrl: String(reader.result) }))
      setLogoError('')
      setSaveMessage('Logo added. Save your changes to keep it.')
    }
    reader.onerror = () => setLogoError('The image could not be read. Please try another file.')
    reader.readAsDataURL(file)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    localStorage.setItem(profileStorageKey, JSON.stringify(form))
    setSaveMessage('Organization profile saved on this device.')
  }

  const inviteRecruiter = (event) => {
    event.preventDefault()
    const normalizedEmail = recruiterEmail.trim().toLowerCase()
    if (!normalizedEmail) return
    if (recruiters.some((recruiter) => recruiter.email === normalizedEmail)) {
      setInviteMessage('This recruiter is already in your team.')
      return
    }
    const updatedRecruiters = [...recruiters, { email: normalizedEmail, status: 'Invitation pending' }]
    setRecruiters(updatedRecruiters)
    localStorage.setItem(recruitersStorageKey, JSON.stringify(updatedRecruiters))
    setRecruiterEmail('')
    setInviteMessage(`Invitation prepared for ${normalizedEmail}.`)
  }

  const removeRecruiter = (email) => {
    const updatedRecruiters = recruiters.filter((recruiter) => recruiter.email !== email)
    setRecruiters(updatedRecruiters)
    localStorage.setItem(recruitersStorageKey, JSON.stringify(updatedRecruiters))
  }

  const toggleTwoFactor = () => {
    const nextValue = !twoFactorEnabled
    setTwoFactorEnabled(nextValue)
    localStorage.setItem('skillbridge-company-two-factor', JSON.stringify(nextValue))
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">Organization settings</p>
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Organization profile</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your company information, trust details, and workspace access.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"><ShieldCheck size={14} /> Verification pending</span>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.8fr)]">
        <nav aria-label="Organization settings" className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
          <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">Settings</p>
          <div className="space-y-1">
            {settingsTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => { setActiveTab(id); setSaveMessage('') }} aria-current={activeTab === id ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${activeTab === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Icon size={18} />{label}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><ShieldCheck size={17} className="text-blue-600" /> Build company trust</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Complete your organization details so candidates can verify who is hiring.</p>
          </div>
        </nav>

        <section className="min-w-0 rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile} className="space-y-6">
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-5">
                <h2 className="text-lg font-bold text-slate-800">Profile information</h2>
                <p className="text-sm text-slate-500">This information appears on your organization profile and job listings.</p>
              </div>

              <div>
                <label htmlFor="company-logo" className="mb-2 block text-sm font-semibold text-slate-700">Company logo</label>
                <label htmlFor="company-logo" onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); acceptLogo(event.dataTransfer.files?.[0]) }} className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-5 py-6 text-center transition ${dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                  {form.logoDataUrl ? <img src={form.logoDataUrl} alt="Company logo preview" className="h-16 w-16 rounded-xl border border-slate-200 bg-white object-contain p-1" /> : <span className="mb-2 rounded-lg bg-white p-2.5 text-blue-600 shadow-sm"><ImagePlus size={21} /></span>}
                  <span className="mt-2 text-sm font-semibold text-slate-700">{form.logoDataUrl ? 'Choose a different logo' : 'Drop your logo here or browse'}</span>
                  <span className="mt-1 text-xs text-slate-500">PNG, JPG, or WebP · up to 1.5 MB</span>
                </label>
                <input id="company-logo" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(event) => acceptLogo(event.target.files?.[0])} />
                {logoError && <p className="mt-2 text-xs font-medium text-red-600" role="alert">{logoError}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="companyName" className="mb-2 block text-sm font-semibold text-slate-700">Company name</label>
                  <input id="companyName" name="companyName" value={form.companyName} onChange={updateField} required placeholder="e.g. Umurava Technologies" className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label htmlFor="industry" className="mb-2 block text-sm font-semibold text-slate-700">Industry</label>
                  <select id="industry" name="industry" value={form.industry} onChange={updateField} required className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="">Select an industry</option>
                    <option>Technology</option><option>Financial services</option><option>Education</option><option>Healthcare</option><option>Manufacturing</option><option>Non-profit</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="website" className="mb-2 block text-sm font-semibold text-slate-700">Website URL</label>
                  <input id="website" name="website" type="url" value={form.website} onChange={updateField} placeholder="https://www.example.com" className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label htmlFor="headquarters" className="mb-2 block text-sm font-semibold text-slate-700">Headquarters location</label>
                  <input id="headquarters" name="headquarters" value={form.headquarters} onChange={updateField} placeholder="City, country" className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label htmlFor="overview" className="mb-2 block text-sm font-semibold text-slate-700">Company overview / mission statement</label>
                <textarea id="overview" name="overview" value={form.overview} onChange={updateField} rows="5" maxLength="1000" placeholder="Tell candidates what your organization does, who you serve, and what makes your team a great place to grow." className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                <p className="mt-1 text-right text-xs text-slate-400">{form.overview.length}/1,000 characters</p>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"><Check size={17} /> Save Changes</button>
                {saveMessage && <p className="text-sm font-medium text-emerald-700" role="status">{saveMessage}</p>}
              </div>
            </form>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-5"><h2 className="text-lg font-bold text-slate-800">Company verification</h2><p className="mt-1 text-sm text-slate-500">Help candidates recognize and trust your organization.</p></div>
              <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5"><span className="rounded-full bg-white p-2 text-amber-600"><ShieldCheck size={20} /></span><div><p className="text-sm font-bold text-slate-800">Verification not submitted</p><p className="mt-1 text-sm leading-6 text-slate-600">Prepare the following items before submitting your organization for review.</p></div></div>
              <ul className="space-y-3">{verificationItems.map((item) => <li key={item} className="flex items-center gap-3 rounded-lg border border-slate-100 p-4 text-sm text-slate-700"><span className="h-5 w-5 rounded-full border border-slate-300" aria-hidden="true" />{item}</li>)}</ul>
              <a href="/employer/verification" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Continue verification</a>
            </div>
          )}

          {activeTab === 'recruiters' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-5"><h2 className="text-lg font-bold text-slate-800">Manage recruiters</h2><p className="mt-1 text-sm text-slate-500">Invite teammates to help manage applicants and interviews.</p></div>
              <form onSubmit={inviteRecruiter} className="flex flex-col gap-3 sm:flex-row"><label htmlFor="recruiter-email" className="sr-only">Recruiter email address</label><input id="recruiter-email" type="email" required value={recruiterEmail} onChange={(event) => setRecruiterEmail(event.target.value)} placeholder="teammate@company.com" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3.5 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"><MailPlus size={17} /> Invite recruiter</button></form>
              {inviteMessage && <p className="text-sm text-slate-600" role="status">{inviteMessage}</p>}
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {recruiters.length === 0 ? <p className="p-5 text-sm text-slate-500">No recruiters have been added yet. Invite a teammate using their work email.</p> : recruiters.map((recruiter) => <div key={recruiter.email} className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">{recruiter.email.charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{recruiter.email}</p><p className="text-xs text-slate-500">{recruiter.status}</p></div></div><button type="button" onClick={() => removeRecruiter(recruiter.email)} aria-label={`Remove ${recruiter.email}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><X size={17} /></button></div>)}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-5"><h2 className="text-lg font-bold text-slate-800">Security and password</h2><p className="mt-1 text-sm text-slate-500">Control how your organization workspace is protected.</p></div>
              <div className="flex items-start justify-between gap-5 rounded-xl border border-slate-100 p-5"><div className="flex gap-3"><span className="rounded-lg bg-blue-50 p-2 text-blue-700"><LockKeyhole size={19} /></span><div><p className="text-sm font-semibold text-slate-800">Two-step verification</p><p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">Add an extra verification step when signing in to the organization workspace.</p></div></div><button type="button" role="switch" aria-checked={twoFactorEnabled} onClick={toggleTwoFactor} className={`relative h-6 w-11 shrink-0 rounded-full transition ${twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${twoFactorEnabled ? 'left-5' : 'left-0.5'}`} /></button></div>
              <div className="rounded-xl border border-slate-100 p-5"><div className="flex items-center gap-3"><CheckCircle2 size={20} className={twoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'} /><div><p className="text-sm font-semibold text-slate-800">{twoFactorEnabled ? 'Two-step verification is enabled' : 'Two-step verification is off'}</p><p className="mt-1 text-xs text-slate-500">This preference is saved in this browser for the frontend demo.</p></div></div></div>
              <p className="text-xs leading-5 text-slate-500">Password changes and sign-in verification require a connected authentication service.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
