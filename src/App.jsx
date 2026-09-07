import React, { useState } from 'react'
import AppShell from './components/layout/AppShell.jsx'
import ProfileGate from './components/profile/ProfileGate.jsx'
import ProfileSwitcher from './components/profile/ProfileSwitcher.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import WorkoutList from './components/workouts/WorkoutList.jsx'
import WorkoutEditor from './components/workouts/WorkoutEditor.jsx'
import ActiveWorkout from './components/active/ActiveWorkout.jsx'
import CardioTab from './components/cardio/CardioTab.jsx'
import History from './components/history/History.jsx'
import PhysicalAssessments from './components/assessments/PhysicalAssessments.jsx'
import { useAppData } from './context/AppDataContext.jsx'

export default function App() {
  const { activeProfile } = useAppData()

  const [view, setView] = useState('dashboard') // dashboard | workouts | editor | active | cardio | assessments | history
  const [editingWorkoutId, setEditingWorkoutId] = useState(undefined) // undefined = novo
  const [workoutDraft, setWorkoutDraft] = useState(null)
  const [activeWorkoutId, setActiveWorkoutId] = useState(null)
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false)

  if (!activeProfile) {
    return <ProfileGate />
  }

  const goToDashboard = () => setView('dashboard')
  const goToWorkouts = () => setView('workouts')

  const startWorkout = (workoutId) => {
    setActiveWorkoutId(workoutId)
    setView('active')
  }

  const openEditor = (workoutId) => {
    setWorkoutDraft(null)
    setEditingWorkoutId(workoutId)
    setView('editor')
  }

  const openNewWorkout = () => {
    setWorkoutDraft(null)
    setEditingWorkoutId(undefined)
    setView('editor')
  }

  const openImportedWorkout = (draft) => {
    setEditingWorkoutId(undefined)
    setWorkoutDraft(draft)
    setView('editor')
  }

  const navView = view === 'editor' ? 'workouts' : view

  return (
    <>
      <AppShell
        view={view}
        navView={navView}
        profile={activeProfile}
        onOpenProfiles={() => setProfileSwitcherOpen(true)}
        onNavigate={(v) => setView(v)}
      >
        {view === 'dashboard' && (
          <Dashboard onStartWorkout={startWorkout} onGoToWorkouts={goToWorkouts} />
        )}

        {view === 'workouts' && (
          <WorkoutList onStart={startWorkout} onEdit={openEditor} onCreate={openNewWorkout} onImport={openImportedWorkout} />
        )}

        {view === 'editor' && (
          <WorkoutEditor
            workoutId={editingWorkoutId}
            initialDraft={workoutDraft}
            onDone={goToWorkouts}
            onCancel={goToWorkouts}
          />
        )}

        {view === 'active' && (
          <ActiveWorkout
            workoutId={activeWorkoutId}
            onFinish={goToDashboard}
            onExit={goToDashboard}
          />
        )}

        {view === 'cardio' && <CardioTab onGoToAssessments={() => setView('assessments')} />}


        {view === 'assessments' && <PhysicalAssessments />}

        {view === 'history' && <History />}
      </AppShell>

      <ProfileSwitcher open={profileSwitcherOpen} onClose={() => setProfileSwitcherOpen(false)} />
    </>
  )
}
