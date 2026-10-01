import { AlertCircle, Loader2 } from 'lucide-react'

/**
 * Shows a spinner while loading, an error with a retry button, or an empty message.
 * Renders children once data is ready.
 */
export default function AsyncState({ loading, error, empty = false, emptyTitle = 'Nothing here yet', emptyText, onRetry, children }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500" role="status">
        <Loader2 size={18} className="animate-spin" /> Loading…
      </div>
    )
  }
  if (error) {
    return (
      <div className="card-surface flex flex-col items-center gap-3 p-8 text-center" role="alert">
        <AlertCircle size={22} className="text-red-600" />
        <p className="text-sm font-semibold text-slate-800">{error.message || 'Something went wrong'}</p>
        {onRetry && <button type="button" onClick={onRetry} className="text-sm font-semibold text-blue-700 hover:text-blue-800">Try again</button>}
      </div>
    )
  }
  if (empty) {
    return (
      <div className="card-surface p-10 text-center">
        <p className="font-semibold text-slate-800">{emptyTitle}</p>
        {emptyText && <p className="mt-1 text-sm text-slate-500">{emptyText}</p>}
      </div>
    )
  }
  return children
}
