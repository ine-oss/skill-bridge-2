import CompanyCard from '../../components/cards/CompanyCard'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { toCompanyView } from '../../lib/format'
import { companyService } from '../../services/companyService'

export default function CompaniesPage() {
  const { data, loading, error, reload } = useApi(() => companyService.getCompanies({ limit: 60 }), [])
  const companies = (data?.data || []).map(toCompanyView)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8">
        <span className="section-kicker">Companies</span>
        <h1 className="section-title mt-4">Organizations hiring with confidence.</h1>
      </div>
      <AsyncState loading={loading} error={error} onRetry={reload} empty={companies.length === 0} emptyTitle="No companies yet">
        <div className="grid gap-6 md:grid-cols-3">
          {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
        </div>
      </AsyncState>
    </div>
  )
}
