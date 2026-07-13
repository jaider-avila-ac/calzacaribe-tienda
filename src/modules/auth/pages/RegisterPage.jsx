import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authService } from '../../../services/authService'
import { useAuth } from '../../../context/AuthContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function capitalizeWords(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es-CO')
    .replace(/(^|\s)(\S)/g, (_, space, letter) => `${space}${letter.toLocaleUpperCase('es-CO')}`)
}

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

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const normalizedEmail = email.trim()
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  const canSubmit =
    nombre.trim().length > 0 &&
    isEmailValid &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!canSubmit) return
    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }
    setLoading(true)
    try {
      await authService.register(
        normalizedEmail,
        password,
        capitalizeWords(nombre),
        capitalizeWords(apellido),
        numeroDocumento.trim(),
      )
      navigate('/verificar', { state: { email: normalizedEmail } })
    } catch (err) {
      if (err.status === 409) {
        if (err.data?.message === 'CODE_PENDING') {
          navigate('/verificar', { state: { email: normalizedEmail } })
        } else {
          setError('Este correo ya está registrado.')
        }
      } else {
        setError('No se pudo crear la cuenta. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = useCallback(() => {
    if (!window.google) {
      setError('Google no disponible. Recarga la página.')
      return
    }
    setGoogleLoading(true)
    setError('')
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const data = await authService.googleLogin(response.credential)
          login(data)
          navigate('/', { replace: true })
        } catch (err) {
          if (err.status === 409 && err.data?.message === 'USE_PASSWORD') {
            setError('Esta cuenta usa contraseña. Ve a iniciar sesión.')
          } else {
            setError('No se pudo continuar con Google. Intenta de nuevo.')
          }
          setGoogleLoading(false)
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    })
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const reason = notification.getNotDisplayedReason?.() ?? notification.getSkippedReason?.()
        console.warn('[Google Sign-In] no se mostró el selector de cuentas:', reason)
        setError('No se pudo mostrar el inicio de sesión de Google en este dominio.')
        setGoogleLoading(false)
      }
    })
  }, [login, navigate])

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Imagen lateral */}
      <div className="flex-1 hidden md:block overflow-hidden">
        <img
          src="/login/imagen-login-calzacaribe.webp"
          alt="Calzacaribe"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-[470px] bg-white flex items-center justify-center overflow-y-auto px-10 py-12 border-l border-gray-100">
        <div className="w-full max-w-[380px] flex flex-col gap-5">

          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img src="/logos/imagotico-calzacaribe.svg" alt="Calzacaribe" className="h-14" style={{ filter: 'invert(1)' }} />
          </div>

          <h2 className="text-center text-2xl font-bold text-black">Crear cuenta</h2>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nombre</label>
                <input
                  type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Apellido</label>
                <input
                  type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
                  placeholder="Pérez"
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Número de cédula <span className="normal-case font-normal text-gray-400">(opcional)</span>
              </label>
              <input
                type="text" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Si compraste antes en tienda física, úsala para ver tu historial"
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Correo electrónico</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Repetir contrasena</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Escribe la contrasena otra vez"
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading || !canSubmit}
              className="w-full h-[54px] bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" />Registrando…</> : 'Crear cuenta'}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogleSignIn} disabled={googleLoading}
            className="w-full h-[54px] border border-gray-200 text-[15px] font-semibold text-black bg-white hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60"
          >
            {googleLoading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
            Continuar con Google
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold text-black hover:underline">Iniciar sesión</Link>
          </p>

          <p className="text-center text-xs text-gray-400 leading-relaxed">
            Al registrarte aceptas nuestros{' '}
            <a href="https://www.calzacaribe.com/terminos" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">Términos de uso</a>
            {' '}y la{' '}
            <a href="https://www.calzacaribe.com/privacidad" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">Política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
