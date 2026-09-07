import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-graphite-900 border border-graphite-700 rounded-t-2xl sm:rounded-2xl shadow-card animate-in">
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-graphite-700 bg-graphite-900">
          <h2 className="text-xl font-display font-semibold tracking-tight text-graphite-50">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-graphite-100 hover:bg-graphite-800"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="sticky bottom-0 px-5 py-4 border-t border-graphite-700 bg-graphite-900 flex gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
