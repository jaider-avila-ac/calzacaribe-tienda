import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Search, X, ChevronRight } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import { getCategoryById } from '../../../services/categoryService'
import ProductCard from '../../../components/ui/ProductCard'

const SORT_OPTIONS = [
  { value: 'relevancia',  label: 'Relevancia' },
  { value: 'precio-asc',  label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'descuento',   label: 'Mayor descuento' },
  { value: 'nombre',      label: 'Nombre A–Z' },
]


/* ══════════════════════════════════════════════════════════
   PÁGINA
═══════════════════════════════════════════════════════════ */

export default function CatalogPage() {
  const {
    filtered,
    loading,
    params,
    setFilter,
    clearFilters,
    sort,
    categoriaId,
    subcategoria,
    genero,
    etiqueta,
    soloDescuento,
  } = useCatalog()
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    if (categoriaId) {
      getCategoryById(categoriaId).then(setActiveCategory).catch(() => setActiveCategory(null))
    } else {
      setActiveCategory(null)
    }
  }, [categoriaId])

  const activeSub  = params.get('subcategoria') ?? ''
  const bannerImg  = activeCategory?.imagenUrl ?? null
  const hasRefinements = Boolean(subcategoria || genero || etiqueta || soloDescuento)

  let pageTitle = 'Todo el catálogo'
  if (soloDescuento)   pageTitle = 'Ofertas'
  else if (activeCategory) pageTitle = activeCategory.nombre

  return (
    <div className="pb-16">

      {/* ── Banner ── siempre negro, imagen con overlay si existe */}
      <div className="relative bg-black overflow-hidden h-[220px] sm:h-[260px]">
        {bannerImg && (
          <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* Overlay negro siempre — hace que cualquier imagen quede oscura */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight size={11} />
              <span className="text-white/80">{pageTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{pageTitle}</h1>
            {soloDescuento && <p className="text-white/50 text-xs mt-1.5">Los mejores precios en calzado y ropa</p>}
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
            {loading
              ? <span className="text-gray-400">Cargando…</span>
              : <><span className="font-bold text-black">{filtered.length}</span> productos</>
            }
          </p>
          <div className="flex items-center gap-2">
            {hasRefinements && (
              <button
                onClick={() => clearFilters({ preserveCategory: Boolean(categoriaId) })}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-black border border-gray-200 rounded-lg px-3 py-1.5 hover:border-black transition-colors"
              >
                <X size={11} /> Limpiar filtros
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
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Cargando productos…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-base font-bold text-black">Sin resultados</p>
            <p className="text-sm text-gray-400 mt-1">Intenta con otros filtros</p>
            <button
              onClick={() => clearFilters({ preserveCategory: Boolean(categoriaId) })}
              className="btn-primary mt-5 mx-auto"
            >
              {categoriaId ? 'Ver toda la categoria' : 'Ver todo'}
            </button>
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
