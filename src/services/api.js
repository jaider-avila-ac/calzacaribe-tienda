import { tokenStore } from './tokenStore'

const BASE = 'http://localhost:8080/api/v1/public'
const TND  = '1'

export async function fetchPublic(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Tenant-Id': TND },
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function fetchAuth(path, options = {}) {
  const token = tokenStore.getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': TND,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  if (res.status === 204) return null
  return res.json().catch(() => null)
}
