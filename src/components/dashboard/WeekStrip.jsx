import React from 'react'
import { Check } from 'lucide-react'

export default function WeekStrip({ history }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d)
  }

  const trained = (day) =>
    history.some((h) => {
      const hd = new Date(h.date)
      return (
        hd.getFullYear() === day.getFullYear() &&
        hd.getMonth() === day.getMonth() &&
        hd.getDate() === day.getDate()
      )
    })

  const isToday = (day) => {
    const now = new Date()
    return (
      day.getFullYear() === now.getFullYear() &&
      day.getMonth() === now.getMonth() &&
      day.getDate() === now.getDate()
    )
  }

  const weekdayLetter = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  return (
    <div className="flex items-center justify-between gap-1.5">
      {days.map((day, i) => {
        const done = trained(day)
        const today = isToday(day)
        return (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <span
              className={`text-[11px] font-medium ${today ? 'text-sulfur-300' : 'text-graphite-500'}`}
            >
              {weekdayLetter[day.getDay()]}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                done
                  ? 'bg-success-500/20 border-success-500 text-success-400'
                  : today
                    ? 'border-sulfur-400 text-sulfur-300'
                    : 'border-graphite-700 text-graphite-600'
              }`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : <span className="text-xs">{day.getDate()}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
