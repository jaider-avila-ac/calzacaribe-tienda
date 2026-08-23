// Google bloquea activamente "Continuar con Google" dentro de navegadores embebidos
// (el WebView que abre Instagram/Facebook/WhatsApp/TikTok/LinkedIn cuando el cliente toca
// un link ahí en vez de abrirlo en Chrome/Safari) — lo detecta por user-agent y rechaza el
// login ("disallowed_useragent"), a veces mostrando una pantalla en blanco o un popup vacío
// en vez de un error claro. Sin esta detección, el botón se ve normal pero nunca termina de
// cargar en esos casos — confuso para quien lo prueba desde un link de WhatsApp/Instagram en
// el celular. Se detecta antes de intentar el flujo, para avisar en vez de dejarlo colgado.
const IN_APP_BROWSER_PATTERNS = [
  /Instagram/i,
  /FBAN|FBAV|FB_IAB|FBSV/i,      // Facebook / Messenger
  /\bLine\//i,                    // LINE
  /MicroMessenger/i,              // WeChat
  /TikTok|musical_ly|BytedanceWebview/i,
  /LinkedInApp/i,
  /Twitter/i,
  /\bWhatsApp\//i,
]

export function isInAppBrowser() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
  return IN_APP_BROWSER_PATTERNS.some((re) => re.test(ua))
}
