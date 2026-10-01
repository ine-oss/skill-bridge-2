import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const account = await login(form)
      const defaultPath = account.role === 'jobseeker' && !account.profileVerified ? '/jobseeker/profile' : `/${account.role}/dashboard`
      navigate(location.state?.from || defaultPath, { replace: true })
    } catch (err) {
      setError(err.message || 'We could not sign you in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white">SB</div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-600">Sign in to continue your skills journey.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input id="email" label="Email address" type="email" placeholder="you@example.com" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input id="password" label="Password" type="password" placeholder="••••••••" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" /> Remember me</label>
            <Link to="/forgot-password" className="text-blue-700">Forgot password?</Link>
          </div>
          {location.state?.message && !error && <p className="text-sm font-medium text-emerald-700" role="status">{location.state.message}</p>}
          {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Signing in…' : 'Login'}</Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Need an account? <Link to="/register" className="font-semibold text-blue-700">Create one</Link>
        </div>
      </div>
    </div>
  )
}
