import React, { useEffect, useRef, useState } from 'react'
import { Pause, Play, Plus, X, Timer } from 'lucide-react'

export default function RestTimer({ session, onClose }) {
  const [remaining, setRemaining] = useState(session?.seconds || 0)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef(null)

  // Reinicia sempre que uma nova sessão de descanso é disparada (nova key)
  useEffect(() => {
    if (!session) return
    setRemaining(session.seconds)
    setRunning(true)
  }, [session?.key])

  useEffect(() => {
    if (!session || !running) return
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, session])

  if (!session) return null

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const finished = remaining === 0

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-2xl mx-auto m-3 rounded-2xl bg-graphite-800 border border-sulfur-400/40 shadow-card px-5 py-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-sulfur-400/15 flex items-center justify-center shrink-0">
          <Timer size={20} className="text-sulfur-300" />
        </div>

        <div className="flex-1">
          <p className="text-xs text-graphite-400 font-medium mb-0.5">
            {finished ? 'Descanso concluído!' : 'Descansando...'}
          </p>
          <p
            className={`font-display text-3xl font-bold tabular-nums tracking-tight ${
              finished ? 'text-success-400' : 'text-graphite-50'
            }`}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>

        {!finished && (
          <button
            onClick={() => setRemaining((r) => r + 15)}
            className="px-2.5 py-2 rounded-lg bg-graphite-700 text-graphite-200 text-xs font-semibold"
          >
            +15s
          </button>
        )}

        {!finished && (
          <button
            onClick={() => setRunning((r) => !r)}
            className="p-2.5 rounded-lg bg-graphite-700 text-graphite-100"
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
        )}

        <button onClick={onClose} className="p-2.5 rounded-lg bg-graphite-700 text-graphite-100">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
