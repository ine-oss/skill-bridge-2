import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-2 text-slate-600">Enter your email to receive a reset link.</p>
        <div className="mt-6">
          <Input id="email" label="Email address" type="email" placeholder="you@example.com" />
          <Button className="mt-5 w-full">Send reset link</Button>
        </div>
        <div className="mt-6 text-sm text-slate-600">
          Back to <Link to="/login" className="font-semibold text-blue-700">login</Link>
        </div>
      </div>
    </div>
  )
}
