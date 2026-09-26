import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-slate-600">Choose your role and get started.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/create-jobseeker" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center hover:border-blue-200 hover:bg-blue-50">
            <div className="font-semibold text-slate-900">Job Seeker</div>
          </Link>
          <Link to="/create-employer" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center hover:border-blue-200 hover:bg-blue-50">
            <div className="font-semibold text-slate-900">Employer</div>
          </Link>
          <Link to="/create-training-provider" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center hover:border-blue-200 hover:bg-blue-50">
            <div className="font-semibold text-slate-900">Training</div>
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          <Input id="fullName" label="Full name" placeholder="Your full name" />
          <Input id="email" label="Email address" type="email" placeholder="you@example.com" />
          <Input id="password" label="Password" type="password" placeholder="Create a password" />
          <Button className="w-full">Continue</Button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have account? <Link to="/login" className="font-semibold text-blue-700">Login</Link>
        </div>
      </div>
    </div>
  )
}
