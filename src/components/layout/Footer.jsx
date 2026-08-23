import { Instagram, Facebook, MapPin, Phone } from 'lucide-react'

// lucide-react no trae el logo real de WhatsApp (su MessageCircle es una burbuja genérica,
// sin la silueta del teléfono) — mismo SVG que ya usa el footer del sitio-web.
function IconWhatsApp({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/logos/imagotico-calzacaribe.svg" alt="Calzacaribe" className="h-8" />
            </div>
            <p className="text-white text-sm leading-relaxed">
              Tu destino de moda en el Caribe colombiano. Calzado, ropa y accesorios para toda la familia.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/calzacaribe_baq/', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: IconWhatsApp, href: 'https://wa.me/573015097013', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-all" aria-label={label}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Información</h3>
            <ul className="space-y-2">
              {[
                { label: 'Política de cambios', href: 'https://www.calzacaribe.com/cambios' },
                { label: 'Guía de tallas', href: 'https://www.calzacaribe.com/tallas' },
                { label: 'Términos y condiciones', href: 'https://www.calzacaribe.com/terminos' },
                { label: 'Política de privacidad', href: 'https://www.calzacaribe.com/privacidad' },
                { label: 'Preguntas frecuentes', href: 'https://www.calzacaribe.com/faq' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:underline transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Contacto</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide mb-1.5">Sede Las Nieves</p>
                <a href="https://wa.me/573015097013" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white hover:underline transition-colors">
                  <Phone size={14} className="text-white flex-shrink-0" />301 509 7013
                </a>
                <p className="flex items-start gap-2 text-sm text-white mt-1.5">
                  <MapPin size={14} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Calle 26 No. 17B-25 Las Nieves, Barranquilla</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide mb-1.5">Sede La Paz</p>
                <a href="https://wa.me/573044616737" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white hover:underline transition-colors">
                  <Phone size={14} className="text-white flex-shrink-0" />304 461 6737
                </a>
                <p className="flex items-start gap-2 text-sm text-white mt-1.5">
                  <MapPin size={14} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Carrera 13 No. 99B-85 Barrio La Paz, Barranquilla</span>
                </p>
              </div>
            </div>
            <div className="mt-5 p-3">
              <p className="text-xs text-white">Horario de atención</p>
              <p className="text-sm font-semibold text-white mt-0.5">Lun–Sáb 8am–6pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white">© 2026 Calzacaribe. Todos los derechos reservados.</p>
          <p className="text-xs text-white">
            Desarrollado por{' '}
            <a href="https://brandingcol.com/" target="_blank" rel="noopener noreferrer"
              className="hover:underline transition-colors">
              BrandingCol | Jaider Avila
            </a>
          </p>
          <div className="flex items-center gap-3">
            {['Nequi', 'PSE', 'Visa', 'Mastercard'].map((p) => (
              <span key={p} className="text-xs px-2 py-1 text-white font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
