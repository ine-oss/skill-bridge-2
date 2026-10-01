import { useState } from 'react'
import { Building2, Check } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import AsyncState from '../../components/common/AsyncState'
import VerificationPanel from '../../components/account/VerificationPanel'
import useApi from '../../hooks/useApi'
import { trainingService } from '../../services/trainingService'

const field = 'w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm'
const toForm = (provider) => ({ name: provider.name || '', pointOfContact: provider.pointOfContact || '', location: provider.location || '', website: provider.website || '', description: provider.description || '' })
const verificationFields = [
  { id: 'accreditation', label: 'Accreditation or registration number', placeholder: 'e.g. RTB / HEC / RDB number' },
  { id: 'contactPhone', label: 'Contact phone', placeholder: '+250 7…', type: 'tel' },
  { id: 'website', label: 'Website', placeholder: 'https://', type: 'url', required: false },
]

export default function TrainingProfilePage() {
  const { data, loading, error, reload, setData } = useApi(() => trainingService.getProviderProfile(), [])
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState({ type: '', text: '' })
  const values = form ?? (data ? toForm(data.provider) : null)
  const updateField = (event) => {
    setForm({ ...values, [event.target.name]: event.target.value })
    setStatus({ type: '', text: '' })
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    try {
      const { provider } = await trainingService.updateProviderProfile({
        name: values.name,
        pointOfContact: values.pointOfContact || null,
        location: values.location || null,
        website: values.website || null,
        description: values.description || null,
      })
      setData({ provider })
      setForm(null)
      setStatus({ type: 'success', text: 'Profile saved.' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Provider workspace" title="Organization profile" description="Keep your provider details accurate so learners know who is delivering each program." />
      <AsyncState loading={loading} error={error} onRetry={reload}>
        {values && (
          <form onSubmit={saveProfile} className="card-surface max-w-4xl space-y-6 p-5 sm:p-7">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><Building2 size={19} /></span><div><h2 className="font-bold text-slate-900">Provider information</h2><p className="mt-1 text-sm text-slate-500">These details appear alongside your training programs.</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="provider-name" className="field-label">Organization name</label><input id="provider-name" name="name" required value={values.name} onChange={updateField} placeholder="e.g. Skill Bridge Academy" className={field} /></div>
              <div><label htmlFor="provider-contact" className="field-label">Primary contact</label><input id="provider-contact" name="pointOfContact" value={values.pointOfContact} onChange={updateField} placeholder="Full name" className={field} /></div>
              <div><label htmlFor="provider-location" className="field-label">Location</label><input id="provider-location" name="location" value={values.location} onChange={updateField} placeholder="City, country" className={field} /></div>
              <div><label htmlFor="provider-website" className="field-label">Website</label><input id="provider-website" name="website" type="url" value={values.website} onChange={updateField} placeholder="https://example.com" className={field} /></div>
              <div className="sm:col-span-2"><label htmlFor="provider-about" className="field-label">About your organization</label><textarea id="provider-about" name="description" rows="5" value={values.description} onChange={updateField} placeholder="Describe your teaching approach and the learners you support." className={`${field} resize-y leading-6`} /></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5"><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"><Check size={16} />Save profile</button>{status.text && <p role="status" className={`text-sm font-medium ${status.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>{status.text}</p>}</div>
          </form>
        )}
      </AsyncState>
      <VerificationPanel title="Provider verification" fields={verificationFields} />
    </div>
  )
}
