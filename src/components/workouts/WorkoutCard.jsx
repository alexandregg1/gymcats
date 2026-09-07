import React from 'react'
import { Play, Pencil, ChevronRight } from 'lucide-react'
import { Tag } from '../ui/Field.jsx'
import { WEEKDAY_LABELS } from '../../utils/dates.js'

export default function WorkoutCard({ workout, onStart, onEdit }) {
  return (
    <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-graphite-50 leading-tight">
            {workout.name}
          </h3>
          {workout.focus && <p className="text-sm text-graphite-400">{workout.focus}</p>}
        </div>
        <button
          onClick={() => onEdit(workout.id)}
          className="p-2 rounded-lg text-graphite-400 hover:text-graphite-100 hover:bg-graphite-700 shrink-0"
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {workout.weekdays?.length > 0 ? (
          workout.weekdays
            .slice()
            .sort()
            .map((d) => (
              <Tag key={d} tone="sulfur">
                {WEEKDAY_LABELS[d]}
              </Tag>
            ))
        ) : (
          <Tag tone="neutral">Sem dia fixo</Tag>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-graphite-500">
          {workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => onStart(workout.id)}
          className="flex items-center gap-1.5 text-sm font-semibold text-sulfur-400 hover:text-sulfur-300"
        >
          Iniciar <Play size={15} />
        </button>
      </div>
    </div>
  )
}
