import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { pedidoService } from '../services/pedidoService'

const OrdersContext = createContext(null)

function normalizeOrder(row) {
  return {
    id: row.numero,
    estado: row.estado,
    fecha: row.creado_en,
    subtotal: row.subtotal,
    envio: row.envio,
    total: row.total,
    notas: row.notas,
    alertaStock: row.alerta_stock,
    linkSeguimiento: row.link_seguimiento,
    direccion: row.dir_snapshot,
    items: (row.items ?? []).map((item) => ({
      productId: item.producto_id,
      nombre: item.nombre,
      imagen: item.imagen ?? '',
      variantes: item.variantes ?? {},
      cantidad: item.cantidad,
      precio: item.precio,
    })),
  }
}

export function OrdersProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const reload = async () => {
    if (!isAuthenticated) { setOrders([]); return }
    setLoading(true)
    try {
      const rows = await pedidoService.misCompras()
      setOrders((rows ?? []).map(normalizeOrder))
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return (
    <OrdersContext.Provider value={{ orders, loading, reload }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
