import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, AlertCircle, MapPin, ChevronRight, Loader2 } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { useOrders } from '../../../context/OrdersContext'
import { getStock, validateCart } from '../../../services/stockService'
import { getDirecciones } from '../../../services/profileService'
import { fmt } from '../../../utils/format'
import CartItem from '../components/CartItem'

const FREE_SHIP = 200000
const SHIP_COST = 12000

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, total, count } = useCart()
  const { addOrder } = useOrders()
  const navigate = useNavigate()

  const [direcciones]    = useState(() => getDirecciones())
  const [selectedDirId, setSelectedDirId] = useState(() => getDirecciones()[0]?.id ?? null)
  const selectedDir = direcciones.find((d) => d.id === selectedDirId) ?? null

  // Validación de stock en tiempo real contra la API
  const [apiValidation, setApiValidation] = useState(null)
  const [validating,    setValidating]    = useState(false)

  useEffect(() => {
    if (cart.length === 0) { setApiValidation([]); return }
    setValidating(true)
    validateCart(cart).then((results) => {
      setApiValidation(results)  // null si la API falla → fallback a localStorage
      setValidating(false)
    })
  }, [cart])

  const cartValidated = useMemo(() => cart.map((item) => {
    if (apiValidation === null) {
      // Fallback a localStorage mientras carga o si la API falla
      const s = getStock(item.productId, item.variantes) ?? 0
      return { ...item, stockActual: s, isOutOfStock: s === 0, isOverStock: item.cantidad > s && s > 0 }
    }
    // Buscar resultado de la API para este ítem (API devuelve snake_case por Jackson)
    const res = apiValidation.find((r) =>
      r.product_id === item.productId &&
      (r.talla ?? null) === (item.variantes?.['Talla'] ?? null) &&
      (r.color ?? null) === (item.variantes?.['Color'] ?? null)
    )
    if (!res) {
      // Ítem no encontrado en la validación (producto eliminado)
      return { ...item, stockActual: 0, isOutOfStock: true, isOverStock: false }
    }
    const stock = res.stock_disponible
    return {
      ...item,
      stockActual:  stock,
      isOutOfStock: !res.producto_activo || stock === 0,
      isOverStock:  res.producto_activo && item.cantidad > stock && stock > 0,
    }
  }), [cart, apiValidation])

  const hasCartIssues = cartValidated.some((i) => i.isOutOfStock || i.isOverStock)
  const canCheckout   = !hasCartIssues && !validating && selectedDir !== null

  const shipping   = total >= FREE_SHIP ? 0 : SHIP_COST
  const grandTotal = total + shipping

  const handleCheckout = () => {
    if (!canCheckout) return
    addOrder({ items: cart, subtotal: total, envio: shipping, total: grandTotal, direccion: selectedDir })
    clearCart()
    navigate('/mis-compras')
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <ShoppingBag size={32} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-black">Tu carrito está vacío</h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">Agrega productos para continuar</p>
        <Link to="/" className="btn-primary inline-flex">Volver a la tienda</Link>
      </div>
    )
  }

  const waMessage = encodeURIComponent(
    'Pedido Calzacaribe\n\n' +
    cart.map((i) => {
      const vars = Object.entries(i.variantes ?? {}).map(([k, v]) => `${k}: ${v}`).join(', ')
      return `• ${i.nombre}${vars ? ` (${vars})` : ''} ×${i.cantidad} → ${fmt(i.precio * i.cantidad)}`
    }).join('\n') +
    `\n\nSubtotal: ${fmt(total)}\nEnvío: ${shipping === 0 ? 'Gratis' : fmt(shipping)}\nTotal: ${fmt(grandTotal)}`
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── Lista de productos ──────────────────────── */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-black text-black">
            Tu pedido ({count} {count === 1 ? 'artículo' : 'artículos'})
          </h1>
          <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
            Vaciar carrito
          </button>
        </div>

        {hasCartIssues && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-700 leading-snug">
              Algunos artículos tienen problemas de stock. Ajusta las cantidades o elimínalos para continuar.
            </p>
          </div>
        )}

        {total < FREE_SHIP && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-black">
                Agrega {fmt(FREE_SHIP - total)} más y obtén envío gratis
              </p>
              <div className="mt-1.5 h-1.5 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-dark rounded-full transition-all"
                  style={{ width: `${Math.min(100, (total / FREE_SHIP) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
        {total >= FREE_SHIP && (
          <div className="bg-accent rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-black">¡Tienes envío gratis!</p>
          </div>
        )}

        {cartValidated.map((item) => (
          <CartItem
            key={item.key}
            item={item}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      {/* ── Resumen + dirección ─────────────────────── */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20 space-y-4">
          <h2 className="text-base font-bold text-black pb-3 border-b border-gray-100">Resumen del pedido</h2>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dirección de envío</p>

            {direcciones.length === 0 ? (
              <Link
                to="/configuracion"
                className="flex items-center justify-between gap-2 p-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-black hover:text-black transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>Agrega una dirección de envío</span>
                </div>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <div className="space-y-2">
                {direcciones.map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedDirId === d.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="direccion"
                      value={d.id}
                      checked={selectedDirId === d.id}
                      onChange={() => setSelectedDirId(d.id)}
                      className="mt-0.5 flex-shrink-0 accent-black"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-black leading-snug line-clamp-1">
                        {d.direccion}{d.apartamento ? `, Apto ${d.apartamento}` : ''}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {[d.barrio, d.municipio, d.departamento].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-[11px] text-gray-400">{d.contactoNombre} · +57 {d.contactoTelefono}</p>
                    </div>
                  </label>
                ))}
                <Link to="/configuracion" className="block text-[11px] text-gray-400 hover:text-black transition-colors mt-1">
                  + Agregar otra dirección
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal ({count} art.)</span>
              <span className="font-semibold">{fmt(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Envío</span>
              <span className={`font-semibold ${shipping === 0 ? 'text-accent' : ''}`}>
                {shipping === 0 ? 'Gratis' : fmt(shipping)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-bold text-black">Total</span>
            <span className="text-xl font-black text-black">{fmt(grandTotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            className={`w-full rounded-xl py-3.5 font-bold text-sm transition-colors active:scale-95 flex items-center justify-center gap-2 ${
              !canCheckout
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {validating
              ? <><Loader2 size={15} className="animate-spin" /> Verificando stock…</>
              : 'Finalizar compra'
            }
          </button>
          {!selectedDir && !hasCartIssues && (
            <p className="text-xs text-center text-amber-600">Selecciona una dirección de envío</p>
          )}

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-100" />
            <span className="text-xs text-gray-400">o</span>
            <hr className="flex-1 border-gray-100" />
          </div>

          <a
            href={`https://wa.me/573155550001?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 rounded-xl py-3 font-semibold text-sm text-gray-700 hover:border-black hover:text-black transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pedir por WhatsApp
          </a>
          <p className="text-xs text-center text-gray-400">Un asesor coordinará el pago y envío</p>
        </div>
      </div>
    </div>
    </div>
  )
}
