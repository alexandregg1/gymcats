import React from 'react'
import { Activity, Check } from 'lucide-react'

export default function CardioCard({ exercise, onChange, onToggleComplete }) {
  return (
    <div className={`rounded-2xl border p-4 space-y-4 ${exercise.completed ? 'bg-success-500/5 border-success-500/30' : 'bg-graphite-800 border-graphite-700'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><Activity size={18} className="text-sulfur-400" /><h3 className="font-display text-xl font-bold text-graphite-50">{exercise.cardioType}</h3></div>
          <p className="text-xs text-graphite-500 mt-1">Meta: {exercise.plannedDurationMinutes || 0} min · {exercise.plannedDistanceKm || 0} km</p>
        </div>
        <button onClick={onToggleComplete} className={`w-10 h-10 rounded-xl border flex items-center justify-center ${exercise.completed ? 'bg-success-500 border-success-500 text-white' : 'bg-graphite-900 border-graphite-600 text-graphite-500'}`} aria-label="Concluir cardio"><Check size={20} /></button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div><label className="block text-[10px] uppercase tracking-wide text-graphite-500 mb-1">Duração</label><input type="number" min="0" value={exercise.durationMinutes} onChange={(e) => onChange({ ...exercise, durationMinutes: Number(e.target.value) })} className="w-full bg-graphite-900 border border-graphite-600 rounded-lg px-2.5 py-2 text-graphite-50 text-sm" /></div>
        <div><label className="block text-[10px] uppercase tracking-wide text-graphite-500 mb-1">Km</label><input type="number" min="0" step="0.1" value={exercise.distanceKm} onChange={(e) => onChange({ ...exercise, distanceKm: Number(e.target.value) })} className="w-full bg-graphite-900 border border-graphite-600 rounded-lg px-2.5 py-2 text-graphite-50 text-sm" /></div>
        <div><label className="block text-[10px] uppercase tracking-wide text-graphite-500 mb-1">Kcal</label><input type="number" min="0" value={exercise.calories ?? ''} onChange={(e) => onChange({ ...exercise, calories: e.target.value === '' ? '' : Number(e.target.value) })} placeholder="—" className="w-full bg-graphite-900 border border-graphite-600 rounded-lg px-2.5 py-2 text-graphite-50 text-sm" /></div>
      </div>
    </div>
  )
}
