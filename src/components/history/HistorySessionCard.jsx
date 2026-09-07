import React, { useState } from 'react'
import { Activity, Calendar, ChevronDown, Trash2 } from 'lucide-react'
import { formatDateFull } from '../../utils/dates.js'

export default function HistorySessionCard({ session, onDelete }) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const strength = (session.exercises || []).filter((e) => e.type !== 'cardio' && Array.isArray(e.sets))
  const cardio = (session.exercises || []).filter((e) => e.type === 'cardio')
  const totalSets = strength.reduce((sum, e) => sum + e.sets.length, 0)
  const completedSets = strength.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0)
  const cardioDone = cardio.filter((e) => e.completed !== false).length

  return (
    <div className="rounded-2xl bg-graphite-800 border border-graphite-700 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="text-left"><div className="flex items-center gap-1.5 text-xs text-graphite-500 mb-0.5"><Calendar size={12}/><span className="capitalize">{formatDateFull(session.date)}</span></div><h3 className="font-display text-lg font-semibold text-graphite-50">{session.workoutName}</h3></div>
        <div className="flex items-center gap-2 shrink-0"><span className="text-xs font-medium text-graphite-400">{completedSets}/{totalSets} séries{cardio.length ? ` · ${cardioDone}/${cardio.length} cardio` : ''}</span><ChevronDown size={18} className={`text-graphite-500 transition-transform ${open ? 'rotate-180' : ''}`}/></div>
      </button>
      {open && <div className="px-4 pb-4 space-y-3 border-t border-graphite-700 pt-3">
        {(session.exercises || []).map((ex) => ex.type === 'cardio' ? <div key={ex.exerciseId} className="rounded-lg bg-graphite-900 border border-graphite-700 p-3"><div className="flex items-center gap-2 text-sm font-medium text-graphite-200"><Activity size={14} className="text-sulfur-400"/>{ex.cardioType || ex.name}</div><p className="text-xs text-graphite-500 mt-1">{ex.durationMinutes || 0} min · {ex.distanceKm || 0} km{ex.calories !== '' && ex.calories != null ? ` · ${ex.calories} kcal` : ''}</p></div> : <div key={ex.exerciseId} className="text-sm"><p className="font-medium text-graphite-200 mb-1">{ex.name}</p><div className="flex flex-wrap gap-1.5">{(ex.sets || []).map((set, i) => <span key={i} className={`text-xs px-2 py-1 rounded-md border ${set.completed ? 'bg-success-500/10 border-success-500/30 text-success-400' : 'bg-graphite-900 border-graphite-700 text-graphite-500'}`}>{set.actualLoad}kg × {set.actualReps}</span>)}</div></div>)}
        <div className="pt-1">{confirmDelete ? <div className="flex items-center gap-2"><button onClick={() => onDelete(session.id)} className="text-xs font-semibold text-danger-400 px-2.5 py-1.5 rounded-md bg-danger-500/10">Confirmar exclusão</button><button onClick={() => setConfirmDelete(false)} className="text-xs text-graphite-400 px-2.5 py-1.5">Cancelar</button></div> : <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 text-xs font-medium text-graphite-500 hover:text-danger-400"><Trash2 size={13}/> Remover sessão</button>}</div>
      </div>}
    </div>
  )
}
