import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../context/AuthContext'

export default function CreateTrainingAccountPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', pointOfContact: '', email: '', password: '' })
  const handleSubmit = (event) => {
    event.preventDefault()
    const account = { ...form, role: 'training', profileVerified: false }
    const accounts = JSON.parse(localStorage.getItem('skillbridge-accounts') || '[]').filter((item) => item.email !== form.email)
    localStorage.setItem('skillbridge-accounts', JSON.stringify([...accounts, account]))
    register(account)
    navigate('/training/profile', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Create training provider account</h1>
        <p className="mt-2 text-slate-600">Manage learning programs and learner outcomes.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input id="organizationName" label="Organization name" placeholder="Code Academy Africa" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input id="pointOfContact" label="Primary contact" placeholder="Ada Okafor" required value={form.pointOfContact} onChange={(event) => setForm({ ...form, pointOfContact: event.target.value })} />
          <Input id="email" label="Organization email" type="email" placeholder="hello@codeafrica.org" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input id="password" label="Password" type="password" placeholder="••••••••" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button type="submit" className="w-full">Create training account</Button>
        </form>
      </div>
    </div>
  )
}
