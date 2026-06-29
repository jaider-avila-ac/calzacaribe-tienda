// ── Stock en vivo ──────────────────────────────────────────────────────────────
// Inicializa desde products.json en el primer uso y persiste en localStorage.
// Al conectar el backend: reemplazar initStock/deductStock por llamadas a la API.

import productsData from '../data/products.json'

const KEY = 'calzacaribe_stock'

// Determina qué variante controla el stock para un producto dado.
// Prioridad: talla > color con stock por opción > nivel de producto.
function stockVarianteOf(product) {
  if (!product) return null
  return (
    product.variantes?.find((v) => v.tipo === 'talla') ??
    product.variantes?.find((v) => v.tipo === 'color' && v.opciones[0]?.stock !== undefined) ??
    null
  )
}

// Clave única para una combinación producto+variante seleccionada.
// Retorna null si la variante que controla el stock aún no fue seleccionada.
function buildKey(productId, variantes) {
  const product = productsData.find((p) => p.id === Number(productId))
  const sv = stockVarianteOf(product)
  if (sv) {
    const val = variantes?.[sv.nombre]
    return val ? `${productId}-${sv.nombre}-${val}` : null
  }
  return `${productId}-product`
}

// Inicializa el mapa de stock en localStorage a partir del JSON.
function initStock() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) return JSON.parse(saved)
  } catch {}

  const map = {}
  productsData.forEach((p) => {
    const sv = stockVarianteOf(p)
    if (sv) {
      sv.opciones.forEach((o) => {
        map[`${p.id}-${sv.nombre}-${o.valor}`] = o.stock ?? 0
      })
    } else {
      map[`${p.id}-product`] = p.stock ?? 0
    }
  })
  localStorage.setItem(KEY, JSON.stringify(map))
  return map
}

// ── API pública ──────────────────────────────────────────────────────────────

/** Stock disponible para un producto con las variantes dadas.
 *  Retorna null si la variante que controla el stock no está seleccionada aún. */
export function getStock(productId, variantes) {
  const map = initStock()
  const key = buildKey(productId, variantes)
  if (key === null) return null
  return map[key] ?? 0
}

/** Stock total de un producto (suma de todas sus opciones). */
export function getTotalProductStock(productId) {
  const map  = initStock()
  const pre  = `${productId}-`
  return Object.entries(map)
    .filter(([k]) => k.startsWith(pre))
    .reduce((s, [, v]) => s + v, 0)
}

/** Descuenta el stock de cada ítem del pedido. Se llama al confirmar compra. */
export function deductStock(items) {
  const map = initStock()
  items.forEach((item) => {
    const key = buildKey(item.productId, item.variantes)
    if (key) map[key] = Math.max(0, (map[key] ?? 0) - item.cantidad)
  })
  localStorage.setItem(KEY, JSON.stringify(map))
}
