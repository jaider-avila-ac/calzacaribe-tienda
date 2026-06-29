// ─── Reemplazar localStorage por fetch('/api/notifications') cuando haya backend ───

const KEY = 'calzacaribe_notificaciones'

function now(offsetMs = 0) {
  return new Date(Date.now() - offsetMs).toISOString()
}

const MIN = 60 * 1000
const HR  = 60 * MIN
const DAY = 24 * HR

const SEED = [
  {
    id: 'n1',
    tipo: 'pedido_enviado',
    titulo: 'Tu pedido está en camino',
    mensaje: 'El pedido #ORD-XK4AB salió del almacén. Estimado de entrega: 2-3 días hábiles.',
    fecha: now(25 * MIN),
    leida: false,
    accion: '/mis-compras',
  },
  {
    id: 'n2',
    tipo: 'oferta',
    titulo: 'Oferta especial de temporada',
    mensaje: 'Hasta 25% OFF en toda la categoría de sandalias. ¡Solo por 48 horas!',
    fecha: now(3 * HR),
    leida: false,
    accion: '/catalogo?categoria=5',
  },
  {
    id: 'n3',
    tipo: 'nuevo_producto',
    titulo: 'Nuevos productos disponibles',
    mensaje: 'Llegaron los Sneaker Runner Pro W en nuevos colores. ¡Edición limitada!',
    fecha: now(1 * DAY),
    leida: false,
    accion: '/catalogo',
  },
  {
    id: 'n4',
    tipo: 'pedido_entregado',
    titulo: 'Pedido entregado',
    mensaje: 'Tu pedido #ORD-PQ2MN fue entregado exitosamente. ¡Esperamos que lo disfrutes!',
    fecha: now(2 * DAY),
    leida: true,
    accion: '/mis-compras',
  },
  {
    id: 'n5',
    tipo: 'pedido_confirmado',
    titulo: 'Pedido confirmado',
    mensaje: 'Hemos confirmado tu pedido #ORD-LM7RT. Pronto comenzará el proceso de envío.',
    fecha: now(4 * DAY),
    leida: true,
    accion: '/mis-compras',
  },
]

function load() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  localStorage.setItem(KEY, JSON.stringify(SEED))
  return SEED
}

function persist(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getNotifications() {
  return load()
}

export function markRead(id) {
  const items = load().map((n) => n.id === id ? { ...n, leida: true } : n)
  persist(items)
  return items
}

export function markAllRead() {
  const items = load().map((n) => ({ ...n, leida: true }))
  persist(items)
  return items
}

export function deleteNotification(id) {
  const items = load().filter((n) => n.id !== id)
  persist(items)
  return items
}
