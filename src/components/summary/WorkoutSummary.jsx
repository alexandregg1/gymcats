import React, { forwardRef, useMemo } from 'react'
import { Activity } from 'lucide-react'
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

function displayMuscle(muscle) {
  return MUSCLE_LABELS[muscle] || muscle
}

function formatExerciseLabel(exercise) {
  if (exercise.type === 'cardio') {
    return { qty: `${exercise.durationMinutes || 0}min`, name: exercise.cardioType || exercise.name }
  }
  return { qty: `${exercise.sets}x`, name: exercise.name }
}

// Cabeçalho: marca, rótulo "Resumo do treino" e nome real da ficha.
function SummaryHeader({ workout }) {
  return (
    <div className="relative text-center mb-3 sm:mb-5">
      <div className="inline-flex items-center gap-2 text-sulfur-300 mb-1 sm:mb-2">
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.26em]">Gym Cats</span>
      </div>
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em] text-sulfur-400">Resumo do treino</p>
      <h2 className="font-display text-2xl sm:text-4xl font-bold text-graphite-50 tracking-tight mt-0.5 sm:mt-1 leading-tight">{workout?.name}</h2>
      {workout?.focus && <p className="text-xs sm:text-sm text-graphite-400 mt-0.5 sm:mt-1">{workout.focus}</p>}
    </div>
  )
}

// Lista central minimalista: quantidade (séries/minutos) em destaque roxo + nome do exercício.
function SummaryExerciseList({ exercises }) {
  return (
    <div className="min-w-0 divide-y divide-graphite-800/60">
      {exercises.map((exercise) => {
        const { qty, name } = formatExerciseLabel(exercise)
        return (
          <div key={exercise.id} className="flex items-center gap-1 min-w-0 py-1.5 sm:py-2">
            {exercise.type === 'cardio' && (
              <Activity size={13} className="text-graphite-500 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-bold text-sulfur-400 shrink-0 tabular-nums">{qty}</span>
            <span className="text-xs sm:text-sm font-medium text-graphite-100 truncate">{name}</span>
          </div>
        )
      })}
    </div>
  )
}

// Badges com os grupos musculares realmente presentes no treino (derivados dos exercícios).
function SummaryMuscleGroups({ muscleGroups }) {
  if (muscleGroups.length === 0) return null
  return (
    <div className="relative mt-3 sm:mt-5 pt-2.5 sm:pt-3 border-t border-graphite-800 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
      {muscleGroups.map((muscle) => (
        <span
          key={muscle}
          className="rounded-full border border-sulfur-500/30 bg-sulfur-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[9px] uppercase tracking-wider text-sulfur-200"
        >
          {displayMuscle(muscle)}
        </span>
      ))}
    </div>
  )
}

// Rodapé discreto: quantidade real de exercícios + marca.
function SummaryFooter({ exerciseCount, durationLabel }) {
  return (
    <div className="relative mt-3 sm:mt-5 pt-2.5 sm:pt-3 border-t border-graphite-800 grid grid-cols-[1fr_auto_1fr] items-center text-[9px] sm:text-[10px] text-graphite-500 uppercase tracking-wider">
      <span className="justify-self-start">
        {exerciseCount} exercício{exerciseCount === 1 ? '' : 's'}
      </span>

      <span className="justify-self-center text-sulfur-300 font-bold tracking-[0.18em]">
        {durationLabel || '00:00'}
      </span>

      <span className="justify-self-end">Gym Cats</span>
    </div>
  )
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

  const exercises = workout?.exercises || []

  return (
    <div
      ref={ref}
      className="rounded-3xl bg-graphite-900 border border-graphite-700 p-4 sm:p-7 shadow-card relative flex flex-col"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Camada decorativa isolada: o clipping fica só aqui, o card real nunca é cortado. */}
      <div className="absolute inset-0 rounded-3xl opacity-[0.035] pointer-events-none overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #A855F7 1px, transparent 0)', backgroundSize: '7px 7px' }} />

      <SummaryHeader workout={workout} />

      {/* Avatares grandes (frente à esquerda, costas à direita) ladeando a lista central.
          Sem min-h-0/overflow-hidden: se a lista de exercícios precisar de mais espaço,
          o card cresce verticalmente em vez de cortar conteúdo (16:9 é referência, não regra rígida). */}
      <div className="relative flex-1 grid grid-cols-[32%_1fr_32%] sm:grid-cols-[30%_1fr_30%] gap-2 sm:gap-4 items-center">
        <div className="flex items-center">
          <AnatomyFigure side="front" muscleGroups={selectedMuscleGroups} />
        </div>
        <div className="min-w-0">
          <SummaryExerciseList exercises={exercises} />
        </div>
        <div className="flex items-center">
          <AnatomyFigure side="back" muscleGroups={selectedMuscleGroups} />
        </div>
      </div>

      <SummaryMuscleGroups muscleGroups={selectedMuscleGroups} />
      <SummaryFooter
        exerciseCount={exercises.length}
        durationLabel={workout?.durationLabel || '00:00'}
      />
    </div>
  )
})

export default WorkoutSummary
