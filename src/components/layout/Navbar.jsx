import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Bell, CircleUserRound, AlignJustify } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { getNotifications } from '../../services/notificationService'
import CategoryDrawer from './CategoryDrawer'

export default function Navbar() {
  const { count } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const unreadCount = getNotifications().filter((n) => !n.leida).length

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">

        {/* ══════════════════════════════════════════
            DESKTOP — una sola fila, h-[72px]
        ══════════════════════════════════════════ */}
        <div className="hidden lg:flex items-center h-[72px] max-w-7xl mx-auto px-6 gap-0">

          {/* Logo */}
          <Link to="/catalogo" className="flex items-center flex-shrink-0 mr-8">
            <img src="/logos/imagotico-calzacaribe.svg" alt="Calzacaribe" className="h-8" />
          </Link>

          {/* Hamburguesa + "Menú" */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className={`flex items-center gap-2 flex-shrink-0 mr-8 transition-colors ${
              drawerOpen ? 'text-accent' : 'text-white hover:text-accent'
            }`}
          >
            <div className="flex flex-col gap-[5px]">
              <span className="block w-[22px] h-[2.5px] bg-current rounded-sm" />
              <span className="block w-[22px] h-[2.5px] bg-current rounded-sm" />
              <span className="block w-[22px] h-[2.5px] bg-current rounded-sm" />
            </div>
            <span className="text-[15px] font-medium">Menú</span>
          </button>

          {/* Barra de búsqueda — ocupa el espacio restante */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos, marcas, categorías..."
              className="w-full h-11 rounded-full bg-white pl-5 pr-14 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-accent transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent hover:bg-accent-dark flex items-center justify-center transition-colors"
            >
              <Search size={15} className="text-black" />
            </button>
          </form>

          {/* Separadores + iconos derecha */}
          <div className="flex items-center h-[72px] ml-0">

            {/* Notificaciones */}
            <Link
              to="/notificaciones"
              className="relative flex items-center justify-center h-full px-5 border-l border-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-3.5 right-2.5 min-w-[16px] h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 border border-black">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Iniciar sesión */}
            <Link to="/login" className="flex flex-col items-start justify-center h-full px-5 border-l border-white/10 hover:bg-white/5 transition-colors">
              <span className="text-[11px] text-white/50 leading-none">Bienvenido</span>
              <span className="text-sm font-bold text-white leading-snug">Iniciar sesión</span>
            </Link>

            {/* Carrito */}
            <Link
              to="/carrito"
              className="relative flex items-center justify-center h-full px-5 border-l border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ShoppingCart size={24} />
              {count > 0 && (
                <span className="absolute top-3.5 right-2 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MÓVIL — dos filas
        ══════════════════════════════════════════ */}
        <div className="lg:hidden">

          {/* Fila 1: hamburguesa | logo | spacer | usuario | carrito */}
          <div className="flex items-center h-[56px] px-4 gap-3">

            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className={`flex-shrink-0 transition-colors ${drawerOpen ? 'text-accent' : 'text-white'}`}
            >
              <AlignJustify size={22} />
            </button>

            <Link to="/catalogo" className="flex items-center flex-shrink-0">
              <img src="/logos/imagotico-calzacaribe.svg" alt="Calzacaribe" className="h-6" />
            </Link>

            <div className="flex-1" />

            <Link to="/login" className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white flex-shrink-0" aria-label="Iniciar sesión">
              <CircleUserRound size={20} />
            </Link>

            <Link
              to="/carrito"
              className="relative w-9 h-9 flex items-center justify-center text-white/70 hover:text-white flex-shrink-0"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5">
                  {count}
                </span>
              )}
            </Link>
          </div>

          {/* Fila 2: buscador ancho completo */}
          <div className="flex items-center h-[44px] px-4 pb-2">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full h-9 rounded-full bg-white pl-4 pr-12 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-accent hover:bg-accent-dark flex items-center justify-center transition-colors"
              >
                <Search size={13} className="text-black" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Drawer de categorías */}
      <CategoryDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
