import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import FormInput from '../../../components/ui/FormInput'
import FormField from '../../../components/ui/FormField'

const IMG_URL = '/login/imagen-login-calzacaribe.webp'

/* ── Botón de opción (social / email) ─────────────────── */
function OptionBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[58px] border border-gray-200 rounded-xl text-[15px] font-semibold text-black bg-white hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 active:scale-[0.98]"
    >
      {children}
    </button>
  )
}

/* ── Texto de términos y política (reutilizado en los 3 paneles) ── */
function TermsText() {
  return (
    <p className="text-center text-xs text-gray-400 leading-relaxed mt-6">
      Al continuar, aceptas los{' '}
      <a href="https://calzacaribe.netlify.app/terminos" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">
        Términos de uso
      </a>{' '}
      y la{' '}
      <a href="https://calzacaribe.netlify.app/privacidad" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:underline">
        Política de privacidad
      </a>{' '}
      de Calzacaribe.
    </p>
  )
}

/* ── Iconos de proveedores ───────────────────────────── */
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

/* ══════════════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════════════ */

export default function LoginPage() {
  const navigate = useNavigate()
  const [view, setView]         = useState('social') // 'social' | 'email' | 'register'
  const [showPass, setShowPass] = useState(false)

  const handleLogin = () => navigate('/', { replace: true })

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">

      {/* ── Lado imagen ───────────────────────────── */}
      <div className="flex-1 hidden md:block overflow-hidden">
        <img
          src={IMG_URL}
          alt="Calzacaribe"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* ── Lado formulario ───────────────────────── */}
      <div className="w-full md:w-[470px] bg-white flex items-center justify-center overflow-y-auto px-10 py-12 border-l border-gray-100">
        <div className="w-full max-w-[380px]">

          {/* Logo — invertido para fondo blanco */}
          <div className="flex justify-center mb-14">
            <img
              src="/logos/imagotico-calzacaribe.svg"
              alt="Calzacaribe"
              className="h-14"
              style={{ filter: 'invert(1)' }}
            />
          </div>

          {/* ══ Panel: Login social ══ */}
          {view === 'social' && (
            <div>
              <h2 className="text-center text-2xl font-bold text-black mb-9">
                Iniciar sesión
              </h2>

              <div className="space-y-3 mb-7">
                <OptionBtn onClick={handleLogin}>
                  <GoogleIcon /> Continuar con Google
                </OptionBtn>
                <OptionBtn onClick={() => setView('email')}>
                  Continuar con correo
                </OptionBtn>
              </div>

              <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setView('register')}
                  className="font-bold text-black hover:underline"
                >
                  Regístrate
                </button>
              </p>

              <TermsText />
            </div>
          )}

          {/* ══ Panel: Login email ══ */}
          {view === 'email' && (
            <div>
              <h2 className="text-center text-2xl font-bold text-black mb-9">
                Iniciar sesión
              </h2>

              <div className="space-y-5 mb-5">
                <FormField label="Correo electrónico">
                  <FormInput type="email" placeholder="correo@ejemplo.com" />
                </FormField>

                <FormField label="Contraseña">
                  <div className="relative">
                    <FormInput
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormField>
              </div>

              <label className="flex items-center gap-3 mb-7 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-black flex-shrink-0" />
                <span className="text-sm text-gray-500">Mantener sesión iniciada</span>
              </label>

              <button
                onClick={handleLogin}
                className="w-full h-[58px] bg-accent text-white text-xl font-black rounded-xl mb-7 hover:bg-accent-dark transition-colors active:scale-[0.98]"
              >
                Ingresar
              </button>

              <div className="text-center space-y-3 text-sm">
                <p>
                  <button className="font-bold text-black hover:underline">
                    Olvidé mi contraseña
                  </button>
                </p>
                <p className="text-gray-500">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => setView('register')}
                    className="font-bold text-black hover:underline"
                  >
                    Regístrate
                  </button>
                </p>
                <p>
                  <button
                    onClick={() => setView('social')}
                    className="text-gray-400 text-xs hover:text-black transition-colors"
                  >
                    ← Volver
                  </button>
                </p>
              </div>

              <TermsText />
            </div>
          )}

          {/* ══ Panel: Registro ══ */}
          {view === 'register' && (
            <div>
              <h2 className="text-center text-2xl font-bold text-black mb-9">
                Crear cuenta
              </h2>

              <div className="space-y-3 mb-7">
                <OptionBtn onClick={handleLogin}>
                  <GoogleIcon /> Continuar con Google
                </OptionBtn>
                <OptionBtn onClick={handleLogin}>
                  Continuar con correo
                </OptionBtn>
              </div>

              <label className="flex items-center gap-3 mb-7 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-black flex-shrink-0" />
                <span className="text-sm text-gray-500">No deseo recibir promociones.</span>
              </label>

              <p className="text-center text-sm text-gray-500 mb-1">
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => setView('social')}
                  className="font-bold text-black hover:underline"
                >
                  Inicia sesión
                </button>
              </p>

              <TermsText />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
