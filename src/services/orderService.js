// ─── Reemplazar localStorage por fetch('/api/orders') cuando haya backend ───

import { deductStock } from './stockService'

const KEY = 'calzacaribe_orders'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

function save(orders) {
  localStorage.setItem(KEY, JSON.stringify(orders))
}

export function getOrders() {
  return load()
}

export function createOrder({ items, subtotal, envio, total, direccion }) {
  deductStock(items)
  const order = {
    id:       'ORD-' + Date.now().toString(36).toUpperCase().slice(-6),
    fecha:    new Date().toISOString(),
    estado:   'pagado',
    items,
    subtotal,
    envio,
    total,
    direccion: direccion ?? null,
  }
  const orders = [order, ...load()]
  save(orders)
  return order
}
