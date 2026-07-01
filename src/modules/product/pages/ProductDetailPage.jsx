import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ShoppingBag, Minus, Plus, Check, Truck, RefreshCw, Shield,
  Star, ChevronRight, AlertCircle, PackageCheck, XCircle, Play,
} from 'lucide-react'
import { getProductById, getRelatedProducts } from '../../../services/productService'
import { getCategoryById } from '../../../services/categoryService'
import { getStock, initStockFromProduct } from '../../../services/stockService'
import { addReciente } from '../../../services/recentService'
import { registrarEvento } from '../../../services/eventoService'
import ProductCard from '../../../components/ui/ProductCard'
import { useCart } from '../../../context/CartContext'
import { useAuth } from '../../../context/AuthContext'
import { fmt, discountedPrice } from '../../../utils/format'

/* ── Helpers de variantes ─────────────────────────────── */

function getVariante(product, nombre) {
  return product.variantes?.find((v) => v.nombre === nombre) ?? null
}

function calcPrecioExtra(product, seleccionadas) {
  const tallaV = getVariante(product, 'Talla')
  if (tallaV && seleccionadas['Talla']) {
    return tallaV.opciones.find((o) => o.valor === seleccionadas['Talla'])?.precioExtra ?? 0
  }
  return 0
}

/* ── Características ──────────────────────────────────── */

function buildCaracteristicas(product, category) {
  const base = [
    ['Marca',        product.marca],
    ['Categoría',    category?.nombre ?? '—'],
    ['Subcategoría', product.subcategoria],
  ]
  const extra = Object.entries(product.caracteristicas ?? {})
  return [...base, ...extra]
}

function stockRequiredNames(product) {
  const combos = product?.stockVariantes ?? []
  const names = []
  if (combos.some((v) => v.talla)) names.push('Talla')
  if (combos.some((v) => v.color)) names.push('Color')
  return names
}

/* ── Reseñas simuladas ────────────────────────────────── */

const MOCK_REVIEWS = [
  { id: 1, autor: 'María G.',  stars: 5, texto: 'Calidad excelente, llegaron en perfectas condiciones. Las tallas son exactas.', fecha: 'hace 2 semanas' },
  { id: 2, autor: 'Carlos M.', stars: 4, texto: 'Muy cómodos. El material es de buena calidad. Los recomiendo.', fecha: 'hace 1 mes' },
  { id: 3, autor: 'Laura V.',  stars: 5, texto: 'Hermosos, exactamente como en la foto. Muy satisfecha con la compra.', fecha: 'hace 1 mes' },
]

