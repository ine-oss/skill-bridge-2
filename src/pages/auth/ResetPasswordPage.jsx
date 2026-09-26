import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Set a new password</h1>
        <div className="mt-6 space-y-4">
          <Input id="newPassword" label="New password" type="password" placeholder="••••••••" />
          <Input id="confirmPassword" label="Confirm password" type="password" placeholder="••••••••" />
          <Button className="w-full">Update password</Button>
        </div>
        <div className="mt-6 text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-blue-700">Return to login</Link>
        </div>
      </div>
    </div>
  )
}
