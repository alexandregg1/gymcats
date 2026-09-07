import React from 'react'
import { Flame, X } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function CardioResultModal({ result, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-6">
      <div className="relative bg-graphite-900 border border-graphite-700 rounded-2xl p-6 w-full max-w-sm space-y-4 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-graphite-400" aria-label="Fechar">
          <X size={20} />
        </button>
        <Flame className="mx-auto text-sulfur-400" size={32} />
        <h2 className="font-display text-2xl font-bold text-graphite-50">{result.cardioType}</h2>
        <p className="text-graphite-400 text-sm">{result.durationMinutes} min concluídos</p>
        <p className="font-mono text-4xl font-bold text-sulfur-400">{result.calories} kcal</p>
        <p className="text-[11px] text-graphite-500">
          Estimativa baseada no seu peso mais recente registrado em Avaliação.
        </p>
        <Button fullWidth size="lg" variant="complete" onClick={onClose}>Concluir</Button>
      </div>
    </div>
  )
}
