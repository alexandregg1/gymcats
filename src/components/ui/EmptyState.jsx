import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-graphite-800 border border-graphite-700 flex items-center justify-center mb-4">
          <Icon size={26} className="text-graphite-400" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-graphite-100 mb-1">{title}</h3>
      {description && <p className="text-sm text-graphite-400 max-w-xs mb-5">{description}</p>}
      {action}
    </div>
  )
}
