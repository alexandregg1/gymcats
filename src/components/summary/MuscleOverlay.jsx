import React from 'react';
import { normalizeMuscleName } from '../../data/exercises.js';

// Imagens base
import frontModel from '../../assets/anatomy/front_model.png';
import backModel from '../../assets/anatomy/back_model.png';

// Frente
import shoulders from '../../assets/anatomy/front-shoulders.png';
import chest from '../../assets/anatomy/front-chest.png';
import biceps from '../../assets/anatomy/front-biceps.png';
import forearm from '../../assets/anatomy/front-forearm.png';
import abs from '../../assets/anatomy/front-abs.png';
import quads from '../../assets/anatomy/front-quads.png';

// Costas
import lats from '../../assets/anatomy/back-lats.png';
import triceps from '../../assets/anatomy/back-triceps.png';
import hams from '../../assets/anatomy/back-hams.png';
import glutes from '../../assets/anatomy/back-glutes.png';
import calves from '../../assets/anatomy/back-calves.png';

const MUSCLE_LAYERS = [
  { side: 'front', image: shoulders, groups: ['Ombros'] },
  { side: 'front', image: chest, groups: ['Peito'] },
  { side: 'front', image: biceps, groups: ['Bíceps'] },
  { side: 'front', image: forearm, groups: ['Antebraço', 'Antebraços'] },
  { side: 'front', image: abs, groups: ['Abdômen', 'Abdominais'] },
  { side: 'front', image: quads, groups: ['Quadríceps'] },

  { side: 'back', image: lats, groups: ['Costas', 'Dorsais', 'Trapézio', 'Trapézio Inferior', 'Eretores da Espinha'] },
  { side: 'back', image: triceps, groups: ['Tríceps'] },
  { side: 'back', image: hams, groups: ['Posteriores', 'Posterior de Coxa', 'Posteriores de Coxa'] },
  { side: 'back', image: glutes, groups: ['Glúteos'] },
  { side: 'back', image: calves, groups: ['Panturrilhas', 'Panturrilha'] },
];

export default function MuscleOverlay({ side = 'front', muscleGroups = [] }) {
  const normalizedSide = side === 'back' ? 'back' : 'front';

  const selectedGroups = new Set(
    (Array.isArray(muscleGroups) ? muscleGroups : []).map(normalizeMuscleName),
  );

  const baseImage = normalizedSide === 'front' ? frontModel : backModel;

  return (
    <div className="relative w-full aspect-[1/1] overflow-hidden pointer-events-none">
      <img
        src={baseImage}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute inset-0 w-full h-full object-contain select-none"
        style={{ zIndex: 0 }}
      />

      {MUSCLE_LAYERS
        .filter((layer) => layer.side === normalizedSide)
        .map((layer) => {
          const isActive = layer.groups.some((group) =>
            selectedGroups.has(normalizeMuscleName(group)),
          );

          return (
            <img
              key={`${layer.side}-${layer.groups[0]}`}
              src={layer.image}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="absolute inset-0 w-full h-full object-contain select-none"
              style={{
                zIndex: 1,
                opacity: isActive ? 1 : 0,
                filter: isActive ? 'drop-shadow(0 0 10px #A855F7)' : 'none',
                transition: 'opacity 0.5s ease, filter 0.5s ease',
              }}
            />
          );
        })}
    </div>
  );
}
