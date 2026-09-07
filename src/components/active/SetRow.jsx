import React from 'react'
import { Check } from 'lucide-react'

export default function SetRow({ set, onChange, onToggleComplete }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
        set.completed
          ? 'bg-success-500/10 border-success-500/40'
          : 'bg-graphite-900 border-graphite-700'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-graphite-800 border border-graphite-600 flex items-center justify-center text-xs font-bold text-graphite-300 shrink-0">
        {set.setNumber}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] uppercase tracking-wide text-graphite-500 mb-1">
            Carga (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            value={set.actualLoad}
            disabled={set.completed}
            onChange={(e) => onChange({ ...set, actualLoad: Number(e.target.value) })}
            className="w-full bg-graphite-800 disabled:opacity-60 border border-graphite-600 rounded-lg px-2.5 py-2 text-center text-lg font-bold text-graphite-50 focus:border-sulfur-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wide text-graphite-500 mb-1">
            Reps
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={set.actualReps}
            disabled={set.completed}
            onChange={(e) => onChange({ ...set, actualReps: Number(e.target.value) })}
            className="w-full bg-graphite-800 disabled:opacity-60 border border-graphite-600 rounded-lg px-2.5 py-2 text-center text-lg font-bold text-graphite-50 focus:border-sulfur-400 outline-none"
          />
        </div>
      </div>

      <button
        onClick={onToggleComplete}
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          set.completed
            ? 'bg-success-500 text-graphite-50'
            : 'bg-graphite-700 text-graphite-400 hover:bg-graphite-600'
        }`}
        aria-label={set.completed ? 'Desfazer série' : 'Concluir série'}
      >
        <Check size={22} strokeWidth={3} />
      </button>
    </div>
  )
}
