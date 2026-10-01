import { useRef, useState } from 'react'
import { Loader2, UploadCloud } from 'lucide-react'
import { fileService } from '../../services/fileService'

const ACCEPT = {
  CV: '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  EVIDENCE: '.pdf,image/png,image/jpeg,image/webp,image/gif',
  VERIFICATION: '.pdf,image/png,image/jpeg,image/webp,image/gif',
  LOGO: 'image/png,image/jpeg,image/webp,image/gif',
  AVATAR: 'image/png,image/jpeg,image/webp,image/gif',
}

/** Button that picks a file, uploads it, and calls onUploaded(file) with { id, url, filename, ... }. */
export default function FileUploadButton({ purpose, onUploaded, label = 'Upload file', className = 'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60' }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onUploaded?.(await fileService.upload(file, purpose))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <input ref={input} type="file" accept={ACCEPT[purpose]} onChange={handleChange} className="sr-only" tabIndex={-1} aria-hidden="true" />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className={className}>
        {busy ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}{busy ? 'Uploading…' : label}
      </button>
      {error && <span className="text-xs font-medium text-red-700" role="alert">{error}</span>}
    </span>
  )
}
