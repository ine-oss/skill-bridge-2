import { useState } from 'react'
import { ArrowRight, Building2, Check, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'

const verificationKey = 'skillbridge-employer-verification-v1'
const requirements = [
  { id: 'registration', label: 'Business registration document', detail: 'Confirm your organization is registered.' },
  { id: 'contact', label: 'Company contact information', detail: 'Add a work email and business phone number.' },
  { id: 'website', label: 'Website or public business profile', detail: 'Provide a public page that represents your organization.' },
]

function readVerification() {
  try {
    return JSON.parse(localStorage.getItem(verificationKey) || '{"checks":{},"submitted":false}')
  } catch {
    return { checks: {}, submitted: false }
  }
}

export default function EmployerVerificationPage() {
  const [verification, setVerification] = useState(readVerification)
  const completed = requirements.filter((item) => verification.checks[item.id]).length
  const update = (next) => {
    setVerification(next)
    localStorage.setItem(verificationKey, JSON.stringify(next))
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Build candidate trust" title="Company verification" description="Complete your organization checklist before sending it for review." actionLabel="Edit company profile" actionTo="/employer/company-profile" icon={Building2} />
      <section className="card-surface max-w-4xl overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-white p-2.5 text-blue-700 shadow-sm"><ShieldCheck size={20} /></span><div><h2 className="font-bold text-slate-900">Verification checklist</h2><p className="mt-1 text-sm text-slate-500">{completed} of {requirements.length} requirements marked complete</p></div></div><span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${verification.submitted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{verification.submitted ? 'Submitted for review' : 'Not submitted'}</span></div>
        <div className="divide-y divide-slate-100 px-5 sm:px-6">{requirements.map((item) => <label key={item.id} className="flex cursor-pointer items-start gap-3 py-5"><input type="checkbox" checked={Boolean(verification.checks[item.id])} onChange={(event) => update({ ...verification, submitted: false, checks: { ...verification.checks, [item.id]: event.target.checked } })} className="mt-1 h-4 w-4 accent-blue-700" /><span><span className="block text-sm font-semibold text-slate-800">{item.label}</span><span className="mt-1 block text-sm text-slate-500">{item.detail}</span></span></label>)}</div>
        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="text-xs leading-5 text-slate-500">This demo records your checklist in this browser; document upload and review require a connected service.</p><button type="button" disabled={completed !== requirements.length || verification.submitted} onClick={() => update({ ...verification, submitted: true })} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"><Check size={16} />{verification.submitted ? 'Submitted' : 'Submit for review'}<ArrowRight size={15} /></button></div>
      </section>
      <Link to="/employer/dashboard" className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">Return to hiring overview</Link>
    </div>
  )
}
