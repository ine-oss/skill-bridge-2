import { useState } from 'react'
import { CheckCircle2, FileText, ShieldCheck, UploadCloud } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

const savedProof = JSON.parse(localStorage.getItem('skillbridge-jobseeker-proof') || 'null')

export default function JobSeekerProfilePage() {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()
  const [cv, setCv] = useState(savedProof?.cv || null)
  const [experience, setExperience] = useState(savedProof?.experience || '')
  const [recommendation, setRecommendation] = useState(savedProof?.recommendation || '')
  const [consent, setConsent] = useState(savedProof?.consent || false)
  const [message, setMessage] = useState('')

  const handleCvChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setMessage('Please choose a PDF or DOCX CV.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Your CV must be smaller than 5 MB.')
      return
    }
    setCv({ name: file.name, size: file.size, type: file.type })
    setMessage('CV selected. Save your proof to send it for review.')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!cv || !experience.trim() || !recommendation.trim() || !consent) {
      setMessage('Add your CV, experience, one workplace recommendation, and consent before submitting.')
      return
    }
    const proof = { cv, experience, recommendation, consent, status: 'under_review', submittedAt: new Date().toISOString() }
    localStorage.setItem('skillbridge-jobseeker-proof', JSON.stringify(proof))
    updateUser({ profileVerified: true, verificationStatus: 'under_review', proof })
    setMessage('Your professional profile was submitted. Employers can now review your evidence.')
  }

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#a9472f]">
          <ShieldCheck size={17} /> {user.profileVerified ? t('review') : t('completeProfile')}
        </div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">{user.name || 'Your professional profile'}</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">{t('cvDescription')}</p>
      </header>

      {location.state?.onboarding && !user.profileVerified && (
        <div className="rounded-xl border border-[#e5c2b7] bg-[#f8e9e4] p-4 text-sm font-semibold text-[#8f3f2d]">
          Complete this verification step before applying for jobs. Your information stays private until you choose to share it.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900">{t('cvTitle')}</h2>
          <div className="mt-6 rounded-xl border border-dashed border-[#c7b8ae] bg-[#fbf8f4] p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#f2ddd5] p-3 text-[#a9472f]"><UploadCloud size={22} /></div>
              <div className="flex-1">
                <label htmlFor="cv-upload" className="text-base font-bold text-slate-900">{t('uploadCv')}</label>
                <p className="mt-1 text-sm leading-6 text-slate-600">PDF or DOCX, maximum 5 MB.</p>
                <input id="cv-upload" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleCvChange} className="mt-4 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#222724] file:px-3 file:py-2 file:font-semibold file:text-white" />
              </div>
            </div>
            {cv && <div className="mt-5 flex items-center gap-3 rounded-lg bg-white p-3 text-sm"><FileText size={18} className="text-[#a9472f]" /><span className="font-semibold text-slate-800">{cv.name}</span><span className="text-slate-500">Ready to review</span></div>}
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="experience" className="field-label">{t('experience')}</label>
              <textarea id="experience" value={experience} onChange={(event) => setExperience(event.target.value)} rows="5" placeholder="Describe your roles, responsibilities, projects, and outcomes." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm" />
            </div>
            <div>
              <label htmlFor="recommendation" className="field-label">{t('references')}</label>
              <textarea id="recommendation" value={recommendation} onChange={(event) => setRecommendation(event.target.value)} rows="5" placeholder="Add a recommendation from a previous workplace, including the person's name, role, company, and contact permission." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm" />
            </div>
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" /> I confirm this information is accurate and I allow Skill Bridge to review it for employer trust and matching.</label>
          </div>

          <div className="mt-7 flex items-center gap-4">
            <Button type="submit">{t('save')}</Button>
            {message && <span className="text-sm font-medium text-slate-600" role="status">{message}</span>}
          </div>
        </div>

        <aside className="card-surface h-fit p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Trust checklist</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            {[['CV uploaded', Boolean(cv)], ['Experience described', Boolean(experience.trim())], ['Work recommendation added', Boolean(recommendation.trim())], ['Consent provided', consent]].map(([label, complete]) => (
              <div key={label} className="flex items-center gap-3"><CheckCircle2 size={18} className={complete ? 'text-[#3f765b]' : 'text-slate-300'} /><span className={complete ? 'font-semibold text-slate-800' : ''}>{label}</span></div>
            ))}
          </div>
          <div className="mt-7 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">
            We verify the evidence you provide. Employers see your verified status and selected profile details, not private files by default.
          </div>
        </aside>
      </form>
    </div>
  )
}
