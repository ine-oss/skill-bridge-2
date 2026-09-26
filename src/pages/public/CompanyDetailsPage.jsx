import { useParams } from 'react-router-dom'
import { MapPin, Building2, ShieldCheck } from 'lucide-react'
import { companies } from '../../data/companies'

export default function CompanyDetailsPage() {
  const { id } = useParams()
  const company = companies.find((item) => item.id === id) ?? companies[0]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="card-surface p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-700">
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="mt-5 text-3xl font-bold text-slate-900">{company.name}</h1>
          </div>
          {company.verified && <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"><ShieldCheck size={16} /> Verified</div>}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Industry</div><div className="mt-2 font-semibold">{company.industry}</div></div>
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Location</div><div className="mt-2 font-semibold flex items-center gap-2"><MapPin size={16} /> {company.location}</div></div>
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Company size</div><div className="mt-2 font-semibold flex items-center gap-2"><Building2 size={16} /> {company.size}</div></div>
        </div>

        <p className="mt-6 text-slate-600">{company.description}</p>
      </div>
    </div>
  )
}
