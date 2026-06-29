import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import StoreLayout from './components/layout/StoreLayout'
import LoginPage from './modules/auth/pages/LoginPage'
import HomePage from './modules/home/pages/HomePage'
import CatalogPage from './modules/catalog/pages/CatalogPage'
import ProductDetailPage from './modules/product/pages/ProductDetailPage'
import CartPage from './modules/cart/pages/CartPage'
import MisComprasPage from './modules/orders/pages/MisComprasPage'
import ConfiguracionPage from './modules/profile/pages/ConfiguracionPage'
import NotificationsPage from './modules/notifications/pages/NotificationsPage'
import SearchPage from './modules/search/pages/SearchPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <OrdersProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<StoreLayout />}>
              <Route index element={<HomePage />} />
              <Route path="catalogo" element={<CatalogPage />} />
              <Route path="producto/:id" element={<ProductDetailPage />} />
              <Route path="carrito" element={<CartPage />} />
              <Route path="mis-compras" element={<MisComprasPage />} />
              <Route path="configuracion" element={<ConfiguracionPage />} />
              <Route path="notificaciones" element={<NotificationsPage />} />
              <Route path="busqueda" element={<SearchPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </OrdersProvider>
    </CartProvider>
  )
}
