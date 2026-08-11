// Persiste la Idempotency-Key de un intento de pago en sessionStorage, atada a una firma estable
// de la intención (dirección + método + contenido del carrito) — así sobrevive a que la respuesta
// se pierda por timeout/corte de red y a una recarga de página, en vez de perderse apenas el
// componente vuelve a montar (ver TERCERA_AUDITORIA_FUNCIONAL_E_IDEMPOTENCIA.md, hallazgo I-02).
//
// Solo se limpia cuando el intento llega a un resultado DEFINITIVO (redirección a Wompi exitosa,
// o un status final de tarjeta: APPROVED/DECLINED/ERROR). Un error de red/cliente NO la limpia a
// propósito — el siguiente intento debe reutilizar la misma clave mientras la intención (carrito,
// dirección, método) no haya cambiado, para que el backend lo reconozca como el mismo intento.
const STORAGE_KEY = 'checkout_idempotency_v1'

function firmaIntencion({ direccionId, metodo, cart }) {
  const items = [...(cart ?? [])]
    .map((item) => `${item.itemId ?? item.id}:${item.cantidad}`)
    .sort()
    .join(',')
  return `${direccionId}|${metodo}|${items}`
}

export function getOrCreateIdempotencyKey({ direccionId, metodo, cart }) {
  const firma = firmaIntencion({ direccionId, metodo, cart })
  let guardado = null
  try {
    guardado = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    guardado = null
  }
  if (guardado && guardado.firma === firma && guardado.key) {
    return guardado.key
  }
  const key = crypto.randomUUID()
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ firma, key }))
  return key
}

export function clearIdempotencyKey() {
  sessionStorage.removeItem(STORAGE_KEY)
}