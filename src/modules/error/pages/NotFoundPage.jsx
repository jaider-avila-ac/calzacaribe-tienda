import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const TIENDA = 'Calzacaribe'

/**
 * Página 404: rutas que no existen y productos que ya no están disponibles. Se pinta dentro del
 * layout de la tienda (con header y footer) para que el cliente pueda seguir navegando.
 */
export default function NotFoundPage({
  titulo = 'Página no encontrada',
  mensaje = 'La página que buscas no existe o ya no está disponible.',
}) {
  // Título de la pestaña y noindex mientras se ve esta página; al salir se restaura lo anterior
  useEffect(() => {
    const tituloAntes = document.title
    document.title = `${titulo} | ${TIENDA}`
    let robots = document.head.querySelector('meta[name="robots"]')
    const robotsAntes = robots?.getAttribute('content') ?? null
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex')
    return () => {
      document.title = tituloAntes
      if (robotsAntes === null) robots.remove()
      else robots.setAttribute('content', robotsAntes)
    }
  }, [titulo])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <p className="text-7xl sm:text-8xl font-black text-black/10 leading-none select-none">404</p>
        <h1 className="mt-4 text-xl sm:text-2xl font-bold text-black uppercase tracking-[0.12em]">{titulo}</h1>
        <p className="mt-3 text-sm text-gray-500">{mensaje}</p>
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link to="/" className="btn-primary">Ir al inicio</Link>
          <Link to="/catalogo" className="btn-secondary">Ver catálogo</Link>
        </div>
      </div>
    </div>
  )
}
