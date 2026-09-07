import React, { useMemo, useState } from 'react'
import { Activity, BarChart3, Clock3, Dumbbell } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext.jsx'

function monthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatMonth(value) {
  const [year, month] = value.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function sessionVolume(session) {
  return (session.exercises || []).reduce((sum, exercise) => {
    if (exercise.type === 'cardio' || !Array.isArray(exercise.sets)) return sum
    return sum + exercise.sets.reduce((setSum, set) => setSum + (set.completed ? Number(set.actualLoad || 0) * Number(set.actualReps || 0) : 0), 0)
  }, 0)
}

function cardioMinutes(session) {
  return (session.exercises || []).reduce((sum, exercise) => sum + (exercise.type === 'cardio' && exercise.completed !== false ? Number(exercise.durationMinutes || 0) : 0), 0)
}

function weekOfMonth(date) {
  const d = new Date(date)
  return Math.min(5, Math.floor((d.getDate() - 1) / 7) + 1)
}

export default function MonthlyAnalytics() {
  const { history } = useAppData()
  const current = monthKey(new Date())
  const availableMonths = useMemo(() => [...new Set([current, ...history.map((h) => monthKey(h.date))])].sort().reverse(), [history, current])
  const [selectedMonth, setSelectedMonth] = useState(current)

  const stats = useMemo(() => {
    const sessions = history.filter((h) => monthKey(h.date) === selectedMonth)
    const volume = sessions.reduce((sum, session) => sum + sessionVolume(session), 0)
    const cardio = sessions.reduce((sum, session) => sum + cardioMinutes(session), 0)
    const weeks = [0, 0, 0, 0, 0]
    sessions.forEach((session) => { weeks[weekOfMonth(session.date) - 1] += 1 })
    const activeWeeks = weeks.filter((count) => count > 0).length || 1
    return { sessions, volume, cardio, weeks, frequency: sessions.length / activeWeeks }
  }, [history, selectedMonth])

  const maxWeek = Math.max(...stats.weeks, 1)
  const cards = [
    { label: 'Treinos no mês', value: stats.sessions.length, icon: Dumbbell },
    { label: 'Volume levantado', value: `${Math.round(stats.volume).toLocaleString('pt-BR')} kg`, icon: BarChart3 },
    { label: 'Frequência semanal', value: `${stats.frequency.toFixed(1)}x`, icon: Activity },
    { label: 'Tempo de cardio', value: `${Math.round(stats.cardio)} min`, icon: Clock3 },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div><h1 className="font-display text-2xl font-bold text-graphite-50 tracking-tight">Estatísticas</h1><p className="text-sm text-graphite-400 mt-0.5 capitalize">{formatMonth(selectedMonth)}</p></div>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-graphite-800 border border-graphite-600 rounded-lg px-3 py-2 text-xs text-graphite-200">
          {availableMonths.map((month) => <option value={month} key={month}>{formatMonth(month)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl bg-graphite-800 border border-graphite-700 p-4"><div className="w-9 h-9 rounded-lg bg-sulfur-400/10 text-sulfur-400 flex items-center justify-center mb-3"><Icon size={18} /></div><p className="font-display text-2xl font-bold text-graphite-50">{value}</p><p className="text-xs text-graphite-400 mt-0.5">{label}</p></div>)}
      </div>

      <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-5">
        <div className="flex items-center justify-between mb-5"><div><h2 className="font-semibold text-graphite-100">Frequência por semana</h2><p className="text-xs text-graphite-500">Treinos concluídos em cada faixa do mês</p></div></div>
        <div className="h-40 flex items-end gap-3">
          {stats.weeks.map((count, index) => <div key={index} className="flex-1 flex flex-col items-center gap-2"><span className="text-xs font-semibold text-graphite-300">{count}</span><div className="w-full rounded-t-lg bg-sulfur-400 min-h-[4px] transition-all" style={{ height: `${Math.max(4, (count / maxWeek) * 112)}px`, opacity: count ? 1 : 0.18 }} /><span className="text-[10px] text-graphite-500">S{index + 1}</span></div>)}
        </div>
      </div>

      <div className="rounded-2xl bg-graphite-900 border border-graphite-800 p-4 text-xs leading-relaxed text-graphite-500">
        Volume = soma de carga × repetições das séries concluídas. O tempo de cardio considera os blocos de cardio concluídos e a frequência semanal usa apenas semanas com atividade no mês selecionado.
      </div>
    </div>
  )
}
