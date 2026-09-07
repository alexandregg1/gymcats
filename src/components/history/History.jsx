import React, { useState } from 'react'
import { History as HistoryIcon } from 'lucide-react'
import EmptyState from '../ui/EmptyState.jsx'
import HistorySessionCard from './HistorySessionCard.jsx'
import ExerciseProgress from './ExerciseProgress.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'

const TABS = [
  { key: 'sessions', label: 'Sessões' },
  { key: 'progress', label: 'Evolução' },
]

export default function History() {
  const { history, deleteHistoryEntry } = useAppData()
  const [tab, setTab] = useState('sessions')

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold text-graphite-50 tracking-tight">Histórico</h1>

      <div className="flex gap-1.5 bg-graphite-800 border border-graphite-700 rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-sulfur-400 text-graphite-950' : 'text-graphite-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sessions' &&
        (history.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="Nenhum treino concluído ainda"
            description="Finalize um treino no Modo Academia para ver seu histórico aqui."
          />
        ) : (
          <div className="space-y-3">
            {history.map((session) => (
              <HistorySessionCard
                key={session.id}
                session={session}
                onDelete={deleteHistoryEntry}
              />
            ))}
          </div>
        ))}

      {tab === 'progress' && <ExerciseProgress />}
    </div>
  )
}
