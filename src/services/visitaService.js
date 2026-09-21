import { fetchAuth } from './api'
import { getConsent } from './cookieConsent'

const VISITOR_KEY = 'visitor_id'

// Identificador anónimo persistente (nunca un dato personal) — solo sirve para que el backend
// cuente "visitantes únicos" vs. "visitas totales". Si la persona luego inicia sesión, el mismo
// id se sigue mandando junto con el token (ver fetchAuth), así el backend puede asociar ambos.
function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'sin-id'
  }
}

function detectarDispositivo() {
  return /Mobi|Android/i.test(navigator.userAgent) ? 'movil' : 'escritorio'
}

// Igual que registrarEvento (eventoService): nunca debe bloquear ni ensuciar la UI si falla.
// Modelo "opt-out": se cuenta por defecto (analítica anónima, no identifica a la persona) salvo
// que haya rechazado explícitamente en el banner (ver CookieConsentBanner) — nunca se bloquea
// el conteo solo por no haber respondido todavía.
export async function registrarVisita(tipo, entidadTipo = null, entidadId = null) {
  if (getConsent() === 'rejected') return
  try {
    await fetchAuth('/visitas', {
      method: 'POST',
      body: JSON.stringify({
        visitor_id: getVisitorId(),
        tipo,
        entidad_tipo: entidadTipo,
        entidad_id: entidadId,
        ruta: window.location.pathname,
        dispositivo: detectarDispositivo(),
      }),
    })
  } catch {
    // Silencioso
  }
}
