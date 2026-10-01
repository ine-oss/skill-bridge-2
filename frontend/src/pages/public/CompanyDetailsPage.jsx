import { useParams } from 'react-router-dom'
import { MapPin, Building2, ShieldCheck } from 'lucide-react'
import JobCard from '../../components/cards/JobCard'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { apiUrl } from '../../services/api'
import { toCompanyView, toJobView } from '../../lib/format'
import { companyService } from '../../services/companyService'

export default function CompanyDetailsPage() {
  const { id } = useParams()
  const { data, loading, error, reload } = useApi(() => companyService.getCompany(id), [id])
  const company = data ? toCompanyView(data.company) : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <AsyncState loading={loading} error={error} onRetry={reload}>
        {company && (
          <>
            <div className="card-surface p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {company.logoUrl
                    ? <img src={apiUrl(company.logoUrl)} alt={`${company.name} logo`} className="h-16 w-16 rounded-2xl border border-slate-100 bg-white object-contain p-1" />
                    : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-700">{company.name.slice(0, 2).toUpperCase()}</div>}
                  <h1 className="mt-5 text-3xl font-bold text-slate-900">{company.name}</h1>
                </div>
                {company.verified && <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"><ShieldCheck size={16} /> Verified</div>}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Industry</div><div className="mt-2 font-semibold">{company.industry}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Location</div><div className="mt-2 flex items-center gap-2 font-semibold"><MapPin size={16} /> {company.location}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Company size</div><div className="mt-2 flex items-center gap-2 font-semibold"><Building2 size={16} /> {company.size}</div></div>
              </div>

              {company.description && <p className="mt-6 text-slate-600">{company.description}</p>}
              {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-blue-700">{company.website}</a>}
            </div>

            <h2 className="mt-10 text-xl font-bold text-slate-900">Open roles ({company.jobs.length})</h2>
            {company.jobs.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No open roles right now.</p>
            ) : (
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {company.jobs.map((job) => <JobCard key={job.id} job={toJobView(job)} />)}
              </div>
            )}
          </>
        )}
      </AsyncState>
    </div>
  )
}
