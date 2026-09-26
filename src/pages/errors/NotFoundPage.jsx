import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="card-surface max-w-lg p-8 text-center">
        <div className="text-6xl font-black text-blue-600">404</div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested does not exist or has moved.</p>
        <Link to="/" className="mt-6 inline-block"><Button>Back home</Button></Link>
      </div>
    </div>
  )
}
