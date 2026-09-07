import React from 'react'

export function Label({ children }) {
  return <label className="block text-sm font-medium text-graphite-300 mb-1.5">{children}</label>
}

export function Input({ className = '', ...rest }) {
  return (
    <input
      className={`w-full bg-graphite-800 border border-graphite-600 rounded-lg px-3.5 py-2.5 text-graphite-50 placeholder-graphite-500 focus:border-sulfur-400 outline-none transition-colors ${className}`}
      {...rest}
    />
  )
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select
      className={`w-full bg-graphite-800 border border-graphite-600 rounded-lg px-3.5 py-2.5 text-graphite-50 focus:border-sulfur-400 outline-none transition-colors ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}

export function Tag({ children, tone = 'chalk', className = '' }) {
  const tones = {
    chalk: 'bg-chalk-600/25 text-chalk-300 border-chalk-600/40',
    sulfur: 'bg-sulfur-500/15 text-sulfur-300 border-sulfur-500/30',
    success: 'bg-success-500/15 text-success-400 border-success-500/30',
    danger: 'bg-danger-500/15 text-danger-400 border-danger-500/30',
    neutral: 'bg-graphite-700/60 text-graphite-300 border-graphite-600',
  }
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-md border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
