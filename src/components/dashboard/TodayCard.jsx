import React from 'react'
import { Play, Moon, Calendar, ListChecks } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { Tag } from '../ui/Field.jsx'
import { WEEKDAY_LABELS_FULL } from '../../utils/dates.js'

export default function TodayCard({ todaysWorkouts, onStart, onPickManually }) {
  const todayLabel = WEEKDAY_LABELS_FULL[new Date().getDay()]

  if (todaysWorkouts.length === 0) {
    return (
      <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-6 shadow-card">
        <div className="flex items-center gap-1.5 text-graphite-400 text-sm font-medium mb-3">
          <Calendar size={14} />
          <span className="capitalize">{todayLabel}</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-graphite-700 flex items-center justify-center">
            <Moon size={20} className="text-graphite-400" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-graphite-50">Nenhum treino agendado</h3>
            <p className="text-sm text-graphite-400">Aproveite para descansar ou escolha um treino</p>
          </div>
        </div>
        <Button variant="secondary" fullWidth icon={ListChecks} onClick={onPickManually}>
          Escolher um treino manualmente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todaysWorkouts.map((w) => (
        <div
          key={w.id}
          className="rounded-2xl bg-gradient-to-br from-graphite-800 to-graphite-900 border border-graphite-700 p-6 shadow-card"
        >
          <div className="flex items-center gap-1.5 text-sulfur-300 text-sm font-medium mb-3">
            <Calendar size={14} />
            <span className="capitalize">{todayLabel} · treino de hoje</span>
          </div>
          <h3 className="font-display text-3xl font-bold text-graphite-50 tracking-tight leading-none mb-2">
            {w.name}
          </h3>
          {w.focus && (
            <Tag tone="chalk" className="mb-4">
              {w.focus}
            </Tag>
          )}
          <p className="text-sm text-graphite-400 mb-5">
            {w.exercises.length} exercício{w.exercises.length !== 1 ? 's' : ''} planejado
            {w.exercises.length !== 1 ? 's' : ''}
          </p>
          <Button size="lg" fullWidth icon={Play} onClick={() => onStart(w.id)}>
            Iniciar treino
          </Button>
        </div>
      ))}
    </div>
  )
}
