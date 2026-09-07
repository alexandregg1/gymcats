import React from 'react'
import { Tag } from '../ui/Field.jsx'
import SetRow from './SetRow.jsx'

export default function ExerciseCard({ exercise, lastPerformance, onChangeSet, onToggleSet }) {
  const allDone = exercise.sets.every((s) => s.completed)

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3.5 transition-colors ${
        allDone ? 'bg-success-500/5 border-success-500/30' : 'bg-graphite-800 border-graphite-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-bold text-graphite-50 leading-tight">
            {exercise.name}
          </h3>
          <span className="text-xs text-graphite-500 font-medium shrink-0 pt-1">
            Meta: {exercise.plannedReps} reps · {exercise.plannedLoad}kg
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
          {exercise.muscleGroups.map((mg) => (
            <Tag key={mg} tone="chalk">
              {mg}
            </Tag>
          ))}
        </div>
        {lastPerformance?.bestSet && (
          <p className="text-xs text-sulfur-300/90 mt-2">
            Última vez: {lastPerformance.bestSet.actualLoad}kg × {lastPerformance.bestSet.actualReps} reps
          </p>
        )}
      </div>

      <div className="space-y-2">
        {exercise.sets.map((set, i) => (
          <SetRow
            key={i}
            set={set}
            onChange={(updated) => onChangeSet(i, updated)}
            onToggleComplete={() => onToggleSet(i)}
          />
        ))}
      </div>
    </div>
  )
}
