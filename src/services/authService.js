import { tokenStore } from './tokenStore'

const BASE  = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/public/auth/tienda`
const TND   = '1'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Tenant-Id': TND },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.message ?? 'Error'), { status: res.status, data })
  return data
}

// El logout necesita el Bearer del propio token que se está cerrando para poder
// invalidarlo en el backend (ver JwtService.invalidate) — post() no lo agrega.
async function logout() {
  const token = tokenStore.getToken()
  if (!token) return
  await fetch(`${BASE}/logout`, {
    method: 'POST',
    headers: { 'X-Tenant-Id': TND, Authorization: `Bearer ${token}` },
  }).catch(() => {})
}

export const authService = {
  register:       (email, password, nombre, apellido, numeroDocumento) =>
    post('/register', {
      email, password, nombre, apellido,
      tipo_documento: numeroDocumento ? 'CC' : undefined,
      numero_documento: numeroDocumento || undefined,
    }),

  verify:         (email, code) =>
    post('/verify', { email, code }),

  resendCode:     (email) =>
    post('/resend-code', { email }),

  login:          (email, password) =>
    post('/login', { email, password }),

  googleLogin:    (idToken) =>
    post('/google', { id_token: idToken }),

  forgotPassword: (email) =>
    post('/forgot-password', { email }),

  resetPassword:  (code, newPassword) =>
    post('/reset-password', { code, new_password: newPassword }),

  logout,
}
