import { fetchAuth } from './api'

function normalizeItem(row) {
  const variantes = {}
  if (row.talla) variantes.Talla = row.talla
  if (row.color) variantes.Color = row.color

  return {
    key: String(row.id),
    itemId: row.id,
    productId: row.producto_id,
    nombre: row.nombre,
    slug: row.slug,
    precio: row.precio,
    imagen: row.imagen ?? '',
    marca: row.marca,
    talla: row.talla,
    color: row.color,
    variantes,
    cantidad: row.cantidad,
    productoActivo: row.producto_activo,
    stockDisponible: row.stock_disponible ?? 0,
  }
}

function normalizeCarrito(data) {
  const items = Array.isArray(data?.items) ? data.items.map(normalizeItem) : []
  return { items, count: data?.count ?? 0, total: data?.total ?? 0 }
}

export async function getCarrito() {
  return normalizeCarrito(await fetchAuth('/carrito'))
}

export async function addItem({ productId, talla, color, cantidad = 1 }) {
  return normalizeCarrito(await fetchAuth('/carrito/items', {
    method: 'POST',
    body: JSON.stringify({ prd_id: productId, talla: talla ?? null, color: color ?? null, cantidad }),
  }))
}

export async function updateItem(itemId, cantidad) {
  return normalizeCarrito(await fetchAuth(`/carrito/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ cantidad }),
  }))
}

export async function removeItem(itemId) {
  return normalizeCarrito(await fetchAuth(`/carrito/items/${itemId}`, { method: 'DELETE' }))
}

export async function clearCarrito() {
  return normalizeCarrito(await fetchAuth('/carrito', { method: 'DELETE' }))
}
