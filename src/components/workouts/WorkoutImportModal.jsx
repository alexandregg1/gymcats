import React, { useMemo, useRef, useState } from 'react'
import { ClipboardPaste, FileText, Upload, WandSparkles } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { parseWorkoutText } from '../../utils/workoutTextParser.js'

const EXAMPLE = `Treino A - Peito e Tríceps\nDias: Segunda e Quinta\nFoco: Hipertrofia\n\nSupino reto - 4x8-12 - 70kg - 90s\nSupino inclinado | 3 | 10-12 | 24kg | 60s\nCrossover 3x12 20kg 60s\nTríceps corda: 3x12, 25kg, descanso 60s`

export default function WorkoutImportModal({ open, onClose, onImport }) {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const fileRef = useRef(null)
  const parsed = useMemo(() => parseWorkoutText(text), [text])
  const count = parsed.workout?.exercises?.length || 0

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileError('')
    if (file.size > 1024 * 1024) {
      setFileError('O arquivo é muito grande. Use um TXT de até 1 MB.')
      return
    }
    try {
      const content = await file.text()
      setText(content)
      setFileName(file.name)
    } catch {
      setFileError('Não foi possível ler este arquivo como texto.')
    }
  }

  const handleClose = () => {
    setText('')
    setFileName('')
    setFileError('')
    onClose()
  }

  const handleImport = () => {
    if (!parsed.workout || count === 0) return
    onImport(parsed.workout)
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar ficha"
      footer={
        <>
          <Button variant="secondary" fullWidth onClick={handleClose}>Cancelar</Button>
          <Button fullWidth icon={WandSparkles} onClick={handleImport} disabled={count === 0}>Revisar ficha</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-chalk-600/40 bg-chalk-600/10 p-4">
          <div className="flex gap-3">
            <ClipboardPaste size={20} className="text-chalk-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-graphite-100">Cole sua ficha como ela estiver</p>
              <p className="text-xs text-graphite-400 mt-1 leading-relaxed">O importador reconhece formatos como “4x10”, carga em kg, descanso em segundos e tabelas separadas por |, ; ou TAB.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-graphite-300">Texto da ficha</label>
            {text && <button type="button" onClick={() => { setText(''); setFileName('') }} className="text-xs text-graphite-400 hover:text-graphite-200">Limpar</button>}
          </div>
          <textarea
            value={text}
            onChange={(event) => { setText(event.target.value); setFileName('') }}
            rows={10}
            placeholder={EXAMPLE}
            className="w-full resize-y bg-graphite-800 border border-graphite-600 rounded-lg px-3.5 py-3 text-sm text-graphite-50 placeholder-graphite-600 focus:border-sulfur-400 outline-none transition-colors leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-graphite-700" />
          <span className="text-xs text-graphite-500">ou</span>
          <div className="h-px flex-1 bg-graphite-700" />
        </div>

        <div>
          <input ref={fileRef} type="file" accept=".txt,.md,.csv,text/plain,text/csv" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-xl border border-dashed border-graphite-600 bg-graphite-800/60 p-4 text-left hover:border-graphite-500 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-graphite-700 flex items-center justify-center text-graphite-300"><Upload size={18} /></div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-graphite-200">Carregar arquivo TXT</p>
                <p className="text-xs text-graphite-500 truncate">{fileName || 'TXT, MD ou CSV de até 1 MB'}</p>
              </div>
            </div>
          </button>
          {fileError && <p className="text-xs text-danger-400 mt-2">{fileError}</p>}
        </div>

        {text.trim() && (
          <div className="rounded-xl bg-graphite-950 border border-graphite-700 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><FileText size={17} className="text-sulfur-300" /><span className="text-sm font-semibold text-graphite-200">Leitura da ficha</span></div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${count ? 'bg-success-500/15 text-success-400' : 'bg-danger-500/15 text-danger-400'}`}>{count} exercício(s)</span>
            </div>
            {parsed.workout && <p className="text-xs text-graphite-400"><span className="text-graphite-500">Nome:</span> {parsed.workout.name}</p>}
            {parsed.warnings.map((warning) => <p key={warning} className="text-xs text-graphite-500">• {warning}</p>)}
          </div>
        )}
      </div>
    </Modal>
  )
}
