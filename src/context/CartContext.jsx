import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.productId}-${JSON.stringify(action.item.variantes ?? {})}`
      const exists = state.find((i) => i.key === key)
      if (exists) {
        return state.map((i) => i.key === key ? { ...i, cantidad: i.cantidad + action.item.cantidad } : i)
      }
      return [...state, { ...action.item, key }]
    }
    case 'UPDATE_QTY':
      if (action.cantidad <= 0) return state.filter((i) => i.key !== action.key)
      return state.map((i) => i.key === action.key ? { ...i, cantidad: action.cantidad } : i)
    case 'REMOVE':
      return state.filter((i) => i.key !== action.key)
    case 'CLEAR':
      return []
    case 'HYDRATE':
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('calzacaribe_cart')
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('calzacaribe_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => dispatch({ type: 'ADD', item })
  const removeFromCart = (key) => dispatch({ type: 'REMOVE', key })
  const updateQty = (key, cantidad) => dispatch({ type: 'UPDATE_QTY', key, cantidad })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const total = cart.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const count = cart.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
