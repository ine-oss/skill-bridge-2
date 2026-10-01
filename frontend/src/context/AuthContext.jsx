/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { tokenStorage } from '../services/api'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const SESSION_KEY = 'skillbridge-session'

const guestUser = {
  name: '',
  email: '',
  role: 'public',
  isAuthenticated: false,
  profileVerified: false,
}

function readSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    // A cached session is only valid while we also hold its API token.
    return stored && tokenStorage.get() ? stored : guestUser
  } catch {
    return guestUser
  }
}

// Keep the shape the pages already rely on (name, email, role, isAuthenticated, profileVerified…).
function toSessionUser(apiUser) {
  return {
    ...apiUser,
    isAuthenticated: true,
    verificationStatus: apiUser.verificationStatus?.toLowerCase(),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser)
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    } catch {
      /* storage unavailable */
    }
  }, [])

  const startSession = useCallback((token, apiUser) => {
    tokenStorage.set(token)
    const sessionUser = toSessionUser(apiUser)
    persistUser(sessionUser)
    return sessionUser
  }, [persistUser])

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    persistUser(guestUser)
  }, [persistUser])

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.get()) return null
    try {
      const { user: apiUser } = await authService.me()
      const sessionUser = toSessionUser(apiUser)
      persistUser(sessionUser)
      return sessionUser
    } catch (error) {
      if (error.status === 401) clearSession()
      return null
    }
  }, [persistUser, clearSession])

  // Re-validate the stored token once when the app loads.
  useEffect(() => {
    if (!tokenStorage.get()) return
    let active = true
    authService
      .me()
      .then(({ user: apiUser }) => active && persistUser(toSessionUser(apiUser)))
      .catch((error) => active && error.status === 401 && clearSession())
    return () => {
      active = false
    }
  }, [persistUser, clearSession])

  const value = useMemo(
    () => ({
      user,
      /** Signs in with { email, password }. Resolves to the user; throws ApiError on failure. */
      login: async (credentials) => {
        const { token, user: apiUser } = await authService.login(credentials)
        return startSession(token, apiUser)
      },
      /** Creates an account. payload: { role, name, email, password, ...role-specific fields } */
      register: async (payload) => {
        const { token, user: apiUser } = await authService.register(payload)
        return startSession(token, apiUser)
      },
      logout: async () => {
        try {
          await authService.logout()
        } catch {
          /* signing out locally is enough */
        }
        clearSession()
      },
      refreshUser,
      /** Merges changes into the local session (use after an API call that changed the user). */
      updateUser: (changes) => persistUser({ ...user, ...changes }),
    }),
    [user, startSession, clearSession, refreshUser, persistUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
