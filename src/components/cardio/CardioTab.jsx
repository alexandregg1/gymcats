import React, { useState } from 'react'
import { Scale } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext.jsx'
import CardioTypeSelector from './CardioTypeSelector.jsx'
import CardioTimer from './CardioTimer.jsx'
import CardioResultModal from './CardioResultModal.jsx'
import { CARDIO_TYPES } from '../../data/exercises.js'
import { CARDIO_MET, DEFAULT_MET } from '../../data/cardioMet.js'
import { estimateCardioCalories } from '../../utils/calorieCalculator.js'

export default function CardioTab({ onGoToAssessments }) {
  const { latestBodyMetrics, addHistoryEntry, activeProfileId } = useAppData()
  const [cardioType, setCardioType] = useState(CARDIO_TYPES[0])
  const [result, setResult] = useState(null)

  // O cálculo usa o peso cadastrado no onboarding do perfil.
  if (!latestBodyMetrics.weightKg) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-3">
        <Scale className="mx-auto text-graphite-500" size={32} />
        <p className="text-graphite-300 font-semibold">Cadastre seu peso no perfil</p>
        <p className="text-sm text-graphite-500">O cálculo de calorias precisa do peso cadastrado no início.</p>
        <button onClick={onGoToAssessments} className="text-sulfur-400 text-sm font-semibold underline">
          Volte ao perfil para completar seus dados
        </button>
      </div>
    )
  }

  const handleTimerFinish = (durationSeconds) => {
    const durationMinutes = Math.round(durationSeconds / 60)
    const met = CARDIO_MET[cardioType] ?? DEFAULT_MET
    const calories = estimateCardioCalories({
      met,
      weightKg: latestBodyMetrics.weightKg,
      heightCm: latestBodyMetrics.heightCm,
      durationMinutes,
    })

    // Reaproveita o mesmo formato de exercício 'cardio' já suportado por
    // History, HistorySessionCard e MonthlyAnalytics — nenhuma alteração
    // adicional é necessária nesses componentes.
    addHistoryEntry({
      workoutId: null,
      workoutName: `Cardio · ${cardioType}`,
      durationSeconds,
      exercises: [{
        exerciseId: `cardio-${Date.now()}`,
        type: 'cardio',
        name: cardioType,
        cardioType,
        durationMinutes,
        distanceKm: null,
        calories,
        completed: true,
      }],
    })

    setResult({ cardioType, durationMinutes, calories })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-graphite-50">Cardio</h1>
        <p className="text-sm text-graphite-400">Escolha o tipo, cronometre e acompanhe as calorias estimadas.</p>
      </div>

      <CardioTypeSelector value={cardioType} onChange={setCardioType} />
      <CardioTimer key={cardioType} storageKey={`gymcat_cardio_timer_${activeProfileId || "default"}_${cardioType}`} onFinish={handleTimerFinish} />

      {result && <CardioResultModal result={result} onClose={() => setResult(null)} />}
    </div>
  )
}
