/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('skillbridge-session') || 'null') || {
    name: '', email: '', role: 'public', isAuthenticated: false, profileVerified: false,
  })

  const persistUser = (nextUser) => {
    setUser(nextUser)
    localStorage.setItem('skillbridge-session', JSON.stringify(nextUser))
  }

  const value = useMemo(
    () => ({
      user,
      login: (nextUser) => persistUser({ ...nextUser, isAuthenticated: true }),
      register: (nextUser) => persistUser({ ...nextUser, isAuthenticated: true, profileVerified: false }),
        updateUser: (changes) => persistUser({ ...user, ...changes }),
      logout: () => {
        const loggedOutUser = {
          name: '',
          email: '',
          role: 'public',
          isAuthenticated: false,
          profileVerified: false,
        }
        persistUser(loggedOutUser)
      },
    }),
    [user],
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
