import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { pedidoService } from '../../../services/pedidoService'

// PLAN_INTEGRACION_ENVIA.md, Fase 5/6 — timeline de seguimiento en tiempo real (tipo Mercado
// Libre). Misma interfaz para CUALQUIER tienda (Calzacaribe incluida) — lo que cambia es el
// CONTENIDO, nunca el código: este componente intenta traer el detalle y, si el backend
// responde que este pedido no tiene guía real de Envia (el caso normal hoy — Calzacaribe usa
// contra_entrega, y cualquier pedido sin guía generada), simplemente no muestra nada. Ninguna
// tienda necesita "activar" esto en el frontend — se activa solo cuando hay datos reales.
//
// Esta respuesta NO pasa por la conversión snake_case del resto de la API (es el JSON de Envia
// reenviado tal cual) — los nombres de campo son los que Envia usa de verdad (camelCase),
// verificados en vivo: status, statusColor, estimatedDelivery, trackUrl, eventHistory. La forma
// exacta de cada evento en eventHistory no se pudo confirmar todavía (el envío de prueba nunca
// tuvo movimiento real) — se renderiza de forma defensiva, sin asumir campos que podrían no venir.
export default function SeguimientoDetalle({ numero }) {
  const [datos, setDatos] = useState(null)
  const [cargado, setCargado] = useState(false)

  useEffect(() => {
    let alive = true
    pedidoService.seguimientoDetalle(numero)
      .then((resp) => {
        const info = Array.isArray(resp?.data) ? resp.data[0] : null
        if (alive) setDatos(info ?? null)
      })
      .catch(() => { if (alive) setDatos(null) })
      .finally(() => { if (alive) setCargado(true) })
    return () => { alive = false }
  }, [numero])

  if (!cargado || !datos) return null

  const eventos = Array.isArray(datos.eventHistory) ? datos.eventHistory : []

  return (
    <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <MapPin size={13} /> Seguimiento en tiempo real
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {datos.status && (
          <span
            className="font-bold px-2.5 py-1 border"
            style={datos.statusColor ? { color: datos.statusColor, borderColor: datos.statusColor } : undefined}
          >
            {datos.status}
          </span>
        )}
        {datos.estimatedDelivery && (
          <span className="text-gray-500">
            Entrega estimada: {formatFecha(datos.estimatedDelivery)}
          </span>
        )}
      </div>

      {eventos.length > 0 && (
        <ul className="space-y-1.5 pl-0.5">
          {eventos.map((evento, i) => {
            // Forma exacta no confirmada todavía — se prueban los nombres más probables sin
            // asumir que todos vengan siempre.
            const etiqueta = evento?.status || evento?.description || evento?.event || null
            const fecha = evento?.date || evento?.datetime || evento?.created_at || evento?.createdAt || null
            const lugar = evento?.location || evento?.city || null
            if (!etiqueta && !fecha) return null
            return (
              <li key={i} className="text-xs text-gray-600 border-l-2 border-gray-200 pl-3">
                {etiqueta && <span className="font-semibold text-black">{etiqueta}</span>}
                {lugar && <span className="text-gray-400"> · {lugar}</span>}
                {fecha && <span className="block text-gray-400">{formatFecha(fecha)}</span>}
              </li>
            )
          })}
        </ul>
      )}

      {datos.trackUrl && (
        <a
          href={datos.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-bold text-black underline"
        >
          Ver en el sitio de la transportadora
        </a>
      )}
    </div>
  )
}

function formatFecha(valor) {
  const d = new Date(valor)
  if (Number.isNaN(d.getTime())) return valor
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
