import React from 'react'
import TopBar from './TopBar.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppShell({ view, navView, profile, onOpenProfiles, onNavigate, children }) {
  const immersive = view === 'active'

  return (
    <div className="min-h-screen flex flex-col">
      {!immersive && <TopBar profile={profile} onOpenProfiles={onOpenProfiles} />}
      <main className={`flex-1 max-w-2xl w-full mx-auto ${immersive ? '' : 'px-4 sm:px-6 pb-24 pt-4'}`}>
        {children}
      </main>
      {!immersive && <BottomNav current={navView} onNavigate={onNavigate} />}
    </div>
  )
}
