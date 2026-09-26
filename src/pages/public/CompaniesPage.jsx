import CompanyCard from '../../components/cards/CompanyCard'
import { companies } from '../../data/companies'

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8">
        <span className="section-kicker">Companies</span>
        <h1 className="section-title mt-4">Organizations hiring with confidence.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
      </div>
    </div>
  )
}
