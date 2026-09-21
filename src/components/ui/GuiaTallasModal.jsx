import { X } from 'lucide-react'

const FILAS = [
  { label: 'CM',  valores: ['22.6', '23', '23.5', '24', '25', '25.5', '26.5'] },
  { label: 'COL', valores: ['34', '35', '36', '37', '38', '39', '40'] },
  { label: 'EUR', valores: ['35', '36', '36.5', '37.5', '39', '40', '41'] },
  { label: 'USA', valores: ['4', '5', '6', '7', '8', '9', '10'] },
]

export default function GuiaTallasModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full shadow-2xl">
          <div className="flex items-center justify-between bg-black text-white px-5 py-3.5">
            <h2 className="text-sm font-black tracking-wide">GUÍA DE TALLAS</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 transition-colors" aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <tbody>
                {FILAS.map((fila, i) => (
                  <tr key={fila.label} className={i % 2 === 0 ? 'bg-gray-50' : undefined}>
                    <th scope="row" className="border border-gray-200 px-3 py-2 text-xs font-bold text-black whitespace-nowrap">
                      {fila.label}
                    </th>
                    {fila.valores.map((valor) => (
                      <td key={valor} className="border border-gray-200 px-3 py-2 text-sm text-gray-700">
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
