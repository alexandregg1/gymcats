import React from 'react'
import { CARDIO_TYPES } from '../../data/exercises.js'

export default function CardioTypeSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wide text-graphite-500 mb-2">Tipo de cardio</label>
      <div className="grid grid-cols-3 gap-2">
        {CARDIO_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
              value === type
                ? 'bg-sulfur-400 border-sulfur-400 text-graphite-950'
                : 'bg-graphite-800 border-graphite-700 text-graphite-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
