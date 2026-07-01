import { fetchPublic } from './api'

// Adapta la respuesta de la API pública al formato que espera la tienda
function adaptProduct(p) {
  return {
    id:             p.id,
    nombre:         p.nombre,
    slug:           p.slug,
    descripcion:    p.descripcion,
    precio:         p.precio,          // precio base (tachado cuando hay descuento)
    descuento:      p.descuento ?? 0,  // %
    marca:          p.marca,
    genero:         p.genero,
    categoriaId:    p.categoria_id,
    categoriaNombre: p.categoria_nombre,
    subcategoria:   p.subcategoria,
    etiquetas:      p.etiquetas ?? [],
    activo:         p.activo,
    // imagenes viene como [{url, var_id}] desde el backend
    imagenes:       (p.imagenes ?? []).map((img) =>
      typeof img === 'string' ? { url: img, varId: null } : { url: img.url, varId: img.var_id ?? null }
    ),
    tallas:         p.tallas ?? [],
    variantes:      (p.variantes ?? []).map((v) => ({
      nombre:    v.nombre,
      tipo:      v.tipo,
      requerido: v.requerido,
      opciones:  (v.opciones ?? []).map((o) => ({
        valor:      o.valor,
        stock:      o.stock,
        hex:        o.hex ?? null,
        precioExtra: 0,
        varId:      o.var_id ?? null,  // permite cambiar imagen al seleccionar color
      })),
    })),
    stockVariantes: (p.stock_variantes ?? []).map((v) => ({
      id:    v.id,
      talla: v.talla ?? '',
      color: v.color ?? '',
      stock: v.stock ?? 0,
    })),
    caracteristicas: p.caracteristicas ?? {},
  }
}

// Caché por sesión para el listado completo
let _cache = null
let _promise = null

async function loadAll() {
  if (_cache) return _cache
  if (!_promise) _promise = fetchPublic('/productos').then((data) => {
    _cache = Array.isArray(data) ? data.map(adaptProduct) : []
    return _cache
  })
  return _promise
}

export async function getProducts() {
  return loadAll()
}

export async function getProductById(id) {
  const data = await fetchPublic(`/productos/${id}`)
  return adaptProduct(data)
}

export async function getProductsByCategory(categoriaId, limit) {
  const list = await loadAll()
  const result = list.filter((p) => p.activo && p.categoriaId === Number(categoriaId))
  return limit ? result.slice(0, limit) : result
}

export async function searchProducts(query = '') {
  const q = query.toLowerCase().trim()
  if (!q) return getProducts()
  const list = await loadAll()
  return list.filter(
    (p) =>
      p.activo && (
        p.nombre.toLowerCase().includes(q)         ||
        p.marca.toLowerCase().includes(q)          ||
        (p.subcategoria ?? '').toLowerCase().includes(q) ||
        (p.descripcion ?? '').toLowerCase().includes(q)
      )
  )
}

export async function getRelatedProducts(productId, categoriaId, limit = 4) {
  const list = await loadAll()
  return list
    .filter((p) => p.activo && p.id !== Number(productId) && p.categoriaId === Number(categoriaId))
    .slice(0, limit)
}

// Invalida el caché (útil para forzar recarga)
export function clearCache() {
  _cache = null
  _promise = null
}
