import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authService } from '../../../services/authService'
import { useAuth } from '../../../context/AuthContext'
import { stretchGoogleButton } from '../../../utils/googleButton'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function TermsText() {
  return (
    <p className="text-center text-xs text-gray-400 leading-relaxed">
      Al continuar aceptas los{' '}
      <a href="https://www.calzacaribe.com/terminos" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">Términos de uso</a>
      {' '}y la{' '}
      <a href="https://www.calzacaribe.com/privacidad" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">Política de privacidad</a>.
    </p>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'
  const { login } = useAuth()

  const [view, setView] = useState('social')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const googleVisibleBtnRef = useRef(null)
  const googleRealBtnRef = useRef(null)

  const success = useCallback((data) => {
    login(data)
    navigate(from, { replace: true })
  }, [login, navigate, from])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      success(data)
    } catch (err) {
      if (err.status === 409 && err.data?.message === 'USE_GOOGLE') {
        setError('Esta cuenta usa Google. Inicia sesión con Google.')
      } else {
        setError('Correo o contraseña incorrectos')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleCredential = useCallback(async (response) => {
    setGoogleLoading(true)
    setError('')
    try {
      const data = await authService.googleLogin(response.credential)
      success(data)
    } catch (err) {
      if (err.status === 409 && err.data?.message === 'USE_PASSWORD') {
        setError('Esta cuenta usa contraseña. Usa el formulario de correo.')
      } else {
        setError('No se pudo iniciar sesión con Google. Intenta de nuevo.')
      }
      setGoogleLoading(false)
    }
  }, [success])

  // Renderiza el botón real de Google (invisible) superpuesto sobre el botón con
  // nuestro propio diseño: un renderButton() disparado por gesto real del usuario
  // no depende de sesión activa en el navegador, a diferencia de prompt() (One Tap),
  // que falla con "opt_out_or_no_session" si no hay sesión de Google abierta.
  useEffect(() => {
    let cancelled = false
    let retryTimeoutId
    let renderFn

    const setup = () => {
      if (cancelled) return
      if (!window.google || !googleRealBtnRef.current || !googleVisibleBtnRef.current) {
        retryTimeoutId = setTimeout(setup, 200)
        return
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
      })
      renderFn = () => {
        if (!googleRealBtnRef.current || !googleVisibleBtnRef.current) return
        googleRealBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleRealBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: googleVisibleBtnRef.current.offsetWidth,
        })
        // Google inserta su propio div + iframe con tamaño fijo en píxeles (no
        // ocupan el 100% del contenedor por su cuenta), así que solo esa zona
        // quedaba clicable. Forzamos que todo lo inyectado cubra el contenedor.
        stretchGoogleButton(googleRealBtnRef.current)
      }
      renderFn()
      window.addEventListener('resize', renderFn)
    }
    setup()

    return () => {
      cancelled = true
      clearTimeout(retryTimeoutId)
      if (renderFn) window.removeEventListener('resize', renderFn)
    }
  }, [handleGoogleCredential])

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Imagen lateral */}
      <div className="flex-1 hidden md:block overflow-hidden">
        <img
          src="/img/imagen-login-calzacaribe.webp"
          alt="Calzacaribe"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-[470px] bg-white flex items-center justify-center overflow-y-auto px-10 py-12 border-l border-gray-100">
        <div className="w-full max-w-[380px] flex flex-col gap-6">

          {/* Logo */}
          <div className="flex justify-center">
            <img src="/logos/imagotico-calzacaribe.svg" alt="Calzacaribe" className="h-14" style={{ filter: 'invert(1)' }} />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Panel: social */}
          {view === 'social' && (
            <>
              <h2 className="text-center text-2xl font-bold text-black">Iniciar sesión</h2>
              <div className="space-y-3">
                <div className="relative w-full h-[54px]">
                  <button
                    ref={googleVisibleBtnRef}
                    type="button"
                    tabIndex={-1}
                    disabled={googleLoading}
                    className="w-full h-[54px] border border-gray-200 text-[15px] font-semibold text-black bg-white hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 pointer-events-none"
                  >
                    {googleLoading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
                    Continuar con Google
                  </button>
                  <div
                    ref={googleRealBtnRef}
                    className="absolute inset-0 z-10 overflow-hidden opacity-0 [&_iframe]:!w-full [&_iframe]:!h-full"
                  />
                </div>
                <button
                  onClick={() => setView('email')}
                  className="w-full h-[54px] border border-gray-200 text-[15px] font-semibold text-black bg-white hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center active:scale-[0.98]"
                >
                  Continuar con correo
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="font-bold text-black hover:underline">Regístrate</Link>
              </p>
              <TermsText />
            </>
          )}

          {/* Panel: email */}
          {view === 'email' && (
            <>
              <h2 className="text-center text-2xl font-bold text-black">Iniciar sesión</h2>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs text-gray-500 hover:text-black transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'} required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full h-[54px] bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" />Ingresando…</> : 'Ingresar'}
                </button>
              </form>
              <div className="text-center space-y-2 text-sm">
                <p className="text-gray-500">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="font-bold text-black hover:underline">Regístrate</Link>
                </p>
                <button onClick={() => setView('social')} className="text-xs text-gray-400 hover:text-black transition-colors">
                  ← Volver
                </button>
              </div>
              <TermsText />
            </>
          )}

          {/* Panel: forgot password */}
          {view === 'forgot' && <ForgotInline onBack={() => setView('email')} />}

        </div>
      </div>
    </div>
  )
}

function ForgotInline({ onBack }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      setError('No se pudo enviar el código. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <>
        <h2 className="text-center text-2xl font-bold text-black">Código enviado</h2>
        <p className="text-center text-sm text-gray-500">
          Si el correo existe, recibirás un código en los próximos minutos.
        </p>
        <button
          onClick={() => navigate('/restablecer')}
          className="w-full h-[54px] bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors"
        >
          Ingresar código
        </button>
        <button onClick={onBack} className="text-xs text-gray-400 hover:text-black transition-colors text-center">
          ← Volver al login
        </button>
      </>
    )
  }

  return (
    <>
      <h2 className="text-center text-2xl font-bold text-black">Olvidé mi contraseña</h2>
      <p className="text-center text-sm text-gray-500">
        Te enviaremos un código de 6 dígitos para restablecerla.
      </p>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 text-center">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
        />
        <button
          type="submit" disabled={loading}
          className="w-full h-[54px] bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" />Enviando…</> : 'Enviar código'}
        </button>
      </form>
      <button onClick={onBack} className="text-xs text-gray-400 hover:text-black transition-colors text-center">
        ← Volver al login
      </button>
    </>
  )
}
