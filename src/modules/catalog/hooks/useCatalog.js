import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../../../services/productService'

export function useCatalog() {
  const [params, setParams] = useSearchParams()

  const categoriaId   = params.get('categoria')   ? Number(params.get('categoria')) : null
  const subcategoria  = params.get('subcategoria') ?? ''
  const genero        = params.get('genero')       ?? ''
  const etiqueta      = params.get('etiqueta')     ?? ''
  const soloDescuento = params.get('descuento') === 'true'
  const sort          = params.get('sort')         ?? 'relevancia'

  const filtered = useMemo(() => {
    let list = getProducts()

    if (categoriaId)   list = list.filter((p) => p.categoriaId === categoriaId)
    if (subcategoria)  list = list.filter((p) => p.subcategoria === subcategoria)
    if (genero)        list = list.filter((p) => p.genero === genero)
    if (etiqueta)      list = list.filter((p) => p.etiquetas.includes(etiqueta))
    if (soloDescuento) list = list.filter((p) => p.descuento > 0)

    if (sort === 'precio-asc')   list = [...list].sort((a, b) => a.precio - b.precio)
    else if (sort === 'precio-desc') list = [...list].sort((a, b) => b.precio - a.precio)
    else if (sort === 'nombre')      list = [...list].sort((a, b) => a.nombre.localeCompare(b.nombre))
    else if (sort === 'descuento')   list = [...list].sort((a, b) => b.descuento - a.descuento)

    return list
  }, [categoriaId, subcategoria, genero, etiqueta, soloDescuento, sort])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  const clearFilters = () => setParams({})

  return { filtered, params, setFilter, clearFilters, sort, categoriaId, soloDescuento }
}
