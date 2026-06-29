import { useState } from 'react'
import { Check, Eye, EyeOff, AlertCircle, Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import {
  getProfile, saveProfile,
  getDirecciones, addDireccion, updateDireccion, deleteDireccion,
} from '../../../services/profileService'
import FormInput from '../../../components/ui/FormInput'
import FormSelect from '../../../components/ui/FormSelect'
import FormField from '../../../components/ui/FormField'

const TIPOS_DOC = ['CC', 'CE', 'TI', 'NIT', 'Pasaporte']

const DEPARTAMENTOS = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá','Caldas',
  'Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca',
  'Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño',
  'Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia',
  'Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada',
]

/* ── Helpers ─────────────────────────────────────────────── */

function useSectionSave() {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = (data, validate) => {
    const err = validate?.(data)
    if (err) { setError(err); return false }
    setError('')
    saveProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    return true
  }

  return { saved, error, setError, handleSave }
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <h2 className="text-sm font-black text-black uppercase tracking-widest mb-5">{title}</h2>
      {children}
    </div>
  )
}

function SaveButton({ saved }) {
  return (
    <button
      type="submit"
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
        saved ? 'bg-accent-dark text-white' : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {saved ? <><Check size={15} /> Guardado</> : 'Guardar cambios'}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════
   SECCIÓN: Información personal
═══════════════════════════════════════════════════════════ */

function PersonalSection({ profile, setProfile }) {
  const { saved, error, handleSave } = useSectionSave()
  const [form, setForm] = useState({
    nombre:          profile.nombre,
    apellido:        profile.apellido,
    email:           profile.email,
    telefono:        profile.telefono,
    tipoDocumento:   profile.tipoDocumento,
    numeroDocumento: profile.numeroDocumento,
  })

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const ok = handleSave(form, (d) => {
      if (!d.nombre.trim())   return 'El nombre es obligatorio'
      if (!d.apellido.trim()) return 'El apellido es obligatorio'
      if (d.email && !/\S+@\S+\.\S+/.test(d.email)) return 'Correo no válido'
      if (d.telefono && !/^\+?[\d\s\-()]{7,15}$/.test(d.telefono)) return 'Teléfono no válido'
      if (d.numeroDocumento && !/^[\d\-A-Za-z]{4,20}$/.test(d.numeroDocumento.trim())) return 'Número de documento no válido'
    })
    if (ok) setProfile((p) => ({ ...p, ...form }))
  }

  return (
    <SectionCard title="Información personal">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nombre">
            <FormInput value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre" />
          </FormField>
          <FormField label="Apellido">
            <FormInput value={form.apellido} onChange={set('apellido')} placeholder="Tu apellido" />
          </FormField>
          <FormField label="Correo electrónico">
            <FormInput value={form.email} onChange={set('email')} type="email" placeholder="correo@ejemplo.com" />
          </FormField>
          <FormField label="Teléfono / Celular">
            <FormInput value={form.telefono} onChange={set('telefono')} placeholder="+57 300 000 0000" />
          </FormField>
          <FormField label="Tipo de documento">
            <FormSelect value={form.tipoDocumento} onChange={set('tipoDocumento')}>
              {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
            </FormSelect>
          </FormField>
          <FormField label="Número de documento">
            <FormInput value={form.numeroDocumento} onChange={set('numeroDocumento')} placeholder="1234567890" />
          </FormField>
        </div>
        {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        <div className="flex justify-end pt-1"><SaveButton saved={saved} /></div>
      </form>
    </SectionCard>
  )
}

/* ══════════════════════════════════════════════════════════
   FORMULARIO de dirección (reutilizado en agregar/editar)
═══════════════════════════════════════════════════════════ */

const ADDR_EMPTY = {
  direccion: '', complemento: '', departamento: '', municipio: '',
  barrio: '', apartamento: '', contactoNombre: '', contactoTelefono: '',
}

function DireccionForm({ inicial = ADDR_EMPTY, onSave, onCancel }) {
  const [form, setForm] = useState(inicial)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.direccion.trim())        { setError('La dirección es obligatoria'); return }
    if (!form.departamento)            { setError('Selecciona un departamento'); return }
    if (!form.municipio.trim())        { setError('El municipio es obligatorio'); return }
    if (!form.barrio.trim())           { setError('El barrio es obligatorio'); return }
    if (!form.contactoNombre.trim())   { setError('El nombre de contacto es obligatorio'); return }
    if (!form.contactoTelefono.trim()) { setError('El teléfono de contacto es obligatorio'); return }
    setError('')
    onSave(form)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-2">

      <FormField label="Dirección o lugar de entrega">
        <FormInput value={form.direccion} onChange={set('direccion')} placeholder="Ej: Carrera 71d #1-14 Sur" />
      </FormField>

      <FormField label="Complemento (opcional)">
        <FormInput value={form.complemento} onChange={set('complemento')} placeholder="Sin complemento" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Departamento">
          <FormSelect value={form.departamento} onChange={set('departamento')}>
            <option value="">Selecciona un departamento</option>
            {DEPARTAMENTOS.map((d) => <option key={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Municipio / Localidad">
          <FormInput value={form.municipio} onChange={set('municipio')} placeholder="Bogotá" />
        </FormField>
        <FormField label="Barrio">
          <FormInput value={form.barrio} onChange={set('barrio')} placeholder="Kennedy" />
        </FormField>
        <FormField label="Apartamento / Casa (opcional)">
          <FormInput value={form.apartamento} onChange={set('apartamento')} placeholder="Ej: 201" />
        </FormField>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Datos de contacto</p>
        <p className="text-xs text-gray-400 mb-3">Te llamaremos si hay un problema con la entrega.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nombre y apellido">
            <FormInput value={form.contactoNombre} onChange={set('contactoNombre')} placeholder="Juan Pérez" />
          </FormField>
          <FormField label="Teléfono">
            <div className="flex">
              <span className="flex items-center px-3 border border-gray-200 border-r-0 rounded-l-xl bg-gray-50 text-sm text-gray-500 flex-shrink-0">
                +57
              </span>
              <FormInput
                value={form.contactoTelefono}
                onChange={set('contactoTelefono')}
                placeholder="310 2144184"
                className="rounded-l-none border-l-0"
              />
            </div>
          </FormField>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}

      <div className="flex items-center gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-gray-400 hover:text-black transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-gray-800 transition-colors active:scale-95"
        >
          <Check size={15} /> Guardar dirección
        </button>
      </div>
    </form>
  )
}

/* ══════════════════════════════════════════════════════════
   SECCIÓN: Direcciones de envío
═══════════════════════════════════════════════════════════ */

function DireccionesSection() {
  const [direcciones, setDirecciones] = useState(() => getDirecciones())
  const [modo, setModo] = useState(null)

  const handleAdd  = (data) => { setDirecciones(addDireccion(data));            setModo(null) }
  const handleEdit = (id, data) => { setDirecciones(updateDireccion(id, data)); setModo(null) }
  const handleDelete = (id) => {
    setDirecciones(deleteDireccion(id))
    if (modo?.id === id) setModo(null)
  }

  return (
    <SectionCard title="Direcciones de envío">

      {direcciones.length > 0 && (
        <div className="space-y-3 mb-4">
          {direcciones.map((d) => {
            if (modo?.id === d.id) {
              return (
                <div key={d.id} className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-black text-black uppercase tracking-widest mb-3">Editar dirección</p>
                  <DireccionForm
                    inicial={d}
                    onSave={(data) => handleEdit(d.id, data)}
                    onCancel={() => setModo(null)}
                  />
                </div>
              )
            }
            return (
              <div key={d.id} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black leading-snug">
                    {d.direccion}{d.apartamento ? `, Apto ${d.apartamento}` : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[d.barrio, d.municipio, d.departamento].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {d.contactoNombre} · +57 {d.contactoTelefono}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setModo({ id: d.id })}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-white transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {direcciones.length === 0 && modo !== 'agregar' && (
        <p className="text-sm text-gray-400 mb-4">Aún no tienes direcciones guardadas.</p>
      )}

      {modo === 'agregar' && (
        <div className="border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-xs font-black text-black uppercase tracking-widest mb-3">Nueva dirección</p>
          <DireccionForm onSave={handleAdd} onCancel={() => setModo(null)} />
        </div>
      )}

      {modo !== 'agregar' && (
        <button
          onClick={() => setModo('agregar')}
          className="flex items-center gap-2 text-sm font-bold text-black hover:underline"
        >
          <Plus size={15} /> Agregar dirección
        </button>
      )}
    </SectionCard>
  )
}

/* ══════════════════════════════════════════════════════════
   SECCIÓN: Seguridad
═══════════════════════════════════════════════════════════ */

function ContrasenaSection() {
  const { saved, error, setError, handleSave } = useSectionSave()
  const [form, setForm]   = useState({ actual: '', nueva: '', confirmar: '' })
  const [show, setShow]   = useState({ actual: false, nueva: false, confirmar: false })

  const set    = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const toggle = (k) => () => setShow((p) => ({ ...p, [k]: !p[k] }))

  const onSubmit = (e) => {
    e.preventDefault()
    const ok = handleSave({ contrasena: form.nueva }, () => {
      if (!form.actual)                  return 'Ingresa tu contraseña actual'
      if (form.nueva.length < 8)         return 'La nueva contraseña debe tener al menos 8 caracteres'
      if (form.nueva !== form.confirmar) return 'Las contraseñas no coinciden'
    })
    if (ok) setForm({ actual: '', nueva: '', confirmar: '' })
  }

  return (
    <SectionCard title="Seguridad">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'actual',    label: 'Contraseña actual'    },
            { key: 'nueva',     label: 'Nueva contraseña'     },
            { key: 'confirmar', label: 'Confirmar contraseña' },
          ].map(({ key, label }) => (
            <FormField key={key} label={label}>
              <div className="relative">
                <FormInput
                  type={show[key] ? 'text' : 'password'}
                  value={form[key]}
                  onChange={set(key)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={toggle(key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>
          ))}
        </div>
        <p className="text-[11px] text-gray-400">
          Mínimo 8 caracteres. Usa letras, números y símbolos para mayor seguridad.
        </p>
        {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        <div className="flex justify-end pt-1"><SaveButton saved={saved} /></div>
      </form>
    </SectionCard>
  )
}

/* ══════════════════════════════════════════════════════════
   PÁGINA
═══════════════════════════════════════════════════════════ */

export default function ConfiguracionPage() {
  const [profile, setProfile] = useState(() => getProfile())

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 pb-16">
      <h1 className="text-2xl font-black text-black mb-6">Configuración</h1>
      <div className="max-w-2xl space-y-4">
        <PersonalSection  profile={profile} setProfile={setProfile} />
        <DireccionesSection />
        <ContrasenaSection />
      </div>
    </div>
  )
}
