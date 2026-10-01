import { useState } from 'react'
import { Check, ShieldCheck } from 'lucide-react'
import AsyncState from '../common/AsyncState'
import FileLink from '../common/FileLink'
import FileUploadButton from '../common/FileUploadButton'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { userService } from '../../services/userService'

const tone = { APPROVED: 'bg-emerald-50 text-emerald-700', UNDER_REVIEW: 'bg-blue-50 text-blue-700', REJECTED: 'bg-red-50 text-red-700', NOT_SUBMITTED: 'bg-amber-50 text-amber-700' }

/**
 * Verification request form + status, backed by /api/verification.
 * `fields` = [{ id, label, placeholder, type }] collected as the request details.
 */
export default function VerificationPanel({ title = 'Verification', fields }) {
  const { refreshUser } = useAuth()
  const { data, loading, error, reload } = useApi(() => userService.getVerification(), [])
  const [values, setValues] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [document, setDocument] = useState(null)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const current = data?.verificationStatus || 'NOT_SUBMITTED'
  const canSubmit = current === 'NOT_SUBMITTED' || current === 'REJECTED'

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await userService.submitVerification({ ...values, ...(document ? { documentUrl: document.url, documentName: document.filename } : {}), confirmed })
      await refreshUser()
      await reload()
      setStatus({ type: 'success', text: 'Submitted. An administrator will review it shortly.' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card-surface max-w-4xl overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3"><span className="rounded-lg bg-white p-2.5 text-blue-700 shadow-sm"><ShieldCheck size={20} /></span><div><h2 className="font-bold text-slate-900">{title}</h2>{data?.request && <p className="mt-1 text-sm text-slate-500">Last submitted {formatDate(data.request.createdAt)}</p>}</div></div>
        <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${tone[current]}`}>{label(current)}</span>
      </div>
      <AsyncState loading={loading} error={error} onRetry={reload}>
        {data?.request?.reviewerNote && <p className="mx-5 mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800 sm:mx-6">Reviewer note: {data.request.reviewerNote}</p>}
        {canSubmit ? (
          <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
            {fields.map((item) => (
              <div key={item.id}>
                <label htmlFor={`verify-${item.id}`} className="field-label">{item.label}</label>
                <input id={`verify-${item.id}`} type={item.type || 'text'} required={item.required !== false} placeholder={item.placeholder} value={values[item.id] || ''} onChange={(event) => setValues({ ...values, [item.id]: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm" />
              </div>
            ))}
            <div>
              <p className="field-label">Supporting document (optional)</p>
              <div className="flex flex-wrap items-center gap-3">
                <FileUploadButton purpose="VERIFICATION" label={document ? 'Replace document' : 'Upload PDF or image'} onUploaded={setDocument} />
                {document && <FileLink url={document.url}>{document.filename}</FileLink>}
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" required checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 accent-blue-700" /> I confirm these details are accurate and may be checked by Skill Bridge.</label>
            {status.text && <p className={`text-sm font-medium ${status.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{status.text}</p>}
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><Check size={16} />{saving ? 'Submitting…' : 'Submit for review'}</button>
          </form>
        ) : (
          <p className="p-5 text-sm text-slate-600 sm:p-6">{current === 'APPROVED' ? 'Your account is verified. The verified badge now shows on your public profile.' : 'Your details are with our team. You will get a notification when the review is done.'}</p>
        )}
      </AsyncState>
    </section>
  )
}
