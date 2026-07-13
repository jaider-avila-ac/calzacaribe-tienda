// Google Identity Services inserta su propio div + iframe con tamaño fijo en
// píxeles al llamar a renderButton(), sin ocupar el 100% del contenedor por su
// cuenta. Cuando ese botón se usa como overlay invisible sobre un botón con
// diseño propio, solo esa zona fija queda clicable. Esto fuerza que todo lo
// que Google inyecta cubra el 100% del contenedor.
export function stretchGoogleButton(container) {
  container.querySelectorAll('div, iframe').forEach((el) => {
    el.style.width = '100%'
    el.style.height = '100%'
  })
}
