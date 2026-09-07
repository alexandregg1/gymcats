import React from 'react'

const VARIANTS = {
  primary: 'bg-sulfur-400 text-graphite-950 hover:bg-sulfur-300 active:bg-sulfur-500',
  secondary: 'bg-graphite-800 text-graphite-100 hover:bg-graphite-700 border border-graphite-600',
  ghost: 'bg-transparent text-graphite-200 hover:bg-graphite-800',
  danger: 'bg-danger-500 text-graphite-50 hover:bg-danger-400',
  success: 'bg-success-500 text-graphite-50 hover:bg-success-400',
  complete: 'bg-[#318efc] text-white hover:bg-[#5aa6ff] active:bg-[#2375d0]',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-5 py-3.5 rounded-xl gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  fullWidth = false,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === 'lg' ? 20 : 16} strokeWidth={2.25} />}
      {children}
    </button>
  )
}
