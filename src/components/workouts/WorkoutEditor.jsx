import React, { useState } from 'react'
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { Input, Label } from '../ui/Field.jsx'
import ExerciseFormRow from './ExerciseFormRow.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { WEEKDAY_LABELS } from '../../utils/dates.js'
import { generateId } from '../../utils/id.js'

function emptyExercise() {
  return {
    id: generateId('ex'),
    type: 'strength',
    name: '',
    muscleGroups: [],
    sets: 3,
    reps: '10-12',
    load: 0,
    restSeconds: 60,
  }
}

export default function WorkoutEditor({ workoutId, initialDraft = null, onDone, onCancel }) {
  const { getWorkout, addWorkout, updateWorkout, deleteWorkout } = useAppData()
  const existing = workoutId ? getWorkout(workoutId) : null

  const [name, setName] = useState(existing?.name || initialDraft?.name || '')
  const [focus, setFocus] = useState(existing?.focus || initialDraft?.focus || '')
  const [weekdays, setWeekdays] = useState(existing?.weekdays || initialDraft?.weekdays || [])
  const [exercises, setExercises] = useState(
    existing?.exercises?.length
      ? existing.exercises
      : initialDraft?.exercises?.length
        ? initialDraft.exercises
        : [emptyExercise()],
  )
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggleWeekday = (day) => {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const updateExercise = (index, updated) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? updated : ex)))
  }

  const removeExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  const addExercise = () => setExercises((prev) => [...prev, emptyExercise()])

  const canSave = name.trim().length > 0 && exercises.some((ex) => ex.name.trim().length > 0)

  const handleSave = () => {
    const cleanExercises = exercises.filter((ex) => ex.name.trim().length > 0).map((ex) => ({ ...ex, type: ex.type || 'strength' }))
    const payload = { name: name.trim(), focus: focus.trim(), weekdays, exercises: cleanExercises }
    if (existing) {
      updateWorkout(existing.id, payload)
    } else {
      addWorkout(payload)
    }
    onDone()
  }

  const handleDelete = () => {
    deleteWorkout(existing.id)
    onDone()
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-2 -ml-2 text-graphite-400 hover:text-graphite-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-graphite-50 tracking-tight">
            {existing ? 'Editar treino' : initialDraft ? 'Revisar ficha importada' : 'Novo treino'}
          </h1>
          {initialDraft && !existing && (
            <p className="text-xs text-graphite-500 mt-0.5">Confira os dados reconhecidos antes de salvar.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Nome da ficha</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Treino A" />
        </div>
        <div>
          <Label>Foco (opcional)</Label>
          <Input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="Ex: Superior, Peito e tríceps..."
          />
        </div>
        <div>
          <Label>Dias da semana</Label>
          <div className="flex gap-2 flex-wrap">
            {WEEKDAY_LABELS.map((label, day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekday(day)}
                className={`w-11 h-11 rounded-full text-sm font-semibold border transition-colors ${
                  weekdays.includes(day)
                    ? 'bg-sulfur-400 text-graphite-950 border-sulfur-400'
                    : 'bg-graphite-800 text-graphite-300 border-graphite-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-graphite-500 mt-2">
            Nos dias marcados, este treino aparecerá em destaque no seu Dashboard.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-graphite-200">Exercícios</h2>
          <span className="text-xs text-graphite-500">{exercises.length} adicionado(s)</span>
        </div>

        {exercises.map((ex, i) => (
          <ExerciseFormRow
            key={ex.id}
            exercise={ex}
            onChange={(updated) => updateExercise(i, updated)}
            onRemove={() => removeExercise(i)}
          />
        ))}

        <Button variant="secondary" fullWidth icon={Plus} onClick={addExercise}>
          Adicionar exercício
        </Button>
      </div>

      <div className="flex gap-3 pt-2">
        <Button fullWidth size="lg" icon={Save} onClick={handleSave} disabled={!canSave}>
          Salvar treino
        </Button>
      </div>

      {existing && (
        <div className="pt-2 border-t border-graphite-800">
          {confirmDelete ? (
            <div className="flex items-center gap-2 pt-4">
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Confirmar exclusão
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 pt-4 text-sm font-medium text-danger-400 hover:text-danger-300"
            >
              <Trash2 size={15} /> Excluir treino
            </button>
          )}
        </div>
      )}
    </div>
  )
}
