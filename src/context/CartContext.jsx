import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { addItem, clearCarrito, getCarrito, removeItem, updateItem } from '../services/cartService'
import { getTiendaConfig } from '../services/tiendaConfigService'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [freeShip, setFreeShip] = useState({ activo: true, desde: 200000 })

  useEffect(() => {
    let alive = true
    getTiendaConfig().then((cfg) => {
      if (!alive) return
      setFreeShip({
        activo: cfg?.envio_gratis_activo ?? true,
        desde: cfg?.envio_gratis_desde ?? 200000,
      })
    })
    return () => { alive = false }
  }, [])

  const applyCarrito = (data) => {
    setCart(data.items)
    setTotal(data.total)
    setCount(data.count)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setCart([])
      setTotal(0)
      setCount(0)
      return
    }
    let alive = true
    setLoading(true)
    getCarrito()
      .then((data) => { if (alive) applyCarrito(data) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [isAuthenticated])

  const addToCart = async (item) => {
    const data = await addItem({
      productId: item.productId,
      talla: item.variantes?.Talla,
      color: item.variantes?.Color,
      cantidad: item.cantidad ?? 1,
    })
    applyCarrito(data)
  }

  const updateQty = async (key, cantidad) => {
    const data = await updateItem(key, cantidad)
    applyCarrito(data)
  }

  const removeFromCart = async (key) => {
    const data = await removeItem(key)
    applyCarrito(data)
  }

  const clearCart = async () => {
    const data = await clearCarrito()
    applyCarrito(data)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count, loading, freeShip }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
