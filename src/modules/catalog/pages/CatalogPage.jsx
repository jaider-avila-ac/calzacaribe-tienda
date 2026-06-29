import { Link } from 'react-router-dom'
import { ChevronDown, Search, X, ChevronRight } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import ProductCard from '../../../components/ui/ProductCard'
import categoriesData from '../../../data/categories.json'

const SORT_OPTIONS = [
  { value: 'relevancia',  label: 'Relevancia' },
  { value: 'precio-asc',  label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'descuento',   label: 'Mayor descuento' },
  { value: 'nombre',      label: 'Nombre A–Z' },
]

const CAT_BANNER = {
  1: { bg: 'bg-violet-950', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1400&q=80', sub: 'Tacones · Botines · Baletas · Sandalias' },
  2: { bg: 'bg-zinc-900',   img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1400&q=80', sub: 'Formales · Sneakers · Mocasines · Botas' },
  3: { bg: 'bg-blue-950',   img: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=1400&q=80', sub: 'Tenis · Sandalias · Colegial' },
  4: { bg: 'bg-emerald-950',img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=80', sub: 'Blusas · Sweaters · Jeans · Camisas' },
  5: { bg: 'bg-amber-900',  img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1400&q=80', sub: 'Playa · Casuales · Elegantes' },
  6: { bg: 'bg-stone-900',  img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=80', sub: 'Bolsos · Cinturones · Medias' },
}

const DEFAULT_BANNER = {
  bg:  'bg-black',
  img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80',
  sub: 'Calzado y ropa para toda la familia',
}

/* ══════════════════════════════════════════════════════════
   PÁGINA
═══════════════════════════════════════════════════════════ */

export default function CatalogPage() {
  const { filtered, params, setFilter, clearFilters, sort, categoriaId, soloDescuento } = useCatalog()

  const activeCategory = categoriesData.find((c) => c.id === categoriaId)
  const activeSub      = params.get('subcategoria') ?? ''
  const banner         = categoriaId ? (CAT_BANNER[categoriaId] ?? DEFAULT_BANNER) : DEFAULT_BANNER

  let pageTitle = 'Todo el catálogo'
  if (soloDescuento)   pageTitle = 'Ofertas'
  else if (activeCategory) pageTitle = activeCategory.nombre

  return (
    <div className="pb-16">

      {/* ── Banner ── */}
      <div className={`relative ${banner.bg} overflow-hidden h-[220px] sm:h-[260px]`}>
        <img src={banner.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight size={11} />
              <span className="text-white/80">{pageTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{pageTitle}</h1>
            {activeCategory && <p className="text-white/50 text-xs mt-1.5">{banner.sub}</p>}
            {soloDescuento  && <p className="text-white/50 text-xs mt-1.5">Los mejores precios en calzado y ropa</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-5">

        {/* ── Subcategorías (solo cuando hay categoría) ── */}
        {activeCategory && activeCategory.subcategorias.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-0.5">
            <button
              onClick={() => setFilter('subcategoria', '')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !activeSub ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'
              }`}
            >
              Todo
            </button>
            {activeCategory.subcategorias.map((sub) => (
              <button
                key={sub}
                onClick={() => setFilter('subcategoria', activeSub === sub ? '' : sub)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeSub === sub ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-black'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* ── Controles: conteo + sort + limpiar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-black">{filtered.length}</span> productos
          </p>
          <div className="flex items-center gap-2">
            {(categoriaId || activeSub || soloDescuento) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-black border border-gray-200 rounded-lg px-3 py-1.5 hover:border-black transition-colors"
              >
                <X size={11} /> Limpiar
              </button>
            )}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Grid de productos ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-base font-bold text-black">Sin resultados</p>
            <p className="text-sm text-gray-400 mt-1">Intenta con otros filtros</p>
            <button onClick={clearFilters} className="btn-primary mt-5 mx-auto">Ver todo</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
