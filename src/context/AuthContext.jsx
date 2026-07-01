import { createContext, useCallback, useContext, useState } from 'react'
import { tokenStore } from '../services/tokenStore'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser())
  const [isAuthenticated, setIsAuthenticated] = useState(() => tokenStore.isLoggedIn())

  const login = useCallback((data) => {
    if (data?.token) tokenStore.set(data.token, data)
    setUser(tokenStore.getUser())
    setIsAuthenticated(tokenStore.isLoggedIn())
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthCtx.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
