import { useState } from 'react'
import { FileText } from 'lucide-react'
import { isUploadedFile, openFile } from '../../services/fileService'

/** Link to an uploaded file (opened with the login token) or to an ordinary web address. */
export default function FileLink({ url, children = 'Open file', className = 'inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800' }) {
  const [error, setError] = useState('')
  if (!url) return null
  if (!isUploadedFile(url)) {
    return <a href={url} target="_blank" rel="noreferrer" className={className}>{children}</a>
  }
  return (
    <span className="inline-flex flex-col">
      <button type="button" onClick={() => openFile(url).catch((err) => setError(err.message))} className={className}><FileText size={15} />{children}</button>
      {error && <span className="text-xs text-red-700" role="alert">{error}</span>}
    </span>
  )
}
