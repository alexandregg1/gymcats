// Tabela de MET (Metabolic Equivalent of Task) por tipo de cardio.
// Valores aproximados com base no Compendium of Physical Activities.
// TODO(produto/educação física): validar e calibrar esses valores antes do lançamento.
export const CARDIO_MET = {
  'Esteira': 7.0,
  'Bicicleta': 7.5,
  'Elíptico': 5.0,
  'Caminhada': 3.5,
  'Corrida na Rua': 9.8,
  'Escada': 8.8,
}

// Usado como fallback quando o tipo de cardio não estiver mapeado na tabela acima.
export const DEFAULT_MET = 5.0

// Opções rápidas exibidas no timer da aba Cardio (em minutos).
export const TIMER_PRESETS_MINUTES = [10, 20, 30]
