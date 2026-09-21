import { useState, useRef, useEffect } from 'react'
import { Share2, Instagram, Link as LinkIcon, Check } from 'lucide-react'

function WhatsAppIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// Instagram no ofrece (a propósito, para uso de terceros en la web) un enlace tipo wa.me que
// abra directo un mensaje o historia con contenido precargado — por eso acá se copia el texto
// al portapapeles y se abre Instagram para que la persona lo pegue donde quiera.
export default function ShareMenu({ titulo, url }) {
  const [abierto, setAbierto] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function onClickFuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    return () => document.removeEventListener('mousedown', onClickFuera)
  }, [])

  const texto = `${titulo}\n${url}`

  function avisar(texto) {
    setMensaje(texto)
    setTimeout(() => setMensaje(''), 2500)
  }

  function compartirWhatsapp() {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
    setAbierto(false)
  }

  async function compartirInstagram() {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      // Portapapeles no disponible — igual se abre Instagram
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
    setAbierto(false)
    avisar('Enlace copiado — pégalo en tu historia o mensaje de Instagram')
  }

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(url)
      avisar('Enlace copiado')
    } catch {
      avisar('No se pudo copiar el enlace')
    }
    setAbierto(false)
  }

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:border-accent hover:text-black transition-all"
      >
        <Share2 size={16} />
        Compartir
      </button>

      {abierto && (
        <div className="absolute z-20 bottom-full mb-2 left-0 right-0 bg-white border-2 border-gray-200 shadow-lg">
          <button type="button" onClick={compartirWhatsapp}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
            <WhatsAppIcon className="w-4 h-4 text-green-500" />
            Compartir por WhatsApp
          </button>
          <button type="button" onClick={compartirInstagram}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
            <Instagram size={16} className="text-pink-500" />
            Compartir por Instagram
          </button>
          <button type="button" onClick={copiarEnlace}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
            <LinkIcon size={16} />
            Copiar enlace
          </button>
        </div>
      )}

      {mensaje && (
        <p className="absolute z-20 bottom-full mb-2 left-0 right-0 bg-black text-white text-xs text-center px-3 py-2 flex items-center justify-center gap-1.5">
          <Check size={13} /> {mensaje}
        </p>
      )}
    </div>
  )
}
