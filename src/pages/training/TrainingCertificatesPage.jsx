import { useState } from 'react'
import { Award, Download, Search } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { trainingCertificates } from '../../data/trainingWorkspace'

export default function TrainingCertificatesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const visibleCertificates = trainingCertificates.filter((certificate) => {
    const matchesFilter = filter === 'All' || certificate.status === filter
    const matchesSearch = `${certificate.learner} ${certificate.program} ${certificate.id}`.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })
  const downloadRegister = () => {
    const rows = [['Credential ID', 'Learner', 'Program', 'Issue date', 'Status'], ...visibleCertificates.map((item) => [item.id, item.learner, item.program, item.issued, item.status])]
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'training-certificates.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Credentials" title="Certificates" description="Review issued credentials and export the current certificate register." />
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Award size={18} className="text-amber-600" />Certificate register</div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative"><span className="sr-only">Search certificate register</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search learner or ID" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm sm:w-52" /></label>
            <label><span className="sr-only">Filter certificates by status</span><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>All</option><option>Issued</option><option>Pending review</option></select></label>
            <button type="button" onClick={downloadRegister} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download size={15} />Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500"><tr><th className="px-5 py-3">Learner</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Credential ID</th><th className="px-4 py-3">Issue date</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleCertificates.map((certificate) => <tr key={certificate.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-800">{certificate.initials}</span><span className="text-sm font-semibold text-slate-800">{certificate.learner}</span></div></td><td className="px-4 py-4 text-sm text-slate-600">{certificate.program}</td><td className="px-4 py-4 font-mono text-xs text-slate-600">{certificate.id}</td><td className="px-4 py-4 text-sm text-slate-500">{certificate.issued}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${certificate.status === 'Issued' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{certificate.status}</span></td></tr>)}</tbody></table>{visibleCertificates.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No certificates match these filters.</p>}</div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">{visibleCertificates.length} records shown</div>
      </section>
    </div>
  )
}
