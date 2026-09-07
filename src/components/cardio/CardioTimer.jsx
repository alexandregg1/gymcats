import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Pause, Play, RotateCcw } from 'lucide-react'
import { TIMER_PRESETS_MINUTES } from '../../data/cardioMet.js'

export default function CardioTimer({ onFinish, storageKey = 'gymcat_cardio_timer' }) {
  const saved = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || 'null') } catch { return null }
  }, [storageKey])
  const [selectedMinutes, setSelectedMinutes] = useState(saved?.selectedMinutes || TIMER_PRESETS_MINUTES[0])
  const [customMinutes, setCustomMinutes] = useState(saved?.customMinutes || '')
  const [isCustom, setIsCustom] = useState(Boolean(saved?.isCustom))
  const [running, setRunning] = useState(Boolean(saved?.running && saved?.endAt > Date.now()))
  const [elapsedSeconds, setElapsedSeconds] = useState(() => saved?.startedAt ? Math.max(0, Math.floor((Date.now() - saved.startedAt) / 1000)) : (saved?.elapsedSeconds || 0))
  const [remainingSeconds, setRemainingSeconds] = useState(() => saved?.endAt ? Math.max(0, Math.ceil((saved.endAt - Date.now()) / 1000)) : (saved?.remainingSeconds || TIMER_PRESETS_MINUTES[0] * 60))
  const intervalRef = useRef(null)

  const totalSeconds = (isCustom ? Number(customMinutes || 0) : selectedMinutes) * 60
  const radius = 116
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? Math.min(1, Math.max(0, elapsedSeconds / totalSeconds)) : 0
  const dashOffset = circumference * (1 - progress)

  const persist = (patch = {}) => {
    const current = {
      selectedMinutes, customMinutes, isCustom, running, elapsedSeconds, remainingSeconds,
      totalSeconds, ...patch,
    }
    try { localStorage.setItem(storageKey, JSON.stringify(current)) } catch {}
  }

  useEffect(() => {
    if (!running) return undefined
    const tick = () => {
      const raw = (() => { try { return JSON.parse(localStorage.getItem(storageKey) || '{}') } catch { return {} } })()
      const endAt = raw.endAt
      const startedAt = raw.startedAt
      const left = Math.max(0, Math.ceil((Number(endAt) - Date.now()) / 1000))
      const elapsed = startedAt ? Math.max(0, Math.min(totalSeconds, Math.floor((Date.now() - Number(startedAt)) / 1000))) : totalSeconds - left
      setRemainingSeconds(left)
      setElapsedSeconds(elapsed)
      if (left <= 0) {
        window.clearInterval(intervalRef.current)
        setRunning(false)
        try { localStorage.removeItem(storageKey) } catch {}
        onFinish(totalSeconds)
      }
    }
    tick()
    intervalRef.current = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalRef.current)
  }, [running, totalSeconds, storageKey, onFinish])

  useEffect(() => {
    if (!running) persist()
  }, [selectedMinutes, customMinutes, isCustom, running, elapsedSeconds, remainingSeconds])

  const format = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const selectPreset = (minutes) => {
    if (running) return
    setIsCustom(false); setSelectedMinutes(minutes); setElapsedSeconds(0); setRemainingSeconds(minutes * 60)
    try { localStorage.removeItem(storageKey) } catch {}
  }
  const start = () => {
    if (!totalSeconds) return
    const now = Date.now()
    const resumedElapsed = Math.max(0, totalSeconds - remainingSeconds)
    const startedAt = now - resumedElapsed * 1000
    persist({ running: true, startedAt, endAt: now + remainingSeconds * 1000, elapsedSeconds: resumedElapsed, remainingSeconds })
    setRunning(true)
  }
  const pause = () => {
    setRunning(false)
    persist({ running: false, startedAt: null, endAt: null })
  }
  const reset = () => {
    setRunning(false); setElapsedSeconds(0); setRemainingSeconds(totalSeconds)
    try { localStorage.removeItem(storageKey) } catch {}
  }
  const finishNow = () => {
    setRunning(false)
    try { localStorage.removeItem(storageKey) } catch {}
    onFinish(elapsedSeconds || totalSeconds)
  }

  return (
    <div className="rounded-3xl bg-graphite-800 border border-graphite-700 p-5 sm:p-6 space-y-5 shadow-card">
      <div className="grid grid-cols-4 gap-2">
        {TIMER_PRESETS_MINUTES.map((m) => <button key={m} type="button" disabled={running} onClick={() => selectPreset(m)} className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors disabled:opacity-40 ${!isCustom && selectedMinutes === m ? 'bg-sulfur-400 border-sulfur-400 text-graphite-950' : 'bg-graphite-900 border-graphite-600 text-graphite-300'}`}>{m} min</button>)}
        <button type="button" disabled={running} onClick={() => { setIsCustom(true); setElapsedSeconds(0) }} className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors disabled:opacity-40 ${isCustom ? 'bg-sulfur-400 border-sulfur-400 text-graphite-950' : 'bg-graphite-900 border-graphite-600 text-graphite-300'}`}>Custom</button>
      </div>
      {isCustom && <input type="number" min="1" placeholder="Minutos" value={customMinutes} disabled={running} onChange={(e) => { setCustomMinutes(e.target.value); setElapsedSeconds(0); setRemainingSeconds(Number(e.target.value || 0) * 60) }} className="w-full bg-graphite-900 border border-graphite-600 rounded-xl px-3 py-3 text-graphite-50 text-sm disabled:opacity-40" />}
      <div className="relative mx-auto w-[280px] max-w-full aspect-square flex items-center justify-center">
        <svg viewBox="0 0 280 280" className="absolute inset-0 -rotate-90" aria-hidden="true"><circle cx="140" cy="140" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-graphite-700" /><circle cx="140" cy="140" r={radius} fill="none" stroke="#A855F7" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 0.8s linear' }} /></svg>
        <div className="relative text-center"><p className="text-xs uppercase tracking-[0.22em] text-graphite-500 mb-2">Tempo restante</p><span className="font-mono text-5xl sm:text-6xl font-bold tabular-nums text-graphite-50">{format(remainingSeconds)}</span><p className="text-sm text-graphite-400 mt-2">{running ? 'Em andamento' : elapsedSeconds > 0 ? 'Pausado' : 'Pronto para começar'}</p></div>
      </div>
      <div className="grid grid-cols-3 gap-2">{!running ? <button onClick={start} className="col-span-2 flex items-center justify-center gap-2 bg-sulfur-400 text-graphite-950 rounded-xl py-3.5 font-semibold"><Play size={18} />{elapsedSeconds > 0 ? 'Retomar' : 'Iniciar'}</button> : <button onClick={pause} className="col-span-2 flex items-center justify-center gap-2 bg-graphite-700 text-graphite-50 rounded-xl py-3.5 font-semibold"><Pause size={18} />Pausar</button>}<button onClick={reset} className="flex items-center justify-center bg-graphite-900 border border-graphite-600 rounded-xl py-3.5 text-graphite-300" aria-label="Reiniciar"><RotateCcw size={18} /></button></div>
      <button onClick={finishNow} disabled={elapsedSeconds === 0 && !running} className="w-full flex items-center justify-center gap-2 bg-[#318efc] text-white hover:bg-[#5aa6ff] active:bg-[#2375d0] rounded-xl py-3.5 font-semibold transition-colors disabled:opacity-40"><Check size={18} /> Concluir e calcular calorias</button>
    </div>
  )
}
