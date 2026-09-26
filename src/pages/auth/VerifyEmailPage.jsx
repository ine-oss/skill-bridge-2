import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Email verified</h1>
        <p className="mt-3 text-slate-600">Your account has been verified successfully. You can now continue to your dashboard.</p>
        <Link to="/login" className="mt-6 inline-block"><Button>Continue to login</Button></Link>
      </div>
    </div>
  )
}
