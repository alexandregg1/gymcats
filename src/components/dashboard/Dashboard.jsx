import React from 'react'
import { TrendingUp } from 'lucide-react'
import TodayCard from './TodayCard.jsx'
import WeekStrip from './WeekStrip.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { isWithinLastDays } from '../../utils/dates.js'

export default function Dashboard({ onStartWorkout, onGoToWorkouts }) {
  const { workouts, history } = useAppData()
  const todayWeekday = new Date().getDay()
  const todaysWorkouts = workouts.filter((w) => w.weekdays?.includes(todayWeekday))
  const sessionsThisWeek = history.filter((h) => isWithinLastDays(h.date, 7)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-graphite-50 tracking-tight mb-0.5">
          Bora treinar 💪
        </h1>
        <p className="text-sm text-graphite-400">Aqui está o resumo do seu dia</p>
      </div>

      <TodayCard
        todaysWorkouts={todaysWorkouts}
        onStart={onStartWorkout}
        onPickManually={onGoToWorkouts}
      />

      <div className="rounded-2xl bg-graphite-800/60 border border-graphite-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-graphite-200">Últimos 7 dias</h3>
          <div className="flex items-center gap-1 text-xs font-medium text-sulfur-300">
            <TrendingUp size={13} />
            {sessionsThisWeek} treino{sessionsThisWeek !== 1 ? 's' : ''}
          </div>
        </div>
        <WeekStrip history={history} />
      </div>
    </div>
  )
}
