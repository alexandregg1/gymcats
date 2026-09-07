import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loadState, saveState, ensureProfileBucket } from '../utils/storage.js'
import { generateId } from '../utils/id.js'

const AppDataContext = createContext(null)

const PROFILE_COLORS = ['sulfur', 'chalk', 'success', 'danger']

export function AppDataProvider({ children }) {
  const [state, setState] = useState(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  // ---------- PERFIS ----------

  const profiles = state.profiles
  const activeProfileId = state.activeProfileId
  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || null,
    [profiles, activeProfileId],
  )

  const addProfile = useCallback((profileInput) => {
    const rawName = typeof profileInput === 'string' ? profileInput : profileInput?.name || ''
    const trimmed = rawName.trim()
    if (!trimmed) return
    const weightKg = typeof profileInput === 'string' ? null : Number(profileInput?.weightKg) || null
    const heightCm = typeof profileInput === 'string' ? null : Number(profileInput?.heightCm) || null
    setState((prev) => {
      const id = generateId('profile')
      const next = {
        ...prev,
        profiles: [
          ...prev.profiles,
          {
            id,
            name: trimmed,
            color: PROFILE_COLORS[prev.profiles.length % PROFILE_COLORS.length],
            avatarId: null,
            weightKg,
            heightCm,
            createdAt: new Date().toISOString(),
          },
        ],
        activeProfileId: id,
        data: { ...prev.data },
      }
      ensureProfileBucket(next, id)
      return next
    })
  }, [])

  const switchProfile = useCallback((profileId) => {
    setState((prev) => ({ ...prev, activeProfileId: profileId }))
  }, [])

  const deleteProfile = useCallback((profileId) => {
    setState((prev) => {
      const remainingProfiles = prev.profiles.filter((p) => p.id !== profileId)
      const nextData = { ...prev.data }
      delete nextData[profileId]
      const nextActive =
        prev.activeProfileId === profileId
          ? remainingProfiles[0]?.id ?? null
          : prev.activeProfileId
      return {
        ...prev,
        profiles: remainingProfiles,
        data: nextData,
        activeProfileId: nextActive,
      }
    })
  }, [])

  const renameProfile = useCallback((profileId, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === profileId ? { ...p, name: trimmed } : p)),
    }))
  }, [])

  const updateProfileAvatar = useCallback((profileId, avatarId) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === profileId ? { ...p, avatarId } : p)),
    }))
  }, [])

  // ---------- BUCKET DO PERFIL ATIVO ----------

  const bucket = (activeProfileId && state.data[activeProfileId]) || { workouts: [], history: [], assessments: [] }
  const workouts = bucket.workouts || []
  const history = bucket.history || []
  const assessments = bucket.assessments || []

  const mutateBucket = useCallback(
    (mutator) => {
      if (!activeProfileId) return
      setState((prev) => {
        const nextData = { ...prev.data }
        const current = nextData[activeProfileId] || { workouts: [], history: [], assessments: [] }
        nextData[activeProfileId] = mutator({
          workouts: [...(current.workouts || [])],
          history: [...(current.history || [])],
          assessments: [...(current.assessments || [])],
        })
        return { ...prev, data: nextData }
      })
    },
    [activeProfileId],
  )

  // ---------- TREINOS (FICHAS) ----------

  const addWorkout = useCallback(
    (workout) => {
      const id = generateId('workout')
      mutateBucket((b) => ({
        ...b,
        workouts: [
          ...b.workouts,
          {
            id,
            name: workout.name,
            focus: workout.focus || '',
            weekdays: workout.weekdays || [],
            exercises: workout.exercises || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }))
      return id
    },
    [mutateBucket],
  )

  const updateWorkout = useCallback(
    (workoutId, patch) => {
      mutateBucket((b) => ({
        ...b,
        workouts: b.workouts.map((w) =>
          w.id === workoutId ? { ...w, ...patch, updatedAt: new Date().toISOString() } : w,
        ),
      }))
    },
    [mutateBucket],
  )

  const deleteWorkout = useCallback(
    (workoutId) => {
      mutateBucket((b) => ({
        ...b,
        workouts: b.workouts.filter((w) => w.id !== workoutId),
      }))
    },
    [mutateBucket],
  )

  const getWorkout = useCallback((workoutId) => workouts.find((w) => w.id === workoutId) || null, [
    workouts,
  ])

  // ---------- HISTÓRICO ----------

  const addHistoryEntry = useCallback(
    (entry) => {
      const id = generateId('session')
      mutateBucket((b) => ({
        ...b,
        history: [
          {
            id,
            date: new Date().toISOString(),
            ...entry,
          },
          ...b.history,
        ],
      }))
      return id
    },
    [mutateBucket],
  )

  const deleteHistoryEntry = useCallback(
    (sessionId) => {
      mutateBucket((b) => ({
        ...b,
        history: b.history.filter((h) => h.id !== sessionId),
      }))
    },
    [mutateBucket],
  )


  // ---------- AVALIAÇÕES FÍSICAS ----------

  const addAssessment = useCallback(
    (assessment) => {
      const id = generateId('assessment')
      mutateBucket((b) => ({
        ...b,
        assessments: [
          { id, createdAt: new Date().toISOString(), ...assessment },
          ...b.assessments,
        ],
      }))
      return id
    },
    [mutateBucket],
  )

  const updateAssessment = useCallback(
    (assessmentId, patch) => {
      mutateBucket((b) => ({
        ...b,
        assessments: b.assessments.map((a) =>
          a.id === assessmentId ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a,
        ),
      }))
    },
    [mutateBucket],
  )

  const deleteAssessment = useCallback(
    (assessmentId) => {
      mutateBucket((b) => ({
        ...b,
        assessments: b.assessments.filter((a) => a.id !== assessmentId),
      }))
    },
    [mutateBucket],
  )

  // Retorna o último desempenho registrado para um exercício específico (por nome),
  // usado para sugerir carga/reps na tela de execução e no editor de fichas.
  const getLastPerformance = useCallback(
    (exerciseName) => {
      for (const session of history) {
        const found = session.exercises?.find(
          (e) => e.name.trim().toLowerCase() === exerciseName.trim().toLowerCase(),
        )
        if (found && Array.isArray(found.sets)) {
          const bestSet = found.sets.reduce((best, s) => {
            if (!s.completed) return best
            if (!best) return s
            return (s.actualLoad ?? 0) > (best.actualLoad ?? 0) ? s : best
          }, null)
          return { date: session.date, sets: found.sets, bestSet }
        }
      }
      return null
    },
    [history],
  )

  // Série histórica (data + melhor carga) de um exercício, do mais antigo ao mais recente
  const getExerciseProgress = useCallback(
    (exerciseName) => {
      const points = []
      for (const session of [...history].reverse()) {
        const found = session.exercises?.find(
          (e) => e.name.trim().toLowerCase() === exerciseName.trim().toLowerCase(),
        )
        if (found && Array.isArray(found.sets)) {
          const completedSets = found.sets.filter((s) => s.completed)
          if (completedSets.length === 0) continue
          const maxLoad = Math.max(...completedSets.map((s) => s.actualLoad ?? 0))
          points.push({ date: session.date, load: maxLoad })
        }
      }
      return points
    },
    [history],
  )

  // ---------- MÉTRICAS CORPORAIS (usadas pelo módulo de Cardio) ----------

  // Retorna o peso/altura da avaliação física mais recente do perfil ativo.
  // Fonte única de verdade para qualquer cálculo que dependa desses dados
  // (ex.: estimativa de calorias no timer de Cardio).
  const latestBodyMetrics = useMemo(() => {
    const sorted = [...assessments].sort((a, b) => new Date(b.date) - new Date(a.date))
    const latest = sorted[0] || null
    return {
      // Peso e altura são definidos no onboarding do perfil.
      // Avaliações antigas continuam servindo como fallback para não perder dados legados.
      weightKg: Number(latest?.weight) || activeProfile?.weightKg || null,
      heightCm: activeProfile?.heightCm || latest?.height || null,
      assessedAt: latest?.date || activeProfile?.createdAt || null,
    }
  }, [assessments, activeProfile])

  const value = {
    profiles,
    activeProfile,
    activeProfileId,
    addProfile,
    switchProfile,
    deleteProfile,
    renameProfile,
    updateProfileAvatar,
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkout,
    history,
    addHistoryEntry,
    deleteHistoryEntry,
    getLastPerformance,
    getExerciseProgress,
    assessments,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    latestBodyMetrics,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData deve ser usado dentro de <AppDataProvider>')
  return ctx
}
