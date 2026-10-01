import { useState } from 'react'
import { Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { formatDate, label } from '../../lib/format'
import { trainingService } from '../../services/trainingService'

export default function JobSeekerTrainingPage() {
  const { data, loading, error, reload, setData } = useApi(() => trainingService.getEnrollments(), [])
  const [message, setMessage] = useState('')
  const enrollments = data?.data || []

  const saveProgress = async (id, progress) => {
    try {
      const { enrollment } = await trainingService.updateEnrollment(id, { progress })
      setData((current) => ({ data: current.data.map((item) => item.id === id ? { ...item, ...enrollment } : item) }))
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Training</h1>
          <Link to="/training" className="text-sm font-semibold text-blue-700">Browse programs</Link>
        </div>
        {message && <p className="mt-3 text-sm text-red-700" role="alert">{message}</p>}
        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={enrollments.length === 0} emptyTitle="No training yet" emptyText="Enroll in a program to start closing your skill gaps.">
            <div className="grid gap-4 md:grid-cols-2">
              {enrollments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/training/${item.program.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-700">{item.program.title}</Link>
                      <div className="mt-1 text-sm text-slate-600">{item.program.provider} · Enrolled {formatDate(item.enrolledAt)}</div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{label(item.status)}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <label className="sr-only" htmlFor={`progress-${item.id}`}>Progress for {item.program.title}</label>
                    <input id={`progress-${item.id}`} type="range" min="0" max="99" defaultValue={Math.min(item.progress, 99)} disabled={item.status === 'COMPLETED'} onMouseUp={(event) => saveProgress(item.id, Number(event.currentTarget.value))} onKeyUp={(event) => saveProgress(item.id, Number(event.currentTarget.value))} onTouchEnd={(event) => saveProgress(item.id, Number(event.currentTarget.value))} className="flex-1 accent-blue-600" />
                    <span className="w-10 text-right text-sm font-semibold text-slate-600">{item.progress}%</span>
                  </div>
                  {item.status !== 'COMPLETED' && <p className="mt-2 text-xs text-slate-400">Your provider confirms completion.</p>}
                  {item.certificate && <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700"><Award size={15} /> Certificate {item.certificate.code}</div>}
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
