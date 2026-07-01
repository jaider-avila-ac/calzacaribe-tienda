import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { fmt, discountedPrice } from '../../utils/format'

export default function ProductCard({ product }) {
  const { id, nombre, marca, imagenes, precio, descuento, etiquetas, tallas } = product
  const finalPrice = discountedPrice(precio, descuento)
  const isNew     = etiquetas?.includes('nuevo')
  const hasStock  = tallas?.some((t) => t.stock > 0) ?? true
  const rating    = (3.8 + (id % 7) * 0.2).toFixed(1)
  const reviews   = 12 + (id % 38)

  return (
    <Link
      to={`/producto/${id}`}
      className="group block bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Imagen */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={imagenes?.[0]?.url ?? imagenes?.[0] ?? 'https://placehold.co/300x300/f5f5f5/999?text=Calzacaribe'}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {descuento > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{descuento}%
          </span>
        )}

        {isNew && !descuento && (
          <span className="absolute top-2 left-2 bg-black text-accent text-[10px] font-bold px-1.5 py-0.5 rounded">
            NUEVO
          </span>
        )}

        {!hasStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{marca}</p>

        <h3 className="text-xs font-medium text-gray-800 mt-0.5 line-clamp-2 leading-snug group-hover:text-black transition-colors">
          {nombre}
        </h3>

        <div className="flex items-center gap-1 mt-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={9}
              className={n <= Math.round(Number(rating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-0.5">({reviews})</span>
        </div>

        <div className="mt-2">
          {descuento > 0 ? (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <p className="text-sm font-black text-accent">{fmt(finalPrice)}</p>
              <p className="text-[10px] text-gray-400 line-through">{fmt(precio)}</p>
            </div>
          ) : (
            <p className="text-sm font-black text-black">{fmt(finalPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
