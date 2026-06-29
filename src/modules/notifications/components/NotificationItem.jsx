import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Trash2,
  ShoppingBag, CheckCircle, Truck, PackageCheck, Tag, Sparkles,
} from 'lucide-react'

const TIPO_META = {
  pedido_recibido:   { Icon: ShoppingBag,  label: 'Pedido recibido' },
  pedido_confirmado: { Icon: CheckCircle,  label: 'Confirmado'      },
  pedido_enviado:    { Icon: Truck,        label: 'En camino'       },
  pedido_entregado:  { Icon: PackageCheck, label: 'Entregado'       },
  oferta:            { Icon: Tag,          label: 'Oferta'          },
  nuevo_producto:    { Icon: Sparkles,     label: 'Novedad'         },
}

function tiempoRelativo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  const hr   = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (min  < 1)  return 'Justo ahora'
  if (min  < 60) return `hace ${min} min`
  if (hr   < 24) return `hace ${hr} h`
  if (day  < 7)  return `hace ${day} ${day === 1 ? 'día' : 'días'}`
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

export default function NotificationItem({ notif, onMarkRead, onDelete }) {
  const navigate = useNavigate()
  const { Icon } = TIPO_META[notif.tipo] ?? { Icon: ShoppingBag }

  const handleClick = () => {
    if (!notif.leida) onMarkRead(notif.id)
    if (notif.accion) navigate(notif.accion)
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
      notif.leida ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200'
    }`}>

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
        notif.leida ? 'bg-gray-100' : 'bg-black'
      }`}>
        <Icon size={16} className={notif.leida ? 'text-gray-400' : 'text-white'} />
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
        <p className={`text-sm leading-snug ${notif.leida ? 'font-medium text-gray-700' : 'font-bold text-black'}`}>
          {notif.titulo}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
          {notif.mensaje}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[11px] text-gray-400">{tiempoRelativo(notif.fecha)}</span>
          {notif.accion && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClick() }}
              className="flex items-center gap-1 text-[11px] font-semibold text-black hover:underline"
            >
              Ver <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>

      {!notif.leida && (
        <span className="w-2 h-2 rounded-full bg-black flex-shrink-0 mt-2" />
      )}

      <button
        onClick={() => onDelete(notif.id)}
        className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
