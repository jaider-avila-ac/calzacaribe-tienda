import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, RefreshCw, Shield, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import productsData from '../../../data/products.json'
import ProductCard from '../../../components/ui/ProductCard'
import { getActiveCategories } from '../../../services/categoryService'

const activeCategories = getActiveCategories()

/* Productos por categoría, mínimo 1 para mostrar la sección */
function getCategoryProducts(catId, limit = 4) {
  return productsData.filter((p) => p.activo && p.categoriaId === catId).slice(0, limit)
}

/* ── Banners de categoría — el admin configura imagen, título y link desde el panel ── */
const CATEGORY_BANNERS = [
  {
    id: 1,
    to: '/catalogo?categoria=1',
    imagen: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    bg: 'bg-violet-950',
    titulo: 'Mujer',
    subtitulo: 'Tacones · Botines · Baletas',
  },
  {
    id: 2,
    to: '/catalogo?categoria=2',
    imagen: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
    bg: 'bg-black border border-white/10',
    titulo: 'Hombre',
    subtitulo: 'Formales · Sneakers · Botas',
  },
]

/* ── Diapositivas del banner (el admin podrá configurar esto desde el panel) ── */
const BANNER_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=85',
    link: '/catalogo',
  },
  {
    src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1920&q=85',
    link: '/catalogo?categoria=1',
  },
  {
    src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1920&q=85',
    link: '/catalogo?descuento=true',
  },
]

/* Carrusel del hero: escala proporcional (aspect-ratio fijo), auto-avance,
   flechas y puntos indicadores. Cada diapositiva puede tener link opcional. */
function BannerHero() {
  const slides = BANNER_SLIDES
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length)
    }, 4500)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const go = (idx) => { setCurrent(idx); startTimer() }
  const prev = () => go((current - 1 + slides.length) % slides.length)
  const next = () => go((current + 1) % slides.length)

  return (
    <div className="relative w-full overflow-hidden aspect-[16/6]">

      {slides.map(({ src, link }, i) => {
        /* offset: 0 = actual, 1+ = derecha, slides.length-1 = izquierda */
        const offset = (i - current + slides.length) % slides.length
        const x = offset === 0 ? 0 : offset === slides.length - 1 ? -100 : 100

        const imgEl = (
          <img
            src={src}
            alt={`Banner ${i + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        )

        return (
          <div
            key={i}
            className="absolute inset-0 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${x}%)` }}
          >
            {link
              ? <Link to={link} className="block w-full h-full">{imgEl}</Link>
              : imgEl
            }
          </div>
        )
      })}

      {/* ── Flecha izquierda ── */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Flecha derecha ── */}
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Puntos indicadores ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Ir al banner ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const vendidos = productsData.filter((p) => p.activo && p.etiquetas.includes('mas-vendido')).slice(0, 4)

  return (
    <div className="pb-16">

      {/* ── Hero ── imagen proporcional (el admin sube la imagen desde el panel) ── */}
      <BannerHero />

      {/* ── Beneficios ── */}
      <div className="bg-accent">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex flex-col sm:flex-row sm:divide-x divide-white/20">
            {[
              { Icon: Truck,     text: 'Envío gratis +$200.000' },
              { Icon: RefreshCw, text: 'Cambios en 30 días' },
              { Icon: Shield,    text: 'Compra 100% segura' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 py-2 sm:flex-1">
                <Icon size={13} className="text-white flex-shrink-0" />
                <span className="text-xs font-semibold text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Más vendidos ── */}
      {vendidos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-black text-black">
              <Flame size={16} className="text-red-500" />
              Más vendidos
            </h2>
            <Link
              to="/catalogo"
              className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vendidos.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Secciones por categoría ── */}
      {activeCategories.map((cat) => {
        const productos = getCategoryProducts(cat.id, 4)
        if (productos.length === 0) return null

        return (
          <section key={cat.id} className="max-w-7xl mx-auto px-4 pt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-black">{cat.nombre}</h2>
              <Link
                to={`/catalogo?categoria=${cat.id}`}
                className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
              >
                Ver todo <ArrowRight size={12} />
              </Link>
            </div>
            {/* Subcategorías como chips */}
            {cat.subcategorias.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3 pb-0.5">
                {cat.subcategorias.map((sub) => (
                  <Link
                    key={sub}
                    to={`/catalogo?categoria=${cat.id}&subcategoria=${encodeURIComponent(sub)}`}
                    className="flex-shrink-0 text-[11px] font-medium text-gray-500 hover:text-black border border-gray-200 hover:border-black px-2.5 py-1 rounded-full transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {productos.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )
      })}

      {/* ── Banners de categoría — proporcionales, imagen desde el admin ── */}
      <div className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORY_BANNERS.map(({ id, to, imagen, bg, titulo, subtitulo }) => (
          <Link
            key={id}
            to={to}
            className={`relative rounded-2xl overflow-hidden ${bg} aspect-[16/7] flex items-center p-6`}
          >
            <img
              src={imagen}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <p className="text-accent text-xs font-bold uppercase tracking-wide mb-1">Colección</p>
              <h3 className="text-white text-2xl font-black">{titulo}</h3>
              <p className="text-gray-300 text-xs mt-1">{subtitulo}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-white bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                Ver más <ArrowRight size={11} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Nuevos ingresos ── */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-base font-black text-black">
            <Sparkles size={16} className="text-violet-600" />
            Nuevos ingresos
          </h2>
          <Link
            to="/catalogo?etiqueta=nuevo"
            className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {productsData.filter((p) => p.activo && p.etiquetas.includes('nuevo')).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── CTA WhatsApp ── */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-accent rounded-2xl p-6 text-center">
          <h3 className="text-lg font-black text-white">¿Dudas sobre tallas o colores?</h3>
          <p className="text-sm text-white/70 mt-1 mb-4">Escríbenos y te asesoramos al instante</p>
          <a
            href="https://wa.me/573015097013?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chatear ahora
          </a>
        </div>
      </div>
    </div>
  )
}
