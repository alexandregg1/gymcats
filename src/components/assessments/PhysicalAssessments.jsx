import React, { useMemo, useState } from 'react'
import { Camera, Plus, Scale, Trash2, TrendingUp, X } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { Input, Label, Select } from '../ui/Field.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { compressImage } from '../../utils/images.js'
import AssessmentChart from './AssessmentChart.jsx'
import MonthlyAnalytics from '../analytics/MonthlyAnalytics.jsx'

const emptyForm = (weight = '') => ({ date: new Date().toISOString().slice(0, 10), cadence: 'monthly', weight: weight === null || weight === undefined ? '' : String(weight), bodyFat: '', arm: '', leg: '', waist: '', photos: [] })
const cadenceLabels = { monthly: 'Mensal', quarterly: 'Trimestral', semiannual: 'Semestral' }

export default function PhysicalAssessments() {
  const { assessments, addAssessment, deleteAssessment, activeProfile } = useAppData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => emptyForm(activeProfile?.weightKg))
  const [metric, setMetric] = useState('weight')
  const sorted = useMemo(() => [...assessments].sort((a, b) => new Date(b.date) - new Date(a.date)), [assessments])
  const latest = sorted[0], previous = sorted[1]
  const initialWeight = Number(activeProfile?.weightKg) || null
  const latestKnownWeight = Number(latest?.weight) || initialWeight || ''
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const openNewAssessment = () => { setForm(emptyForm(latestKnownWeight)); setOpen(true) }

  const handlePhotos = async (files) => {
    const selected = Array.from(files).slice(0, Math.max(0, 4 - form.photos.length))
    const compressed = await Promise.all(selected.map((file) => compressImage(file)))
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...compressed].slice(0, 4) }))
  }
  const save = () => {
    addAssessment({ ...form, weight: Number(form.weight), bodyFat: Number(form.bodyFat || 0), arm: Number(form.arm || 0), leg: Number(form.leg || 0), waist: Number(form.waist || 0) })
    setOpen(false)
  }
  const delta = (field) => latest && previous ? Number(latest[field] || 0) - Number(previous[field] || 0) : null
  const metrics = { weight: ['Peso', 'kg'], bodyFat: ['Gordura', '%'], arm: ['Braço', 'cm'], leg: ['Perna', 'cm'], waist: ['Cintura', 'cm'] }
  const baselineDelta = latest && initialWeight ? Number(latest.weight || 0) - initialWeight : null

  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold text-graphite-50">Avaliações físicas</h1><p className="text-sm text-graphite-400">Acompanhe sua evolução corporal e suas estatísticas</p></div><Button size="sm" icon={Plus} onClick={openNewAssessment}>Nova</Button></div>

    {initialWeight && <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-4"><p className="text-xs text-graphite-500">Peso informado no cadastro inicial</p><div className="flex items-end justify-between gap-4 mt-1"><p className="font-display text-2xl font-bold text-graphite-50">{initialWeight.toFixed(1)}<span className="text-sm ml-1 text-graphite-400">kg</span></p>{latest && <div className="text-right"><p className="text-xs text-graphite-500">Evolução desde o início</p><p className={`text-sm font-semibold ${baselineDelta < 0 ? 'text-success-400' : baselineDelta > 0 ? 'text-sulfur-300' : 'text-graphite-400'}`}>{baselineDelta > 0 ? '+' : ''}{baselineDelta.toFixed(1)} kg</p></div>}</div></div>}

    {latest ? <>
      <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-5"><div className="flex items-center gap-2 mb-4"><Scale size={18} className="text-sulfur-400"/><div><p className="text-xs text-graphite-500">Avaliação mais recente · {cadenceLabels[latest.cadence] || 'Mensal'}</p><p className="text-sm font-semibold text-graphite-200">{new Date(`${latest.date}T12:00:00`).toLocaleDateString('pt-BR')}</p></div></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{Object.entries(metrics).map(([field, [label, unit]]) => <div key={field} className="rounded-xl bg-graphite-900 border border-graphite-700 p-3"><p className="text-xs text-graphite-500">{label}</p><p className="font-display text-xl font-bold text-graphite-50">{latest[field] || '—'}{latest[field] ? unit : ''}</p>{delta(field) !== null && <p className={`text-[10px] mt-0.5 ${delta(field) > 0 ? 'text-sulfur-300' : delta(field) < 0 ? 'text-success-400' : 'text-graphite-500'}`}>{delta(field) > 0 ? '+' : ''}{delta(field).toFixed(1)}{unit} vs. anterior</p>}</div>)}</div></div>
      <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-5"><div className="flex items-center justify-between gap-2 mb-3"><div className="flex items-center gap-2"><TrendingUp size={18} className="text-sulfur-400"/><h2 className="font-semibold text-graphite-100">Progressão</h2></div><Select className="!w-auto !py-1.5 text-xs" value={metric} onChange={(e) => setMetric(e.target.value)}>{Object.entries(metrics).map(([field, [label]]) => <option key={field} value={field}>{label}</option>)}</Select></div><AssessmentChart assessments={sorted} field={metric} unit={metrics[metric][1]} /></div>
    </> : <div className="rounded-2xl bg-graphite-800 border border-graphite-700 p-8 text-center"><Scale size={28} className="text-graphite-500 mx-auto mb-3"/><h2 className="font-semibold text-graphite-200">Nenhuma avaliação registrada</h2><p className="text-sm text-graphite-500 mt-1">Seu peso inicial já está salvo. Registre a primeira avaliação para iniciar a comparação.</p></div>}

    {sorted.length > 0 && <div className="space-y-2"><h2 className="text-sm font-semibold text-graphite-300">Histórico</h2>{sorted.map((a) => <div key={a.id} className="rounded-xl bg-graphite-800 border border-graphite-700 p-3.5 flex items-center gap-3"><div className="flex-1"><p className="font-semibold text-sm text-graphite-200">{new Date(`${a.date}T12:00:00`).toLocaleDateString('pt-BR')} · {cadenceLabels[a.cadence] || 'Mensal'}</p><p className="text-xs text-graphite-500 mt-0.5">{a.weight || '—'} kg · {a.bodyFat || '—'}% gordura · {a.arm || '—'}cm braço · {a.photos?.length || 0} foto(s)</p></div>{a.photos?.[0] && <img src={a.photos[0]} alt="Avaliação" className="w-12 h-12 object-cover rounded-lg border border-graphite-600"/>}<button onClick={() => deleteAssessment(a.id)} className="p-2 text-graphite-500 hover:text-danger-400"><Trash2 size={16}/></button></div>)}</div>}

    <div className="pt-2 border-t border-graphite-800"><MonthlyAnalytics /></div>

    {open && <div className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center"><div className="bg-graphite-900 border border-graphite-700 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto p-5"><div className="flex items-center justify-between mb-5"><h2 className="font-display text-xl font-bold text-graphite-50">Nova avaliação</h2><button onClick={() => setOpen(false)} className="p-2 text-graphite-400"><X size={20}/></button></div><div className="space-y-4"><div className="grid grid-cols-2 gap-3"><div><Label>Data</Label><Input type="date" value={form.date} onChange={(e) => update('date', e.target.value)}/></div><div><Label>Periodicidade</Label><Select value={form.cadence} onChange={(e) => update('cadence', e.target.value)}><option value="monthly">Mensal</option><option value="quarterly">Trimestral</option><option value="semiannual">Semestral</option></Select></div></div><div><Label>Peso atual (kg)</Label><Input type="number" min="1" step="0.1" value={form.weight} onChange={(e) => update('weight', e.target.value)} placeholder="Ex: 72,5"/></div><div className="grid grid-cols-2 gap-3"><div><Label>Gordura (%)</Label><Input type="number" step="0.1" value={form.bodyFat} onChange={(e) => update('bodyFat', e.target.value)}/></div><div><Label>Braço (cm)</Label><Input type="number" step="0.1" value={form.arm} onChange={(e) => update('arm', e.target.value)}/></div><div><Label>Perna (cm)</Label><Input type="number" step="0.1" value={form.leg} onChange={(e) => update('leg', e.target.value)}/></div><div><Label>Cintura (cm)</Label><Input type="number" step="0.1" value={form.waist} onChange={(e) => update('waist', e.target.value)}/></div></div><div><Label>Fotos (até 4)</Label><label className="flex items-center justify-center gap-2 border border-dashed border-graphite-600 rounded-xl py-4 text-sm text-graphite-400 cursor-pointer hover:border-sulfur-400"><Camera size={18}/>Adicionar fotos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handlePhotos(e.target.files)}/></label>{form.photos.length > 0 && <div className="grid grid-cols-4 gap-2 mt-2">{form.photos.map((photo, i) => <img key={i} src={photo} alt="Prévia" className="aspect-square object-cover rounded-lg"/>)}</div>}</div><Button fullWidth size="lg" onClick={save} disabled={!form.weight || Number(form.weight) <= 0}>Salvar avaliação</Button></div></div></div>}
  </div>
}
