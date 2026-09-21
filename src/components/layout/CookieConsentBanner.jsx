import { useEffect, useState } from 'react'
import { getConsent, setConsent } from '../../services/cookieConsent'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getConsent() === null)
  }, [])

  if (!visible) return null

  function elegir(valor) {
    setConsent(valor)
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-black text-white px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-300 max-w-2xl">
        Usamos almacenamiento local para analizar el tráfico del sitio y mejorar tu experiencia.
        Puedes desactivarlo cuando quieras.
      </p>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => elegir('rejected')}
          className="px-4 py-2 border border-gray-500 text-gray-100 text-sm hover:bg-gray-900"
        >
          Desactivar
        </button>
        <button
          onClick={() => elegir('accepted')}
          className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-200"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
