import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="card-surface max-w-lg p-8 text-center">
        <div className="text-5xl font-black text-amber-600">403</div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Access denied</h1>
        <p className="mt-3 text-slate-600">You do not have access to this area of the platform.</p>
        <Link to="/login" className="mt-6 inline-block"><Button>Go to login</Button></Link>
      </div>
    </div>
  )
}
