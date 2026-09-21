const KEY = 'cookie_consent'

// null = todavía no respondió el banner. 'accepted' | 'rejected' = ya eligió (se recuerda para
// no volver a preguntar) — guardar esta sola decisión no necesita permiso: es lo mínimo
// indispensable para que el banner no reaparezca en cada visita.
export function getConsent() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    // Silencioso
  }
}
