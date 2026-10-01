import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { authService } from '../../services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('The two passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await authService.resetPassword({ token, password: form.password })
      navigate('/login', { replace: true, state: { message: 'Password updated. Sign in with your new password.' } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Set a new password</h1>
        {!token ? (
          <p className="mt-4 text-sm text-slate-600">
            This page needs the link from your reset email. <Link to="/forgot-password" className="font-semibold text-blue-700">Request a new link</Link>.
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input id="newPassword" label="New password" type="password" placeholder="••••••••" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <Input id="confirmPassword" label="Confirm password" type="password" placeholder="••••••••" minLength="8" required value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} />
            {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Updating…' : 'Update password'}</Button>
          </form>
        )}
        <div className="mt-6 text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-blue-700">Return to login</Link>
        </div>
      </div>
    </div>
  )
}
