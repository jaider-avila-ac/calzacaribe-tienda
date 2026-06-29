// ─── Reemplazar localStorage por fetch('/api/profile') cuando haya backend ───

const KEY = 'calzacaribe_profile'

const DEFAULTS = {
  nombre:          '',
  apellido:        '',
  email:           '',
  telefono:        '',
  tipoDocumento:   'CC',
  numeroDocumento: '',
  direcciones:     [],   // [{ id, direccion, complemento, departamento, municipio, barrio, apartamento, contactoNombre, contactoTelefono }]
}

export function getProfile() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveProfile(data) {
  const updated = { ...getProfile(), ...data }
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

// ── Direcciones ──────────────────────────────────────────

export function getDirecciones() {
  return getProfile().direcciones ?? []
}

export function addDireccion(data) {
  const profile = getProfile()
  const nueva = { ...data, id: 'addr-' + Date.now().toString(36) }
  const direcciones = [...(profile.direcciones ?? []), nueva]
  return saveProfile({ direcciones }).direcciones
}

export function updateDireccion(id, data) {
  const profile = getProfile()
  const direcciones = (profile.direcciones ?? []).map((d) =>
    d.id === id ? { ...d, ...data } : d
  )
  return saveProfile({ direcciones }).direcciones
}

export function deleteDireccion(id) {
  const profile = getProfile()
  const direcciones = (profile.direcciones ?? []).filter((d) => d.id !== id)
  return saveProfile({ direcciones }).direcciones
}
