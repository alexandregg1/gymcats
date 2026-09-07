export const MUSCLE_GROUPS = [
  'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Antebraços',
  'Abdômen', 'Glúteos', 'Quadríceps', 'Posteriores', 'Panturrilhas',
]

export const CARDIO_TYPES = ['Esteira', 'Bicicleta', 'Elíptico', 'Caminhada', 'Corrida na Rua', 'Escada']

export function normalizeMuscleName(value = '') {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}
