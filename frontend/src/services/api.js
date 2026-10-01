export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
// Origin of the backend ('' when the API is served through the Vite proxy at /api)
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '')

const TOKEN_KEY = 'skillbridge-token'

export const tokenStorage = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set: (token) => {
    try { localStorage.setItem(TOKEN_KEY, token) } catch { /* storage unavailable */ }
  },
  clear: () => {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ }
  },
}

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

/** Builds "?a=1&b=2" from an object, skipping empty values. */
export function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

export async function apiRequest(endpoint, options = {}) {
  const token = tokenStorage.get()
  let response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        // FormData (file uploads) sets its own multipart Content-Type
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the Skill Bridge server. Check that the backend is running.')
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const firstDetail = Array.isArray(data?.details) ? data.details[0]?.message : null
    throw new ApiError(response.status, firstDetail || data?.error || `Request failed (${response.status})`, data?.details)
  }
  return data
}

export const api = {
  get: (endpoint, params) => apiRequest(`${endpoint}${toQuery(params)}`),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}

/** Full URL for a path the API returned, e.g. "/api/files/abc" → "https://api.example.com/api/files/abc". */
export const apiUrl = (path) => (!path || /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`)
