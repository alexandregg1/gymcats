import MuscleOverlay from './MuscleOverlay.jsx'

/**
 * Compatibilidade com o componente usado no resumo do treino.
 * A visualização agora é feita por camadas de imagens anatômicas.
 */
export default function AnatomyFigure({ side = 'front', muscleGroups = [] }) {
  return <MuscleOverlay side={side} muscleGroups={muscleGroups} />
}
