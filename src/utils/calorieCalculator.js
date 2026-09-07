/**
 * Estimativa de gasto calórico em atividades de cardio.
 *
 * Fórmula padrão baseada em METs (ACSM - American College of Sports Medicine):
 *   Kcal/min = (MET x 3.5 x peso_kg) / 200
 *   Kcal_total = Kcal/min x duração_min
 *
 * Nota de engenharia: esta fórmula, que é o padrão de mercado para esse tipo
 * de estimativa, NÃO utiliza altura — apenas peso corporal, tempo de atividade
 * e a intensidade do exercício (MET). O parâmetro `heightCm` é aceito aqui
 * para manter o contrato de dados pedido (Peso + Altura vindos da Avaliação)
 * e para permitir, no futuro, evoluir para uma fórmula baseada em Taxa
 * Metabólica Basal (ex.: Mifflin-St Jeor), que combina peso, altura, idade
 * e sexo — dados de idade/sexo ainda não existem no cadastro do usuário.
 *
 * @param {Object} params
 * @param {number} params.met - Fator MET do tipo de cardio selecionado.
 * @param {number} params.weightKg - Peso do usuário (kg), vindo de Avaliação.
 * @param {number} [params.heightCm] - Altura do usuário (cm), vindo de Avaliação. Não usado no cálculo atual.
 * @param {number} params.durationMinutes - Duração da sessão de cardio, em minutos.
 * @returns {number} Estimativa de calorias gastas (kcal), arredondada.
 */
export function estimateCardioCalories({ met, weightKg, heightCm, durationMinutes }) {
  if (!met || !weightKg || !durationMinutes) return 0
  const kcalPerMinute = (met * 3.5 * weightKg) / 200
  return Math.round(kcalPerMinute * durationMinutes)
}
