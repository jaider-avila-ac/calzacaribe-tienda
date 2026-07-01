const BASE  = 'http://localhost:8080/api/v1/public/auth/tienda'
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

export const authService = {
  register:       (email, password, nombre, apellido) =>
    post('/register', { email, password, nombre, apellido }),

  verify:         (email, code) =>
    post('/verify', { email, code }),

  resendCode:     (email) =>
    post('/resend-code', { email }),

  login:          (email, password) =>
    post('/login', { email, password }),

  googleLogin:    (idToken) =>
    post('/google', { idToken }),

  forgotPassword: (email) =>
    post('/forgot-password', { email }),

  resetPassword:  (code, newPassword) =>
    post('/reset-password', { code, new_password: newPassword }),
}
