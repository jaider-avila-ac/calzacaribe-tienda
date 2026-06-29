import { Link } from 'react-router-dom'
import categoriesData from '../../../data/categories.json'

export default function CategoryGrid() {
  return (
    <section className="container-main py-12 md:py-16">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <h2 className="section-title">Categorías</h2>
        <Link to="/catalogo" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors underline underline-offset-2">
          Ver todo
        </Link>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:pb-0">
        {categoriesData.map((cat) => (
          <Link
            key={cat.id}
            to={`/catalogo?categoria=${cat.id}`}
            className="group flex-shrink-0 w-28 md:w-auto"
          >
            <div className={`relative overflow-hidden rounded-2xl aspect-square mb-2 md:mb-3 ${cat.color} flex items-center justify-center`}>
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
              />
              <span className="relative text-3xl md:text-4xl">{cat.emoji}</span>
            </div>
            <p className="text-center text-xs md:text-sm font-bold text-black group-hover:text-gray-600 transition-colors">{cat.nombre}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
