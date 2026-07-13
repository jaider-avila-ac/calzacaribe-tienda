import { Instagram, Facebook, MessageCircle, MapPin, Phone } from 'lucide-react'

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
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-all" aria-label={label}>
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
