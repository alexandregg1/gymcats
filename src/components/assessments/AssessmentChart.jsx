import React from 'react'

export default function AssessmentChart({ assessments, field, unit }) {
  const points = [...assessments].reverse().filter((a) => Number.isFinite(Number(a[field])))
  if (points.length < 2) return <div className="h-28 flex items-center justify-center text-xs text-graphite-500">Registre ao menos 2 avaliações para ver a progressão.</div>
  const values = points.map((a) => Number(a[field]))
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1
  const w = 320, h = 110, pad = 16
  const coords = points.map((point, i) => ({ x: pad + (i / (points.length - 1)) * (w - pad * 2), y: pad + (1 - (Number(point[field]) - min) / range) * (h - pad * 2), value: Number(point[field]) }))
  const path = coords.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')
  return <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28"><path d={path} fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{coords.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r="4" fill="#0E0F11" stroke="#A855F7" strokeWidth="2" />{i === coords.length - 1 && <text x={p.x - 3} y={p.y - 10} textAnchor="end" fill="#C084FC" fontSize="11" fontWeight="600">{p.value}{unit}</text>}</g>)}</svg>
}
