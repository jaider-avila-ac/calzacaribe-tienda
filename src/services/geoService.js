import { fetchPublic } from './api'

// Catálogo de departamentos/municipios de Colombia (DANE/DIVIPOLA) — antes vivía como un
// archivo estático acá mismo (colombiaGeo.js), ahora es el backend quien lo sirve
// (GET /api/v1/public/geo/colombia) para que sea una sola fuente de verdad reusable por
// cualquier frontend (tienda, admin, futuras tiendas del multi-tenant) y el backend pueda
// validar contra el mismo catálogo.

// Caché de módulo: una sola petición en toda la sesión (el catálogo no cambia en caliente)
let _cache = null
let _promise = null

async function loadColombiaGeo() {
  if (_cache) return _cache
  if (!_promise) _promise = fetchPublic('/geo/colombia').then((data) => {
    _cache = data && typeof data === 'object' ? data : {}
    return _cache
  })
  return _promise
}

export async function getColombiaGeo() {
  return loadColombiaGeo()
}

export async function getDepartamentos() {
  const geo = await loadColombiaGeo()
  return Object.keys(geo)
}

export async function getMunicipios(departamento) {
  const geo = await loadColombiaGeo()
  return geo[departamento] ?? []
}
