import categoriesData from '../data/categories.json'
import productsData   from '../data/products.json'

// ─── Reemplazar el cuerpo de cada función por fetch('/api/...') cuando haya backend ───

export function getCategories() {
  return categoriesData
}

export function getCategoryById(id) {
  return categoriesData.find((c) => c.id === Number(id)) ?? null
}

/**
 * Devuelve solo las categorías que tienen al menos un producto activo,
 * y dentro de cada categoría solo las subcategorías con productos activos.
 * Si el backend existe, reemplazar por: fetch('/api/categories/active')
 */
export function getActiveCategories() {
  return categoriesData
    .map((cat) => {
      const catProds = productsData.filter(
        (p) => p.activo && p.categoriaId === cat.id
      )
      if (catProds.length === 0) return null

      const activeSubs = cat.subcategorias.filter((sub) =>
        catProds.some((p) => p.subcategoria === sub)
      )

      return { ...cat, subcategorias: activeSubs }
    })
    .filter(Boolean)
}
