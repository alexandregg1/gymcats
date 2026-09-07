import React, { useState } from 'react'
import { Plus, Dumbbell, FileInput } from 'lucide-react'
import Button from '../ui/Button.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import WorkoutCard from './WorkoutCard.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import WorkoutImportModal from './WorkoutImportModal.jsx'

export default function WorkoutList({ onStart, onEdit, onCreate, onImport }) {
  const { workouts } = useAppData()
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-graphite-50 tracking-tight">
          Meus treinos
        </h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" icon={FileInput} onClick={() => setImportOpen(true)}>
            Importar
          </Button>
          <Button size="sm" icon={Plus} onClick={onCreate}>
            Novo
          </Button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Nenhum treino criado"
          description="Crie sua primeira ficha para começar a acompanhar suas cargas e evolução."
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button icon={Plus} onClick={onCreate}>Criar meu primeiro treino</Button>
              <Button variant="secondary" icon={FileInput} onClick={() => setImportOpen(true)}>Importar ficha</Button>
            </div>
          }
        />
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} onStart={onStart} onEdit={onEdit} />
          ))}
        </div>
      )}
      <WorkoutImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={onImport}
      />
    </div>
  )
}
