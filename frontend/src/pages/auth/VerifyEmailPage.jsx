import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import { authService } from '../../services/authService'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState(token ? 'verifying' : 'missing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    let active = true
    authService
      .verifyEmail(token)
      .then(() => active && setState('verified'))
      .catch((err) => {
        if (!active) return
        setMessage(err.message)
        setState('failed')
      })
    return () => {
      active = false
    }
  }, [token])

  const content = {
    verifying: { icon: '…', tone: 'bg-slate-100 text-slate-600', title: 'Verifying your email', text: 'One moment please.' },
    verified: { icon: '✓', tone: 'bg-emerald-100 text-emerald-700', title: 'Email verified', text: 'Your account has been verified successfully. You can now continue to your dashboard.' },
    failed: { icon: '!', tone: 'bg-red-100 text-red-700', title: 'Verification failed', text: message },
    missing: { icon: '@', tone: 'bg-blue-100 text-blue-700', title: 'Check your inbox', text: 'Open the verification link we sent to your email address to confirm your account.' },
  }[state]

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${content.tone}`}>{content.icon}</div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">{content.title}</h1>
        <p className="mt-3 text-slate-600">{content.text}</p>
        <Link to="/login" className="mt-6 inline-block"><Button>Continue to login</Button></Link>
      </div>
    </div>
  )
}
