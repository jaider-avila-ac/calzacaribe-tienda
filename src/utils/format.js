export const fmt = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

export const discountedPrice = (precio, descuento) =>
  descuento > 0 ? Math.round(precio * (1 - descuento / 100)) : precio
