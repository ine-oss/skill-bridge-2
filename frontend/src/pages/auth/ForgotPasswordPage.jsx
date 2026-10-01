import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { authService } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '', devLink: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const result = await authService.forgotPassword(email)
      // In development the API returns the link directly because no email service is configured yet.
      const devLink = result.devResetUrl ? new URL(result.devResetUrl).pathname + new URL(result.devResetUrl).search : ''
      setStatus({ type: 'success', message: result.message, devLink })
    } catch (err) {
      setStatus({ type: 'error', message: err.message, devLink: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-2 text-slate-600">Enter your email to receive a reset link.</p>
        <form className="mt-6" onSubmit={handleSubmit}>
          <Input id="email" label="Email address" type="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
          {status.message && (
            <p className={`mt-4 text-sm font-medium ${status.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}
          {status.devLink && (
            <p className="mt-2 text-xs text-slate-500">
              Development only: <Link to={status.devLink} className="font-semibold text-blue-700">open the reset link</Link>
            </p>
          )}
          <Button type="submit" className="mt-5 w-full" disabled={submitting}>{submitting ? 'Sending…' : 'Send reset link'}</Button>
        </form>
        <div className="mt-6 text-sm text-slate-600">
          Back to <Link to="/login" className="font-semibold text-blue-700">login</Link>
        </div>
      </div>
    </div>
  )
}
