import { fetchPublic } from './api'

function adapt(c) {
  return {
    id:          c.id,
    nombre:      c.nombre,
    slug:        c.slug,
    descripcion: c.descripcion,
    activo:      c.activo,
    orden:       c.orden,
    productoIds: c.producto_ids ?? [],
    imagenUrl:   c.imagen_url ?? null,
  }
}

export async function getColecciones() {
  const data = await fetchPublic('/colecciones')
  return Array.isArray(data) ? data.map(adapt) : []
}

export async function getColeccionById(id) {
  const data = await fetchPublic(`/colecciones/${id}`)
  return adapt(data)
}
