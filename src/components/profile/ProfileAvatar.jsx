import React from 'react'
import { getAvatarById } from '../../data/avatars.js'

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[11px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-lg',
}

/**
 * Mostra o ícone de gato escolhido pelo perfil. Se nenhum avatar foi
 * escolhido, cai de volta para o círculo colorido com a inicial do nome.
 */
export default function ProfileAvatar({ profile, size = 'md', className = '' }) {
  const avatar = profile?.avatarId ? getAvatarById(profile.avatarId) : null
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md

  if (avatar) {
    return (
      <img
        src={avatar.src}
        alt={avatar.label}
        draggable="false"
        className={`${sizeClass} rounded-full object-cover bg-graphite-800 border border-graphite-700 shrink-0 select-none ${className}`}
      />
    )
  }

  return (
    <span
      className={`${sizeClass} rounded-full bg-chalk-500 flex items-center justify-center font-bold text-graphite-950 uppercase shrink-0 ${className}`}
    >
      {profile?.name?.slice(0, 1) || '?'}
    </span>
  )
}
