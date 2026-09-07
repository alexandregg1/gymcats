import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, Flag, Share2, X } from 'lucide-react'
import ExerciseCard from './ExerciseCard.jsx'
import RestTimer from './RestTimer.jsx'
import Button from '../ui/Button.jsx'
import WorkoutSummary from '../summary/WorkoutSummary.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { generateId } from '../../utils/id.js'
import { downloadBlob, elementToPng } from '../../utils/shareImage.js'

function parseDefaultReps(reps) {
  const matches = String(reps).match(/\d+/g)
  return matches ? Number(matches[matches.length - 1]) : 0
}

function buildSessionExercises(workout) {
  return (workout?.exercises || []).map((ex) => ({
    exerciseId: ex.id, type: 'strength', name: ex.name, muscleGroups: ex.muscleGroups || [], plannedReps: ex.reps,
    plannedLoad: ex.load, restSeconds: ex.restSeconds || 60,
    sets: Array.from({ length: ex.sets }, (_, i) => ({ setNumber: i + 1, plannedReps: ex.reps, plannedLoad: ex.load, actualLoad: ex.load, actualReps: parseDefaultReps(ex.reps), completed: false })),
  }))
}

export default function ActiveWorkout({ workoutId, onFinish, onExit }) {
  const { getWorkout, addHistoryEntry, getLastPerformance } = useAppData()
  const workout = getWorkout(workoutId)
  const [sessionExercises, setSessionExercises] = useState(() => buildSessionExercises(workout))
  const [restSession, setRestSession] = useState(null)
  const [confirmExit, setConfirmExit] = useState(false)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [summaryBlob, setSummaryBlob] = useState(null)
  const [shareError, setShareError] = useState(null)
  const [captureAttempt, setCaptureAttempt] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finishedAt, setFinishedAt] = useState(null)
  const startedAt = useRef(Date.now())
  const summaryRef = useRef(null)

  useEffect(() => {
    if (finishedAt) return undefined
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt.current) / 1000)))
    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [finishedAt])

  const formatSessionTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return h > 0 ? [h, m, s].map((v) => String(v).padStart(2, '0')).join(':') : [m, s].map((v) => String(v).padStart(2, '0')).join(':')
  }

  const totalUnits = useMemo(() => sessionExercises.reduce((sum, e) => sum + e.sets.length, 0), [sessionExercises])
  const completedUnits = useMemo(() => sessionExercises.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0), [sessionExercises])
  const allComplete = totalUnits > 0 && completedUnits === totalUnits

  const handleChangeSet = (exIndex, setIndex, updatedSet) => setSessionExercises((prev) => prev.map((ex, i) => i !== exIndex ? ex : { ...ex, sets: ex.sets.map((s, j) => j === setIndex ? updatedSet : s) }))
  const handleToggleSet = (exIndex, setIndex) => setSessionExercises((prev) => prev.map((ex, i) => {
    if (i !== exIndex) return ex
    const nextSets = ex.sets.map((s, j) => j === setIndex ? { ...s, completed: !s.completed } : s)
    if (!ex.sets[setIndex].completed) setRestSession({ key: generateId('rest'), seconds: ex.restSeconds })
    return { ...ex, sets: nextSets }
  }))

  const handleFinish = () => {
    const stoppedAt = Date.now()
    const durationSeconds = Math.max(0, Math.floor((stoppedAt - startedAt.current) / 1000))
    setElapsedSeconds(durationSeconds)
    setFinishedAt(stoppedAt)
    addHistoryEntry({
      workoutId: workout.id, workoutName: workout.name, durationSeconds,
      exercises: sessionExercises.map((e) => ({ exerciseId: e.exerciseId, type: 'strength', name: e.name, muscleGroups: e.muscleGroups, sets: e.sets })),
    })
    setConfirmFinish(false)
    setSummaryOpen(true)
  }

  // Pré-gera a imagem assim que o resumo é exibido. Isso é essencial para o
  // Safari/iOS: se a captura fosse feita dentro do handler de clique (com
  // `await` antes de navigator.share), o navegador perde o "user activation"
  // do clique e rejeita o compartilhamento silenciosamente.
  useEffect(() => {
    if (!summaryOpen) return undefined
    let cancelled = false
    setSummaryBlob(null)
    setShareError(null)
    const timer = window.setTimeout(async () => {
      try {
        const blob = await elementToPng(summaryRef.current, 2.5)
        if (!cancelled) setSummaryBlob(blob)
      } catch (error) {
        console.error(error)
        if (!cancelled) setShareError('Não foi possível gerar a imagem do resumo.')
      }
    }, 50) // pequeno atraso para garantir que o modal já pintou por completo
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [summaryOpen, captureAttempt])

  const shareSummary = (target) => {
    if (!summaryBlob) return
    setSharing(true)
    try {
      const file = new File([summaryBlob], `${workout.name.replace(/\s+/g, '-').toLowerCase()}-treino.png`, { type: 'image/png' })
      if (target === 'x' && !navigator.canShare?.({ files: [file] })) {
        downloadBlob(summaryBlob, file.name)
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Treino ${workout.name} concluído 💪`)}`, '_blank', 'noopener,noreferrer')
      } else if (navigator.canShare?.({ files: [file] })) {
        navigator.share({ files: [file], title: workout.name, text: target === 'instagram' ? 'Compartilhar no Instagram' : `Treino ${workout.name}` })
          .catch((error) => { if (error?.name !== 'AbortError') { console.error(error); setShareError('Não foi possível compartilhar a imagem.') } })
      } else {
        downloadBlob(summaryBlob, file.name)
      }
    } finally {
      setSharing(false)
    }
  }

  if (!workout) return <div className="p-6"><p className="text-graphite-300">Treino não encontrado.</p><Button className="mt-4" onClick={onExit}>Voltar</Button></div>

  return (
    <div className="min-h-screen bg-graphite-950 flex flex-col">
      <header className="sticky top-0 z-30 bg-graphite-950/95 backdrop-blur border-b border-graphite-800 px-4 py-3.5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setConfirmExit(true)} className="p-1.5 -ml-1.5 text-graphite-400 hover:text-graphite-100"><ArrowLeft size={22} /></button>
          <div className="flex-1"><h1 className="font-display text-lg font-bold text-graphite-50 leading-tight">{workout.name}</h1><p className="text-xs text-graphite-500">{completedUnits}/{totalUnits} etapas concluídas</p></div>
          <div className="rounded-xl border border-graphite-700 bg-graphite-900 px-3 py-2 text-right min-w-[78px]"><div className="flex items-center justify-end gap-1 text-sulfur-400"><Clock3 size={14} /><span className="text-[10px] uppercase tracking-wider">Sessão</span></div><div className="font-mono text-base font-bold tabular-nums text-graphite-50">{formatSessionTime(elapsedSeconds)}</div></div>
          <div className="w-11 h-11 relative shrink-0"><svg viewBox="0 0 40 40" className="w-11 h-11 -rotate-90"><circle cx="20" cy="20" r="16" fill="none" stroke="#2A2E34" strokeWidth="4" /><circle cx="20" cy="20" r="16" fill="none" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - (totalUnits ? completedUnits / totalUnits : 0))}`} /></svg><span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-graphite-200">{totalUnits ? Math.round((completedUnits / totalUnits) * 100) : 0}%</span></div>
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 space-y-4 pb-32">
        {sessionExercises.map((ex, i) => (
          <ExerciseCard key={ex.exerciseId} exercise={ex} lastPerformance={getLastPerformance(ex.name)} onChangeSet={(setIndex, updated) => handleChangeSet(i, setIndex, updated)} onToggleSet={(setIndex) => handleToggleSet(i, setIndex)} />
        ))}

        <div className="pt-2">{confirmFinish && !allComplete ? <div className="rounded-xl bg-graphite-800 border border-graphite-700 p-4 space-y-3"><p className="text-sm text-graphite-300">Você ainda tem etapas não concluídas. Finalizar mesmo assim?</p><div className="flex gap-2"><Button variant="complete" icon={Flag} onClick={handleFinish}>Finalizar treino</Button><Button variant="ghost" onClick={() => setConfirmFinish(false)}>Continuar</Button></div></div> : <Button size="lg" fullWidth variant={allComplete ? 'complete' : 'secondary'} icon={allComplete ? CheckCircle2 : Flag} onClick={() => allComplete ? handleFinish() : setConfirmFinish(true)}>{allComplete ? 'Concluir treino' : 'Finalizar treino'}</Button>}</div>
      </div>

      {summaryOpen && <div className="fixed inset-0 z-50 bg-black/85 overflow-y-auto px-4 py-6"><div className="max-w-xl mx-auto space-y-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-graphite-200">Treino concluído</p><button onClick={() => onFinish()}  className="p-2 rounded-full bg-graphite-800 text-graphite-200"><X size={20} /></button></div><WorkoutSummary ref={summaryRef} workout={workout} />
        {shareError ? (
          <div className="rounded-xl bg-danger-500/10 border border-danger-500/30 p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-danger-300">{shareError}</p>
            <button onClick={() => setCaptureAttempt((n) => n + 1)} className="text-xs font-semibold text-danger-300 underline shrink-0">Tentar novamente</button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" icon={Share2} disabled={sharing || !summaryBlob} onClick={() => shareSummary('instagram')}>Instagram</Button>
            <Button variant="secondary" icon={Share2} disabled={sharing || !summaryBlob} onClick={() => shareSummary('whatsapp')}>WhatsApp</Button>
            <Button variant="secondary" icon={Share2} disabled={sharing || !summaryBlob} onClick={() => shareSummary('x')}>X</Button>
          </div>
        )}
        {!summaryBlob && !shareError && <p className="text-[11px] text-graphite-500 text-center">Gerando imagem do resumo…</p>}
        <Button size="lg" fullWidth variant="success" onClick={onFinish}>Voltar ao início</Button><p className="text-[11px] leading-relaxed text-graphite-500 text-center">Em navegadores compatíveis, a imagem abre o menu nativo de compartilhamento para você escolher o app. Quando o navegador não permite anexar a imagem diretamente, ela é salva e o destino é aberto como alternativa.</p></div></div>}

      {confirmExit && <div className="fixed inset-0 z-50 flex items-center justify-center px-6"><div className="absolute inset-0 bg-black/70" onClick={() => setConfirmExit(false)} /><div className="relative bg-graphite-900 border border-graphite-700 rounded-2xl p-5 w-full max-w-sm space-y-4"><h3 className="font-display text-lg font-bold text-graphite-50">Sair do treino?</h3><p className="text-sm text-graphite-400">O progresso desta sessão não será salvo se você sair agora.</p><div className="flex gap-2"><Button variant="danger" onClick={onExit}>Sair sem salvar</Button><Button variant="ghost" onClick={() => setConfirmExit(false)}>Continuar</Button></div></div></div>}
      <RestTimer session={restSession} onClose={() => setRestSession(null)} />
    </div>
  )
}
