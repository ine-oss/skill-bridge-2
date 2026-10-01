import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import VerificationPanel from '../../components/account/VerificationPanel'

const fields = [
  { id: 'registrationNumber', label: 'Business registration number (RDB / TIN)', placeholder: 'e.g. 108765432' },
  { id: 'businessPhone', label: 'Business phone number', placeholder: '+250 7…', type: 'tel' },
  { id: 'website', label: 'Website or public business profile', placeholder: 'https://', type: 'url', required: false },
]

export default function EmployerVerificationPage() {
  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Build candidate trust" title="Company verification" description="Verified companies get a badge on their profile and job listings." actionLabel="Edit company profile" actionTo="/employer/company-profile" icon={Building2} />
      <VerificationPanel title="Company verification" fields={fields} />
      <Link to="/employer/dashboard" className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">Return to hiring overview</Link>
    </div>
  )
}
