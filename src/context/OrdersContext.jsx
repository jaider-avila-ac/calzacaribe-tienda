import { createContext, useContext, useState } from 'react'
import { getOrders, createOrder } from '../services/orderService'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => getOrders())

  const addOrder = (data) => {
    const order = createOrder(data)
    setOrders((prev) => [order, ...prev])
    return order.id
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
