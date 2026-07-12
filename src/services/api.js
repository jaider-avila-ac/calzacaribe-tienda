import { tokenStore } from './tokenStore'

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/public`
const TND  = '1'

// Se lanza cuando el fetch nunca llegó a obtener respuesta (backend caído, sin red, timeout) —
// a diferencia de un Error normal, que significa que el servidor SÍ respondió (con un status de error).
export class BackendOfflineError extends Error {
  constructor() {
    super('No se pudo conectar con el servidor')
    this.offline = true
  }
}

// Notifica a toda la app cuando el backend deja de responder o vuelve a estar disponible,
// para que las páginas puedan dejar de mostrar datos cacheados como si fueran en vivo.
function markOffline() {
  window.dispatchEvent(new Event('backend:offline'))
}
function markOnline() {
  window.dispatchEvent(new Event('backend:online'))
}

async function doFetch(url, options) {
  try {
    const res = await fetch(url, options)
    markOnline() // si respondió (aunque sea con un status de error), el backend está vivo
    return res
  } catch {
    markOffline()
    throw new BackendOfflineError()
  }
}

export async function fetchPublic(path) {
  const res = await doFetch(`${BASE}${path}`, {
    headers: { 'X-Tenant-Id': TND },
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function fetchAuth(path, options = {}) {
  const token = tokenStore.getToken()
  const res = await doFetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': TND,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401 && token) {
    // Token inválido o vencido: cerramos la sesión para que la UI vuelva al estado no-logueado
    // en vez de quedar mostrando errores 401 silenciosos en cada llamada autenticada.
    tokenStore.clear()
    window.dispatchEvent(new Event('auth:expired'))
  }
  if (!res.ok) throw new Error(`Error ${res.status}`)
  if (res.status === 204) return null
  return res.json().catch(() => null)
}
