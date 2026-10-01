import { MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import { apiUrl } from '../../services/api'

export default function CompanyCard({ company }) {
  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        {company.logoUrl
          ? <img src={apiUrl(company.logoUrl)} alt={`${company.name} logo`} className="h-12 w-12 rounded-xl border border-slate-100 bg-white object-contain p-1" />
          : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-700">{company.name.slice(0, 2).toUpperCase()}</div>}
        {company.verified && <Badge tone="green">Verified</Badge>}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{company.industry}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={16} /> {company.location}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <ShieldCheck size={16} className="text-emerald-500" /> {company.jobs} active roles
      </div>
      <Link to={`/companies/${company.id}`} className="mt-5 inline-flex text-sm font-semibold text-blue-700">
        View company profile
      </Link>
    </div>
  )
}
