import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { tokenStore } from '../services/tokenStore'
import { authService } from '../services/authService'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser())
  const [isAuthenticated, setIsAuthenticated] = useState(() => tokenStore.isLoggedIn())

  const login = useCallback((data) => {
    if (data?.token) tokenStore.set(data.token, data)
    setUser(tokenStore.getUser())
    setIsAuthenticated(tokenStore.isLoggedIn())
  }, [])

  const logout = useCallback(async () => {
    // Invalida el token en el backend (best-effort) antes de borrarlo localmente —
    // si no, seguiría siendo válido hasta su vencimiento aunque alguien más lo tuviera.
    await authService.logout()
    tokenStore.clear()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  // El token pudo vencer/invalidarse entre requests (ver fetchAuth en services/api.js);
  // cuando eso pasa cerramos sesión en vez de dejar la UI mostrando 401 repetidos.
  useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])

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
