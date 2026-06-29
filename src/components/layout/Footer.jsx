import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src="/logos/imagotico-calzacaribe.svg" alt="Calzacaribe" className="h-8" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino de moda en el Caribe colombiano. Calzado, ropa y accesorios para toda la familia.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/calzacaribe_baq/', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all" aria-label={label}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Categorías</h3>
            <ul className="space-y-2">
              {[
                { label: 'Mujer', path: '/catalogo?categoria=1' },
                { label: 'Hombre', path: '/catalogo?categoria=2' },
                { label: 'Niños', path: '/catalogo?categoria=3' },
                { label: 'Ropa', path: '/catalogo?categoria=4' },
                { label: 'Sandalias', path: '/catalogo?categoria=5' },
                { label: 'Ofertas', path: '/catalogo?descuento=true' },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-gray-400 hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Información</h3>
            <ul className="space-y-2">
              {[
                { label: 'Política de cambios',    href: 'https://calzacaribe.netlify.app/cambios'    },
                { label: 'Guía de tallas',         href: 'https://calzacaribe.netlify.app/tallas'     },
                { label: 'Términos y condiciones', href: 'https://calzacaribe.netlify.app/terminos'   },
                { label: 'Política de privacidad', href: 'https://calzacaribe.netlify.app/privacidad' },
                { label: 'Preguntas frecuentes',   href: 'https://calzacaribe.netlify.app/faq'        },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-accent transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Contacto</h3>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: 'Barranquilla, Colombia' },
                { icon: Phone, text: '+57 315 555 0001' },
                { icon: Mail, text: 'ventas@calzacaribe.co' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-accent flex-shrink-0" />{text}
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3">
              <p className="text-xs text-gray-400">Horario de atención</p>
              <p className="text-sm font-semibold text-white mt-0.5">Lun–Sáb 8am–6pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© 2025 Calzacaribe. Todos los derechos reservados.</p>
          <p className="text-xs text-gray-600">
            Desarrollado por{' '}
            <a href="https://brandingcol.com/" target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors">
              BrandingCol | Jaider Avila
            </a>
          </p>
          <div className="flex items-center gap-3">
            {['Nequi', 'PSE', 'Visa', 'Mastercard'].map((p) => (
              <span key={p} className="text-xs px-2 py-1 text-gray-400 font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
