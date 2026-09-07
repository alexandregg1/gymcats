import React from 'react'

// Sparkline leve em SVG puro — evita adicionar uma lib de gráficos só para isso.
export default function Sparkline({ points, width = 280, height = 64 }) {
  if (!points || points.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs text-graphite-500"
      >
        Registre pelo menos 2 sessões para ver a evolução
      </div>
    )
  }

  const loads = points.map((p) => p.load)
  const min = Math.min(...loads)
  const max = Math.max(...loads)
  const range = max - min || 1
  const padding = 8

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (p.load - min) / range) * (height - padding * 2)
    return { x, y, load: p.load }
  })

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')
  const last = coords[coords.length - 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
      <path d={path} fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 4 : 2.5} fill="#0E0F11" stroke="#A855F7" strokeWidth="2" />
      ))}
      <text x={last.x} y={last.y - 10} textAnchor="end" className="fill-sulfur-300 text-[11px] font-semibold">
        {last.load}kg
      </text>
    </svg>
  )
}
