import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="card-surface max-w-lg p-8 text-center">
        <div className="text-5xl font-black text-red-600">Oops</div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-slate-600">We could not complete your request. Please try again.</p>
        <Link to="/" className="mt-6 inline-block"><Button>Go home</Button></Link>
      </div>
    </div>
  )
}
