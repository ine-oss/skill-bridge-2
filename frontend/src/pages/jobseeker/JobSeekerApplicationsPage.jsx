import { useState } from 'react'
import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { applicationService } from '../../services/applicationService'

const statusTone = {
  NEW: 'bg-blue-100 text-blue-700', REVIEWING: 'bg-amber-100 text-amber-700', SHORTLISTED: 'bg-emerald-100 text-emerald-700',
  INTERVIEW: 'bg-violet-100 text-violet-700', OFFERED: 'bg-emerald-100 text-emerald-800', HIRED: 'bg-emerald-600 text-white',
  REJECTED: 'bg-red-100 text-red-700', WITHDRAWN: 'bg-slate-100 text-slate-600',
}

export default function JobSeekerApplicationsPage() {
  const { data, loading, error, reload, setData } = useApi(() => applicationService.getApplications({ limit: 100 }), [])
  const [message, setMessage] = useState('')
  const applications = data?.data || []

  const withdraw = async (id) => {
    try {
      const { application } = await applicationService.withdraw(id)
      setData((current) => ({ ...current, data: current.data.map((item) => item.id === id ? application : item) }))
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
        {message && <p className="mt-3 text-sm text-red-700" role="alert">{message}</p>}
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={applications.length === 0} emptyTitle="No applications yet" emptyText="Find a job that matches your skills and apply.">
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <Link to={`/jobs/${application.job.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-700">{application.job.title}</Link>
                      <div className="text-sm text-slate-600">{application.job.company?.name} · Applied {formatDate(application.createdAt)}</div>
                    </div>
                    <div className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[application.status] || 'bg-slate-100 text-slate-600'}`}>{label(application.status)}</div>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">Skill match: {application.match}%</div>
                  {application.timeline?.length > 0 && (
                    <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      {application.timeline.map((step, index) => (
                        <li key={`${step.status}-${index}`}><span className="font-semibold text-slate-700">{label(step.status)}</span> · {formatDate(step.date)}{step.note ? ` — ${step.note}` : ''}</li>
                      ))}
                    </ol>
                  )}
                  {!['WITHDRAWN', 'REJECTED', 'HIRED'].includes(application.status) && (
                    <button type="button" onClick={() => withdraw(application.id)} className="mt-4 text-sm font-semibold text-slate-500 hover:text-red-700">Withdraw application</button>
                  )}
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
