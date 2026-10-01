import { apiRequest, apiUrl, tokenStorage, ApiError } from './api'

export const MAX_UPLOAD_MB = 4

export const fileService = {
  /** Uploads a File. purpose: CV | EVIDENCE | VERIFICATION | LOGO | AVATAR. Resolves to { id, url, filename, ... }. */
  upload: async (file, purpose) => {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new ApiError(400, `Files must be smaller than ${MAX_UPLOAD_MB} MB`)
    const body = new FormData()
    body.append('purpose', purpose)
    body.append('file', file)
    const { file: saved } = await apiRequest('/uploads', { method: 'POST', body })
    return saved
  },
  remove: (url) => apiRequest(url.replace(/^.*\/api/, ''), { method: 'DELETE' }),
}

export const isUploadedFile = (url) => /\/api\/files\/[a-z0-9]+$/i.test(url || '')

/**
 * Opens a private uploaded file (CV, evidence, verification document) in a new tab.
 * Private files need the login token, so they're fetched first and shown from memory.
 */
export async function openFile(url, { download = false, filename } = {}) {
  if (!isUploadedFile(url)) {
    window.open(url, '_blank', 'noopener')
    return
  }
  const tab = download ? null : window.open('', '_blank')
  const token = tokenStorage.get()
  const response = await fetch(apiUrl(url), { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!response.ok) {
    tab?.close()
    throw new ApiError(response.status, response.status === 403 ? 'You do not have access to this file' : 'The file could not be opened')
  }
  const blobUrl = URL.createObjectURL(await response.blob())
  if (download || !tab) {
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename || 'file'
    link.click()
  } else {
    tab.location.href = blobUrl
  }
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
}
