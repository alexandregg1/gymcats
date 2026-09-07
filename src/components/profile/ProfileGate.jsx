import React, { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { Input, Label } from '../ui/Field.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import ProfileAvatar from './ProfileAvatar.jsx'
import logoGymcat from '../../assets/logo-gymcat.png'

export default function ProfileGate() {
  const { profiles, addProfile, switchProfile } = useAppData()
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [creating, setCreating] = useState(profiles.length === 0)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addProfile({
      name,
      weightKg: Number(weight) || null,
      heightCm: Number(height) || null,
    })
    setName('')
    setWeight('')
    setHeight('')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <img
            src={logoGymcat}
            alt="GymCat"
            className="h-20 w-auto object-contain mb-4 select-none"
            draggable="false"
          />
          <p className="text-graphite-400 text-sm">
            Gestão de treinos e acompanhamento de cargas
          </p>
        </div>

        {profiles.length > 0 && !creating && (
          <div className="space-y-2 mb-5">
            <Label>Quem está treinando?</Label>
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => switchProfile(p.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-graphite-800 border border-graphite-700 hover:border-sulfur-400/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ProfileAvatar profile={p} size="md" />
                  <span className="font-medium text-graphite-100">{p.name}</span>
                </div>
                <ArrowRight size={18} className="text-graphite-500" />
              </button>
            ))}
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 justify-center px-4 py-3 rounded-xl border border-dashed border-graphite-600 text-graphite-400 hover:text-sulfur-300 hover:border-sulfur-400/50 transition-colors text-sm font-medium"
            >
              <Plus size={16} /> Criar novo perfil
            </button>
          </div>
        )}

        {creating && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Como podemos te chamar?</Label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana, Bruno..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 72,5"
                />
              </div>
              <div>
                <Label>Altura (cm)</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ex: 175"
                />
              </div>
            </div>
            <p className="text-xs text-graphite-500">Peso e altura serão usados para personalizar métricas e estimativas de calorias.</p>
            <Button type="submit" fullWidth size="lg" disabled={!name.trim() || !weight || !height}>
              Começar a treinar
            </Button>
            {profiles.length > 0 && (
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="w-full text-center text-sm text-graphite-400 hover:text-graphite-200"
              >
                Voltar para os perfis
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
