import React from 'react'
import { Activity, ClipboardList, Dumbbell, History, Home } from 'lucide-react'

const ITEMS = [
  { key: 'dashboard', label: 'Início', icon: Home },
  { key: 'workouts', label: 'Treinos', icon: Dumbbell },
  { key: 'cardio', label: 'Cardio', icon: Activity },
  { key: 'assessments', label: 'Avaliações', icon: ClipboardList },
  { key: 'history', label: 'Histórico', icon: History },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-graphite-900/95 backdrop-blur border-t border-graphite-800">
      <div className="max-w-2xl mx-auto grid grid-cols-5 px-1 sm:px-3">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const active = current === key
          return (
            <button key={key} onClick={() => onNavigate(key)} className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] sm:text-xs font-medium transition-colors ${active ? 'text-sulfur-400' : 'text-graphite-500 hover:text-graphite-300'}`}>
              <Icon size={19} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
