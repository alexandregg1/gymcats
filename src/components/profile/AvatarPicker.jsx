import React from 'react'
import { Check } from 'lucide-react'
import { AVATARS } from '../../data/avatars.js'

/**
 * Grade de ícones de gato para o usuário escolher como avatar do perfil.
 * `value` é o id do avatar selecionado (ou null/undefined para nenhum).
 */
export default function AvatarPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {AVATARS.map((avatar) => {
        const selected = value === avatar.id
        return (
          <button
            key={avatar.id}
            type="button"
            title={avatar.label}
            onClick={() => onChange(selected ? null : avatar.id)}
            className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-colors shrink-0 ${
              selected
                ? 'border-sulfur-400 ring-2 ring-sulfur-400/40'
                : 'border-graphite-700 hover:border-graphite-500'
            }`}
          >
            <img
              src={avatar.src}
              alt={avatar.label}
              draggable="false"
              className="w-full h-full object-cover bg-graphite-800 select-none"
            />
            {selected && (
              <span className="absolute inset-0 flex items-center justify-center bg-graphite-950/40">
                <Check size={20} className="text-white drop-shadow" strokeWidth={3} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
