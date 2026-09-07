// Migração de dados: o cardio deixou de ser um "tipo de exercício" dentro das
// fichas de musculação e passou a ter sua própria aba dedicada.
// Esta função remove exercícios do tipo 'cardio' das FICHAS DE TREINO
// (workouts) de todos os perfis, uma única vez, ao carregar o app.
//
// Importante: o histórico (bucket.history) NUNCA é alterado aqui — sessões
// já concluídas são registros do passado e devem continuar sendo exibidas
// exatamente como foram registradas (History, MonthlyAnalytics, etc.).
export function stripCardioFromWorkouts(state) {
  const nextData = {}
  for (const [profileId, bucket] of Object.entries(state.data || {})) {
    nextData[profileId] = {
      ...bucket,
      workouts: (bucket.workouts || []).map((w) => ({
        ...w,
        exercises: (w.exercises || []).filter((ex) => ex.type !== 'cardio'),
      })),
    }
  }
  return { ...state, data: nextData }
}
