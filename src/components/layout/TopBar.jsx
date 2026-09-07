import React from 'react'
import { ChevronDown } from 'lucide-react'
import logoGymcat from '../../assets/logo-gymcat.png'
import ProfileAvatar from '../profile/ProfileAvatar.jsx'

export default function TopBar({ profile, onOpenProfiles }) {
  return (
    <header className="sticky top-0 z-30 bg-graphite-950/95 backdrop-blur border-b border-graphite-800">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-2">
          <img
            src={logoGymcat}
            alt="GymCat"
            className="h-9 sm:h-10 w-auto object-contain select-none"
            draggable="false"
          />
        </div>

        <button
          onClick={onOpenProfiles}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-graphite-800 border border-graphite-700 hover:border-graphite-600 transition-colors"
        >
          <ProfileAvatar profile={profile} size="xs" />
          <span className="text-sm font-medium text-graphite-200 max-w-[100px] truncate">
            {profile?.name || 'Perfil'}
          </span>
          <ChevronDown size={14} className="text-graphite-400" />
        </button>
      </div>
    </header>
  )
}
