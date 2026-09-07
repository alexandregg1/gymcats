import React from 'react';

// Imagens base
import frontModel from '../../assets/front_model.png';
import backModel from '../../assets/back_model.png';

// Frente
import shoulders from '../../assets/front-shoulders.png';
import chest from '../../assets/front-chest.png';
import biceps from '../../assets/front-biceps.png';
import forearm from '../../assets/front-forearm.png';
import abs from '../../assets/front-abs.png';
import quads from '../../assets/front-quads.png';

// Costas
import lats from '../../assets/back-lats.png';
import triceps from '../../assets/back-triceps.png';
import hams from '../../assets/back-hams.png';
import glutes from '../../assets/back-glutes.png';
import calves from '../../assets/back-calves.png';
import { normalizeMuscleName } from '../../data/exercises.js';

const MUSCLE_LAYERS = [
  { side: 'front', image: shoulders, groups: ['Ombros'] },
  { side: 'front', image: chest, groups: ['Peito'] },
  { side: 'front', image: biceps, groups: ['Bíceps'] },
  { side: 'front', image: forearm, groups: ['Antebraços'] },
  { side: 'front', image: abs, groups: ['Abdômen'] },
  { side: 'front', image: quads, groups: ['Quadríceps'] },

  { side: 'back', image: lats, groups: ['Costas'] },
  { side: 'back', image: triceps, groups: ['Tríceps'] },
  { side: 'back', image: hams, groups: ['Posteriores'] },
  { side: 'back', image: glutes, groups: ['Glúteos'] },
  { side: 'back', image: calves, groups: ['Panturrilhas'] },
];

export default function MuscleOverlay({ side = 'front', muscleGroups = [] }) {
  const normalizedSide = side === 'back' ? 'back' : 'front';
  
  const selectedGroups = new Set(
    (Array.isArray(muscleGroups) ? muscleGroups : []).map(normalizeMuscleName)
  );

  const baseImage = normalizedSide === 'front' ? frontModel : backModel;

  // Lógica: Pegamos todos os músculos ativos e os colocamos em um array
  const activeLayers = MUSCLE_LAYERS
    .filter((layer) => layer.side === normalizedSide)
    .filter((layer) => layer.groups.some((group) => selectedGroups.has(normalizeMuscleName(group))));

  return (
    <div className="relative w-full aspect-[1/1] overflow-hidden pointer-events-none">
      
      {/* 1. Camada Base (Sempre visível) */}
      <img
        src={baseImage}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute inset-0 w-full h-full object-contain select-none"
        style={{ zIndex: 0 }}
      />

      {/* 2. Renderiza SOMENTE os músculos que estão ativos, um por cima do outro */}
      {activeLayers.map((layer) => (
        <img
          key={layer.groups[0]}
          src={layer.image}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            zIndex: 1, // Todos sobem para a camada 1, sobre o corpo
            opacity: 1,
            // O glow já vem embutido no próprio sprite (fundo transparente fora do músculo),
            // então não aplicamos mais drop-shadow aqui — isso evitava o "quadrado" de sombra
            // por trás de cada camada quando várias eram somadas.
            transition: 'opacity 0.5s ease',
          }}
        />
      ))}
    </div>
  );
}