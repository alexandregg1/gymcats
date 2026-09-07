import React, { useMemo, useState } from 'react'
import { Select } from '../ui/Field.jsx'
import Sparkline from '../ui/Sparkline.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { formatDateShort } from '../../utils/dates.js'

export default function ExerciseProgress() {
  const { history, getExerciseProgress } = useAppData()

  const exerciseNames = useMemo(() => {
    const names = new Set()
    history.forEach((s) => s.exercises.forEach((e) => names.add(e.name)))
    return Array.from(names).sort()
  }, [history])

  const [selected, setSelected] = useState(exerciseNames[0] || '')
  const points = selected ? getExerciseProgress(selected) : []

  if (exerciseNames.length === 0) {
    return (
      <p className="text-sm text-graphite-400 text-center py-8">
        Conclua treinos para acompanhar a evolução de carga por exercício aqui.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
        {exerciseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>

      <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-5">
        <Sparkline points={points} />
        {points.length > 0 && (
          <div className="flex justify-between mt-2 text-[11px] text-graphite-500">
            <span>{formatDateShort(points[0].date)}</span>
            <span>{formatDateShort(points[points.length - 1].date)}</span>
          </div>
        )}
      </div>

      {points.length > 0 && (
        <div className="space-y-1.5">
          {points
            .slice()
            .reverse()
            .map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm px-3.5 py-2.5 rounded-lg bg-graphite-800/60"
              >
                <span className="text-graphite-400">{formatDateShort(p.date)}</span>
                <span className="font-semibold text-graphite-100">{p.load}kg</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
