import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Truck } from 'lucide-react'
import { fmt } from '../../../utils/format'
import StatusStepper from './StatusStepper'

const ESTADO_BADGE = {
  pagado: 'bg-blue-100 text-blue-700',
  preparando: 'bg-gray-100 text-gray-700',
  enviado: 'bg-violet-100 text-violet-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-600',
  devuelto: 'bg-orange-100 text-orange-700',
}

const ESTADO_LABEL = {
  pagado: 'Recibido',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  devuelto: 'Devuelto',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const badge = ESTADO_BADGE[order.estado] ?? 'bg-gray-100 text-gray-600'

  return (
    <div className="bg-white border border-gray-100 overflow-hidden">

      {/* Encabezado */}
      <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-sm font-black text-black">#{order.id}</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 ${badge}`}>
              {ESTADO_LABEL[order.estado] ?? order.estado}
            </span>
          </div>
          <p className="text-xs text-gray-400">{formatDate(order.fecha)}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-black text-black">{fmt(order.total)}</p>
          <p className="text-xs text-gray-400">
            {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-4 sm:px-5 pb-4 overflow-x-auto no-scrollbar">
        <StatusStepper estado={order.estado} />
      </div>

      {/* Link de seguimiento */}
      {order.linkSeguimiento && (
        <div className="px-4 sm:px-5 pb-3">
          <a
            href={order.linkSeguimiento}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-black border border-gray-200 px-3 py-1.5 hover:border-black transition-colors"
          >
            <Truck size={13} /> Rastrear pedido
          </a>
        </div>
      )}

      {/* Miniaturas */}
      <div className="px-4 sm:px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {order.items.slice(0, 5).map((item, i) => (
          <Link
            key={i}
            to={`/producto/${item.productId}`}
            className="flex-shrink-0 w-14 h-14 overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors"
          >
            <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
          </Link>
        ))}
        {order.items.length > 5 && (
          <div className="flex-shrink-0 w-14 h-14 bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
            +{order.items.length - 5}
          </div>
        )}
      </div>

      {/* Toggle detalle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-gray-100 text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
      >
        {expanded
          ? <><ChevronUp size={13} /> Ocultar detalle</>
          : <><ChevronDown size={13} /> Ver detalle</>}
      </button>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-4 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-12 h-12 object-cover bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black line-clamp-1">{item.nombre}</p>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                  {Object.entries(item.variantes ?? {}).map(([k, v]) => (
                    <span key={k} className="text-xs text-gray-400">{k}: {v}</span>
                  ))}
                  <span className="text-xs text-gray-400">×{item.cantidad}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-black flex-shrink-0">
                {fmt(item.subtotal)}
              </p>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Envío</span>
              <span className={order.envio === 0 ? 'text-accent font-semibold' : ''}>
                {order.envio === 0 ? 'Gratis' : fmt(order.envio)}
              </span>
            </div>
            <div className="flex justify-between font-black text-black pt-1 border-t border-gray-100">
              <span>Total</span><span>{fmt(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
