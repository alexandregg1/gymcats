import React from 'react'
import { GripVertical, Trash2 } from 'lucide-react'
import { Input, Label } from '../ui/Field.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { MUSCLE_GROUPS } from '../../data/exercises.js'

// Cardio deixou de ser um "tipo" de exercício dentro da ficha de musculação:
// agora tem aba própria (ver src/components/cardio). Este formulário só
// lida com exercícios de força; fichas antigas com cardio embutido são
// migradas automaticamente (ver src/utils/migrateCardio.js).
export default function ExerciseFormRow({ exercise, onChange, onRemove }) {
  const { getLastPerformance } = useAppData()
  const last = exercise.name.trim() ? getLastPerformance(exercise.name) : null
  const update = (field, value) => onChange({ ...exercise, [field]: value })

  const toggleMuscle = (muscle) => {
    const current = exercise.muscleGroups || []
    update('muscleGroups', current.includes(muscle) ? current.filter((m) => m !== muscle) : [...current, muscle])
  }

  return (
    <div className="rounded-xl bg-graphite-800 border border-graphite-700 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <GripVertical size={16} className="text-graphite-600 mt-3 shrink-0" />
        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <Label>Exercício</Label>
            <Input value={exercise.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: Supino reto com barra" />
            {last?.bestSet && <p className="text-xs text-sulfur-300/80 mt-1.5">Última vez: {last.bestSet.actualLoad}kg × {last.bestSet.actualReps} reps</p>}
          </div>

          <div>
            <Label>Grupos musculares</Label>
            <div className="flex flex-wrap gap-1.5">
              {MUSCLE_GROUPS.map((muscle) => (
                <button key={muscle} type="button" onClick={() => toggleMuscle(muscle)} className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors ${(exercise.muscleGroups || []).includes(muscle) ? 'bg-chalk-500/25 border-chalk-500 text-chalk-300' : 'bg-graphite-900 border-graphite-600 text-graphite-400'}`}>
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div><Label>Séries</Label><Input type="number" min="1" value={exercise.sets} onChange={(e) => update('sets', Number(e.target.value))} /></div>
            <div><Label>Reps</Label><Input value={exercise.reps} onChange={(e) => update('reps', e.target.value)} placeholder="8-12" /></div>
            <div><Label>Carga (kg)</Label><Input type="number" min="0" step="0.5" value={exercise.load} onChange={(e) => update('load', Number(e.target.value))} /></div>
          </div>

          <div>
            <Label>Descanso entre séries</Label>
            <div className="flex gap-2 flex-wrap">
              {[30, 45, 60, 90, 120].map((sec) => <button key={sec} type="button" onClick={() => update('restSeconds', sec)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${exercise.restSeconds === sec ? 'bg-sulfur-400 text-graphite-950 border-sulfur-400' : 'bg-graphite-900 text-graphite-300 border-graphite-600'}`}>{sec}s</button>)}
            </div>
          </div>
        </div>
        <button type="button" onClick={onRemove} className="p-1.5 text-graphite-500 hover:text-danger-400 shrink-0" aria-label="Remover exercício"><Trash2 size={17} /></button>
      </div>
    </div>
  )
}