function Stars({ count, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size}
          className={n <= count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════════════════════ */

export default function ProductDetailPage() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [product,      setProduct]      = useState(null)
  const [category,     setCategory]     = useState(null)
  const [related,      setRelated]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [notFound,     setNotFound]     = useState(false)

  // Variantes seleccionadas: { "Talla": "38", "Color": "Negro", ... }
  const [seleccionadas, setSeleccionadas] = useState({})
  const [cantidad,      setCantidad]      = useState(1)
  const [activeMedia,   setActiveMedia]   = useState(0)
  const [added,         setAdded]         = useState(false)
  const [error,         setError]         = useState('')
  const [tab,           setTab]           = useState('caracteristicas')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setProduct(null)
    setSeleccionadas({})
    setCantidad(1)
    setActiveMedia(0)

    getProductById(id)
      .then(async (p) => {
        setProduct(p)
        initStockFromProduct(p)
        addReciente(p)
        registrarEvento('vista_producto', 'producto', p.id)
        const [cat, rel] = await Promise.all([
          getCategoryById(p.categoriaId),
          getRelatedProducts(p.id, p.categoriaId, 4),
        ])
        setCategory(cat)
        setRelated(rel)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400 text-sm">
        Cargando producto…
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xl font-bold text-black">Producto no encontrado</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-5 mx-auto">Ir al inicio</button>
      </div>
    )
  }

  const finalBase       = discountedPrice(product.precio, product.descuento)
  const precioExtra     = calcPrecioExtra(product, seleccionadas)
  const finalPrice      = finalBase + precioExtra
  const stock           = getStock(product.id, seleccionadas)
  const rating          = 4.0 + (product.id % 5) * 0.2
  const reviewCount     = 15 + (product.id % 30)
  const caracteristicas = buildCaracteristicas(product, category)
  const variantes       = product.variantes ?? []
  const requiredForStock = stockRequiredNames(product)

  const mediaItems = (() => {
    const imgs  = (product.imagenes ?? []).slice(0, 5).map((img) => ({
      type: 'image', src: img.url ?? img, varId: img.varId ?? null,
    }))
    const video = product.video ? [{ type: 'video', src: product.video, varId: null }] : []
    return [...imgs, ...video]
  })()

  /* Seleccionar una opción de variante */
  const handleVariante = (varianteName, valor, opcion) => {
    setSeleccionadas((prev) => ({ ...prev, [varianteName]: valor }))
    setError('')
    setCantidad(1)
    // Si se seleccionó un color y alguna imagen tiene varId, cambiar a la primera imagen de ese color
    if (varianteName === 'Color' && opcion?.varId) {
      const idx = mediaItems.findIndex((m) => m.varId === opcion.varId)
      if (idx !== -1) setActiveMedia(idx)
    }
  }

  /* Agregar al carrito */
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/producto/${id}` } })
      return
    }

    for (const v of variantes) {
      if (v.requerido && !seleccionadas[v.nombre]) {
        setError(`Selecciona ${v.nombre.toLowerCase()} para continuar`)
        return
      }
    }
    for (const name of requiredForStock) {
      if (!seleccionadas[name]) {
        setError(`Selecciona ${name.toLowerCase()} para continuar`)
        return
      }
    }
    if (stock === 0) { setError('Producto agotado'); return }
    setError('')
    addToCart({
      productId: product.id,
      nombre:    product.nombre,
      precio:    finalPrice,
      imagen:    mediaItems.find((m) => m.type === 'image')?.src ?? '',
      marca:     product.marca,
      variantes: seleccionadas,
      cantidad,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const waText = encodeURIComponent(
    `Hola, quiero pedir:\n*${product.nombre}*\n` +
    Object.entries(seleccionadas).map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\nPrecio: ${fmt(finalPrice)}`
  )

  const allRequiredSelected = variantes
    .filter((v) => v.requerido)
    .every((v) => Boolean(seleccionadas[v.nombre]))
  const allStockOptionsSelected = requiredForStock.every((name) => Boolean(seleccionadas[name]))

  const maxCantidad = allRequiredSelected && allStockOptionsSelected ? Math.max(0, stock ?? 0) : 1

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-16">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
        <ChevronRight size={11} />
        <Link to="/catalogo" className="hover:text-black transition-colors">Catálogo</Link>
        {category && (
          <>
            <ChevronRight size={11} />
            <Link to={`/catalogo?categoria=${category.id}`} className="hover:text-black transition-colors">
              {category.nombre}
            </Link>
          </>
        )}
        <ChevronRight size={11} />
        <span className="text-gray-700 font-medium line-clamp-1 max-w-xs">{product.nombre}</span>
      </nav>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* ── Galería ── */}
        {mediaItems.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-3">

            {/* Visor principal */}
            <div className="order-1 lg:order-2 flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              {mediaItems[activeMedia]?.type === 'video'
                ? (
                  <video
                    key={mediaItems[activeMedia].src}
                    src={mediaItems[activeMedia].src}
                    controls autoPlay loop playsInline
                    className="w-full h-full object-cover"
                  />
                )
                : (
                  <img
                    src={mediaItems[activeMedia]?.src ?? mediaItems[0].src}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-opacity duration-150"
                  />
                )
              }
            </div>

            {/* Miniaturas */}
            {mediaItems.length > 1 && (
              <div className="order-2 lg:order-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar pb-0.5 lg:pb-0">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMedia(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeMedia === i ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {item.type === 'video'
                      ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Play size={22} className="text-white" fill="white" />
                        </div>
                      )
                      : (
                        <img src={item.src} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                      )
                    }
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Info ── */}
        <div className="flex flex-col gap-5">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.etiquetas.includes('nuevo')       && <span className="badge-new">Nuevo</span>}
            {product.descuento > 0                     && <span className="badge-sale">-{product.descuento}% OFF</span>}
            {product.etiquetas.includes('mas-vendido') && <span className="badge-hot">Más vendido</span>}
          </div>

          {/* Marca + nombre + rating */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {product.marca} · {product.subcategoria}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-black leading-tight mt-1">
              {product.nombre}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Stars count={Math.round(rating)} />
              <span className="text-xs text-gray-400">{rating.toFixed(1)} · {reviewCount} reseñas</span>
            </div>
          </div>

          {/* Precio */}
          <div>
            {product.descuento > 0 ? (
              <>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-accent">{fmt(finalPrice)}</span>
                  <span className="text-xl text-gray-400 line-through">{fmt(product.precio + precioExtra)}</span>
                  <span className="text-sm font-bold bg-accent text-white px-2 py-0.5 rounded-lg">
                    -{product.descuento}% OFF
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ahorras <span className="font-semibold text-green-600">{fmt(product.precio - finalBase)}</span>
                </p>
              </>
            ) : (
              <span className="text-3xl font-black text-black">{fmt(finalPrice)}</span>
            )}
            {precioExtra > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">Incluye +{fmt(precioExtra)} por la opción seleccionada</p>
            )}
          </div>

          {/* ── Variantes dinámicas ── */}
          {variantes.map((variante) => {
            const selVal = seleccionadas[variante.nombre]
            return (
              <div key={variante.nombre}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-black">
                    {variante.nombre}{selVal ? `: ${selVal}` : ''}
                    {(variante.requerido || requiredForStock.includes(variante.nombre)) && !selVal && (
                      <span className="ml-1 text-[11px] font-normal text-gray-400">(requerido)</span>
                    )}
                  </p>
                  {variante.tipo === 'talla' && (
                    <button className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-2">
                      Guía de tallas
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {variante.opciones.map((opcion) => {
                    const isSelected  = selVal === opcion.valor
                    const optionStock = getStock(product.id, { [variante.nombre]: opcion.valor })
                    const isOut       = optionStock === 0

                    if (variante.tipo === 'color') {
                      return (
                        <button
                          key={opcion.valor}
                          title={opcion.valor}
                          onClick={() => handleVariante(variante.nombre, opcion.valor, opcion)}
                          className={`color-dot ${isSelected ? 'color-dot-active' : ''}`}
                          style={{ backgroundColor: opcion.hex }}
                        />
                      )
                    }

                    return (
                      <button
                        key={opcion.valor}
                        disabled={isOut}
                        onClick={() => handleVariante(variante.nombre, opcion.valor, opcion)}
                        className={`size-btn ${isSelected ? 'size-btn-active' : isOut ? 'size-btn-disabled' : ''}`}
                      >
                        {opcion.valor}
                        {opcion.precioExtra > 0 && !isOut && (
                          <span className="block text-[9px] leading-none text-green-600">
                            +{opcion.precioExtra / 1000}k
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

              </div>
            )
          })}

          {/* Stock global — solo si no hay variantes */}
          {stock !== null && (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${
              stock === 0 ? 'text-red-500' : stock <= 5 ? 'text-amber-600' : 'text-green-600'
            }`}>
              {stock === 0
                ? <><XCircle size={14} /> Agotado</>
                : stock <= 5
                ? <><AlertCircle size={14} /> Solo {stock} disponibles</>
                : <><PackageCheck size={14} /> {stock} unidades disponibles</>}
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1 -mt-3">
              <AlertCircle size={12} /> {error}
            </p>
          )}

          {/* Cantidad + Agregar al carrito */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
              <button onClick={() => setCantidad((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-bold">{cantidad}</span>
              <button onClick={() => setCantidad((q) => Math.min(maxCantidad, q + 1))}
                disabled={!allRequiredSelected || !allStockOptionsSelected || cantidad >= maxCantidad}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30">
                <Plus size={16} />
              </button>
            </div>

            <button onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-5 py-3 transition-all active:scale-95 ${
                added ? 'bg-accent-dark text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}>
              {added
                ? <><Check size={18} /> Agregado</>
                : <><ShoppingBag size={18} /> Agregar al carrito</>}
            </button>
          </div>

          {/* WhatsApp */}
          <a href={`https://wa.me/573155550001?text=${waText}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-5 py-3 text-sm font-bold text-gray-700 hover:border-black hover:text-black transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Comprar por WhatsApp
          </a>

          {/* Beneficios */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: Truck,     text: 'Envío a todo Colombia' },
             
              { Icon: Shield,    text: 'Compra segura' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                <Icon size={18} className="text-black" />
                <p className="text-xs text-gray-600 leading-tight">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'caracteristicas', label: 'Características' },
            { key: 'descripcion',     label: 'Descripción' },
            { key: 'resenas',         label: `Reseñas (${reviewCount})` },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t.key ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === 'caracteristicas' && (
            <div className="max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                {caracteristicas.map(([label, value], i) => (
                  <div key={label} className={`flex flex-col py-3 border-b border-gray-100 ${i < 3 ? 'sm:col-span-1' : ''}`}>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</span>
                    <span className="text-sm font-semibold text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'descripcion' && (
            <div className="max-w-2xl">
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.descripcion || 'Producto de alta calidad con materiales premium.'}
              </p>
            </div>
          )}

          {tab === 'resenas' && (
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-5xl font-black text-black">{rating.toFixed(1)}</p>
                  <Stars count={Math.round(rating)} size={16} />
                  <p className="text-xs text-gray-400 mt-1">{reviewCount} reseñas</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const w = n === 5 ? 65 : n === 4 ? 20 : n === 3 ? 10 : n === 2 ? 3 : 2
                    return (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{n}</span>
                        <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${w}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-7">{w}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <hr className="border-gray-100" />
              {MOCK_REVIEWS.map((r) => (
                <div key={r.id}>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      {r.autor[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-black">{r.autor}</p>
                      <Stars count={r.stars} size={11} />
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{r.fecha}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-10">{r.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-10 pt-8 border-t border-gray-100">
          <h2 className="text-base font-black text-black mb-4">También te puede gustar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
