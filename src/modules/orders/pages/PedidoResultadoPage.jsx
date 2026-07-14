import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { pedidoService } from '../../../services/pedidoService'
import { useCart } from '../../../context/CartContext'

const POLL_MS = 2000
const MAX_INTENTOS = 15 // ~30s

const ESTADO_FINAL = new Set(['pagado', 'preparando', 'enviado', 'entregado', 'cancelado', 'devuelto'])

export default function PedidoResultadoPage() {
  const [searchParams] = useSearchParams()
  const numero = searchParams.get('numero')
  const { refreshCart } = useCart()
  const [pedido, setPedido] = useState(null)
  const [error, setError] = useState('')
  const intentos = useRef(0)

  useEffect(() => {
    if (!numero) { setError('Pedido no especificado'); return }
    let alive = true
    let timeoutId

    const poll = async () => {
      try {
        const data = await pedidoService.estadoPedido(numero)
        if (!alive) return
        setPedido(data)
        if (ESTADO_FINAL.has(data.estado) || intentos.current >= MAX_INTENTOS) {
          if (data.estado !== 'pendiente_pago') await refreshCart()
          return
        }
      } catch (err) {
        if (!alive) return
        setError(err.message || 'No se pudo consultar el pedido')
        return
      }
      intentos.current += 1
      timeoutId = setTimeout(poll, POLL_MS)
    }
    poll()

    return () => { alive = false; clearTimeout(timeoutId) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero])

  if (error) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <XCircle size={40} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-lg font-black text-black">{error}</h1>
        <Link to="/mis-compras" className="btn-primary inline-flex mt-6">Ver mis compras</Link>
      </div>
    )
  }

  if (!pedido || pedido.estado === 'pendiente_pago') {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <Loader2 size={40} className="text-black mx-auto mb-4 animate-spin" />
        <h1 className="text-lg font-black text-black">Confirmando tu pago…</h1>
        <p className="text-sm text-gray-400 mt-2">Esto puede tardar unos segundos.</p>
      </div>
    )
  }

  if (pedido.estado === 'cancelado') {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <XCircle size={40} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-lg font-black text-black">El pago no fue aprobado</h1>
        {pedido.pago_motivo_rechazo && (
          <p className="text-sm text-gray-400 mt-2">{pedido.pago_motivo_rechazo}</p>
        )}
        <Link to="/carrito" className="btn-primary inline-flex mt-6">Volver al carrito</Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <CheckCircle2 size={40} className="text-accent-dark mx-auto mb-4" />
      <h1 className="text-lg font-black text-black">¡Compra confirmada!</h1>
      <p className="text-sm text-gray-400 mt-2">Pedido #{pedido.numero}</p>
      <Link to="/mis-compras" className="btn-primary inline-flex mt-6">Ver mis compras</Link>
    </div>
  )
}
