import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../context/AuthContext'

export default function CreateJobSeekerAccountPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', location: '', email: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    const account = { ...form, role: 'jobseeker', profileVerified: false }
    const accounts = JSON.parse(localStorage.getItem('skillbridge-accounts') || '[]').filter((item) => item.email !== form.email)
    localStorage.setItem('skillbridge-accounts', JSON.stringify([...accounts, { ...account }]))
    register(account)
    navigate('/jobseeker/profile', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Create job seeker account</h1>
        <p className="mt-2 text-slate-600">Set up your profile and start building evidence.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input id="fullName" label="Full name" placeholder="Aisha Okafor" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input id="location" label="Location" placeholder="Lagos, Nigeria" required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          <Input id="email" label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input id="password" label="Password" type="password" placeholder="••••••••" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button type="submit" className="w-full">Create account</Button>
        </form>
      </div>
    </div>
  )
}
