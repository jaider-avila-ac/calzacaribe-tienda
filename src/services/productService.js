import data from '../data/products.json'
import { getTotalProductStock } from './stockService'

// ─── Reemplazar el cuerpo de cada función por fetch('/api/...') cuando haya backend ───

function available(p) {
  return p.activo && getTotalProductStock(p.id) > 0
}

export function getProducts() {
  return data.filter(available)
}

export function getProductById(id) {
  return data.find((p) => p.id === Number(id)) ?? null
}

export function getProductsByCategory(categoriaId, limit) {
  const result = data.filter((p) => available(p) && p.categoriaId === Number(categoriaId))
  return limit ? result.slice(0, limit) : result
}

export function searchProducts(query = '') {
  const q = query.toLowerCase().trim()
  if (!q) return getProducts()
  return data.filter(
    (p) =>
      available(p) &&
      (p.nombre.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.subcategoria.toLowerCase().includes(q))
  )
}

export function getRelatedProducts(productId, categoriaId, limit = 4) {
  return data
    .filter((p) => available(p) && p.id !== Number(productId) && p.categoriaId === Number(categoriaId))
    .slice(0, limit)
}
