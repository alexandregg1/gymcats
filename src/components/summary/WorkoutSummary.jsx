import React, { forwardRef, useMemo } from 'react'
import { Activity, Dumbbell, Dna } from 'lucide-react'
import AnatomyFigure from './AnatomyFigure.jsx'

const MUSCLE_LABELS = {
  'Bíceps': 'Bíceps',
  'Antebraço': 'Antebraço',
  'Antebraços': 'Antebraço',
  'Costas': 'Costas',
  'Dorsais': 'Costas',
  'Trapézio': 'Trapézio',
  'Trapézio Inferior': 'Trapézio',
  'Eretores da Espinha': 'Eretores',
  'Deltoide Posterior': 'Deltoide posterior',
  'Deltoides Posteriores': 'Deltoide posterior',
  'Abdômen': 'Abdômen',
  'Abdominais': 'Abdômen',
}

const WorkoutSummary = forwardRef(function WorkoutSummary({ workout }, ref) {
  // O avatar é alimentado somente pelos grupos marcados na ficha (exercise.muscleGroups).
  // O nome do exercício não é usado para inferir nenhum músculo.
  const selectedMuscleGroups = useMemo(
    () => [
      ...new Set(
        (workout?.exercises || []).flatMap((exercise) =>
          exercise.type === 'cardio' || !Array.isArray(exercise.muscleGroups)
            ? []
            : exercise.muscleGroups,
        ),
      ),
    ],
    [workout],
  )

  const displayMuscle = (muscle) => MUSCLE_LABELS[muscle] || muscle

  return <div ref={ref} className="rounded-3xl bg-graphite-900 border border-graphite-700 p-5 sm:p-7 shadow-card overflow-hidden relative">
    <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 1px 1px, #A855F7 1px, transparent 0)', backgroundSize:'7px 7px'}} />
    <div className="relative text-center mb-5">
      <div className="inline-flex items-center gap-2 text-sulfur-300 mb-2"><span className="text-[10px] font-bold uppercase tracking-[0.26em]">GYM CATS</span></div>
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sulfur-400">Resumo do treino</p>
      <h2 className="font-display text-4xl font-bold text-graphite-50 tracking-tight mt-1">{workout?.name}</h2>
      {workout?.focus && <p className="text-sm text-graphite-400 mt-1">{workout.focus}</p>}
    </div>

    <div className="relative grid grid-cols-[76px_1fr_76px] sm:grid-cols-[130px_1fr_130px] gap-3 items-center">
      <div>
        <AnatomyFigure side="front" muscleGroups={selectedMuscleGroups}/>
      </div>
      <div className="space-y-2 min-w-0">
        {(workout?.exercises || []).map((exercise) => <div
          key={exercise.id}
          className="flex items-center gap-2 min-w-0 rounded-xl bg-graphite-800/70 border border-graphite-700/60 px-2.5 py-2 transition-colors hover:bg-graphite-800 hover:border-sulfur-500/40"
        >
          {exercise.type === 'cardio' ? <Activity size={14} className="text-sulfur-400 shrink-0"/> : <Dumbbell size={14} className="text-sulfur-400 shrink-0"/>}
          <p className="text-xs sm:text-sm font-semibold text-graphite-100 truncate">{exercise.type === 'cardio' ? `${exercise.durationMinutes || 0}min ${exercise.cardioType || exercise.name}` : `${exercise.sets}x ${exercise.name}`}</p>
        </div>)}
      </div>
      <div>
        <AnatomyFigure side="back" muscleGroups={selectedMuscleGroups}/>
      </div>
    </div>

    {selectedMuscleGroups.length > 0 && <div className="relative mt-5 pt-3 border-t border-graphite-800 flex flex-wrap gap-2 justify-center">
      {selectedMuscleGroups.map((muscle) => <button
        type="button"
        key={muscle}
        className="rounded-full border border-sulfur-500/30 bg-sulfur-500/10 px-2.5 py-1 text-[9px] uppercase tracking-wider text-sulfur-200 transition hover:bg-sulfur-500/20 hover:shadow-[0_0_18px_rgba(255,106,61,0.18)]"
      >{displayMuscle(muscle)}</button>)}
    </div>}

    <div className="relative mt-5 pt-3 border-t border-graphite-800 flex items-center justify-between text-[10px] text-graphite-500 uppercase tracking-wider"><span>{workout?.exercises?.length || 0} exercícios</span><span>GYM CATS</span></div>
  </div>
})
export default WorkoutSummary
