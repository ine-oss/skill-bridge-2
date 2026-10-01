import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Clock3, Award, Users } from 'lucide-react'
import Button from '../../components/common/Button'
import AsyncState from '../../components/common/AsyncState'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import { toProgramView } from '../../lib/format'
import { trainingService } from '../../services/trainingService'

export default function TrainingDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error, reload, setData } = useApi(() => trainingService.getProgramById(id), [id, user.isAuthenticated])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)
  const raw = data?.program
  const training = raw ? toProgramView(raw) : null
  const canEnroll = !user.isAuthenticated || user.role === 'jobseeker'

  const enroll = async () => {
    if (!user.isAuthenticated) {
      navigate('/login', { state: { from: `/training/${id}` } })
      return
    }
    setBusy(true)
    try {
      const { enrollment } = await trainingService.enroll(id)
      setData((current) => ({ program: { ...current.program, enrollment, learnersCount: (current.program.learnersCount || 0) + 1 } }))
      setMessage({ type: 'success', text: 'You are enrolled. Track your progress under Training in your workspace.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <AsyncState loading={loading} error={error} onRetry={reload}>
        {training && (
          <div className="card-surface p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">{training.provider}</div>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{training.title}</h1>
              </div>
              {raw.enrollment ? (
                <Button variant="success" disabled>Enrolled · {raw.enrollment.progress}%</Button>
              ) : (
                canEnroll && <Button onClick={enroll} disabled={busy}>{busy ? 'Enrolling…' : 'Enroll now'}</Button>
              )}
            </div>
            {message.text && <p className={`mt-4 text-sm font-medium ${message.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p>}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Duration</div><div className="mt-2 flex items-center gap-2 font-semibold"><Clock3 size={16} /> {training.duration}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Difficulty · Mode</div><div className="mt-2 font-semibold">{training.difficulty} · {training.mode}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Certificate</div><div className="mt-2 flex items-center gap-2 font-semibold"><Award size={16} /> {training.certificate ? 'Included' : 'Not included'}</div></div>
            </div>

            <p className="mt-6 whitespace-pre-line text-slate-600">{training.description}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-900">Skills gained</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {training.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{skill}</span>)}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-900">Learners</h3>
                <div className="mt-3 flex items-center gap-2 text-slate-600"><Users size={16} /> {training.learners.toLocaleString()} learners enrolled</div>
                {training.instructor && <p className="mt-2 text-sm text-slate-500">Instructor: {training.instructor}</p>}
              </div>
            </div>
          </div>
        )}
      </AsyncState>
    </div>
  )
}
