import { createContext, useContext, useState, useCallback } from 'react'

const AuthCtx = createContext(null)

// TODO (backend): reemplazar por verificación real de token/cookie de sesión.
// Por ahora la sesión vive solo en memoria: recargar la página cierra la sesión.
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login  = useCallback(() => setIsAuthenticated(true),  [])
  const logout = useCallback(() => setIsAuthenticated(false), [])

  return (
    <AuthCtx.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
