import { useState } from 'react'
import { Download } from 'lucide-react'
import { formatDate, label } from '../../lib/format'
import { adminService } from '../../services/adminService'
import { applicationService } from '../../services/applicationService'

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Fetches every page of a paginated endpoint.
async function fetchAll(load) {
  const first = await load(1)
  const rest = await Promise.all(Array.from({ length: first.meta.totalPages - 1 }, (_, index) => load(index + 2)))
  return [first, ...rest].flatMap((page) => page.data)
}

const reports = [
  {
    id: 'users', title: 'Users', description: 'Every account with role, status and verification.',
    build: async () => {
      const users = await fetchAll((page) => adminService.getUsers({ page, limit: 100 }))
      return [['Name', 'Email', 'Role', 'Status', 'Verification', 'Joined'], ...users.map((u) => [u.name, u.email, label(u.role), label(u.status), label(u.verificationStatus), formatDate(u.createdAt)])]
    },
  },
  {
    id: 'jobs', title: 'Jobs', description: 'All job listings with company, status and applicant count.',
    build: async () => {
      const jobs = await fetchAll((page) => adminService.getAllJobs({ page, limit: 100 }))
      return [['Title', 'Company', 'Status', 'Type', 'Mode', 'Applicants', 'Posted', 'Deadline'], ...jobs.map((j) => [j.title, j.company?.name, label(j.status), label(j.employmentType), label(j.mode), j.applicantsCount, formatDate(j.createdAt), j.deadline ? formatDate(j.deadline) : ''])]
    },
  },
  {
    id: 'applications', title: 'Applications', description: 'Every application with candidate, job, match and status.',
    build: async () => {
      const apps = await fetchAll((page) => applicationService.getApplications({ page, limit: 100 }))
      return [['Candidate', 'Email', 'Job', 'Company', 'Match %', 'Status', 'Applied'], ...apps.map((a) => [a.applicant?.name, a.applicant?.email, a.job?.title, a.job?.company?.name, a.match, label(a.status), formatDate(a.createdAt)])]
    },
  },
  {
    id: 'training', title: 'Training programs', description: 'All programs with provider, status and learners.',
    build: async () => {
      const programs = await fetchAll((page) => adminService.getAllPrograms({ page, limit: 100 }))
      return [['Program', 'Provider', 'Status', 'Mode', 'Learners', 'Created'], ...programs.map((p) => [p.title, p.provider?.name, label(p.status), label(p.mode), p.learnersCount, formatDate(p.createdAt)])]
    },
  },
]

export default function AdminReportsPage() {
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const run = async (report) => {
    setBusy(report.id)
    try {
      const rows = await report.build()
      downloadCsv(`skillbridge-${report.id}-${new Date().toISOString().slice(0, 10)}.csv`, rows)
      setMessage({ type: 'success', text: `${report.title} report downloaded (${rows.length - 1} rows).` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="card-surface p-6">
      <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
      <p className="mt-2 text-sm text-slate-500">Download live data as CSV files you can open in Excel or Google Sheets.</p>
      {message.text && <p className={`mt-3 text-sm ${message.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{message.text}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <div key={report.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-5">
            <div><h2 className="font-bold text-slate-900">{report.title}</h2><p className="mt-1 text-sm text-slate-500">{report.description}</p></div>
            <button type="button" onClick={() => run(report)} disabled={Boolean(busy)} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><Download size={15} />{busy === report.id ? 'Preparing…' : 'CSV'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
