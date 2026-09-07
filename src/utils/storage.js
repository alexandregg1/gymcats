// Camada de acesso ao LocalStorage.
// Mantém um único blob versionado e migra estruturas antigas sem apagar dados do usuário.

import { stripCardioFromWorkouts } from './migrateCardio.js'

const STORAGE_KEY = 'carga_app_data_v1'
const CURRENT_VERSION = 2

const DEFAULT_STATE = {
  version: CURRENT_VERSION,
  profiles: [],
  activeProfileId: null,
  data: {}, // { [profileId]: { workouts: [], history: [], assessments: [] } }
}

function normalizeBucket(bucket = {}) {
  return {
    workouts: Array.isArray(bucket.workouts) ? bucket.workouts : [],
    history: Array.isArray(bucket.history) ? bucket.history : [],
    assessments: Array.isArray(bucket.assessments) ? bucket.assessments : [],
  }
}

function migrateState(parsed) {
  const next = {
    ...structuredCloneSafe(DEFAULT_STATE),
    ...parsed,
    version: CURRENT_VERSION,
    data: {},
  }

  Object.entries(parsed?.data || {}).forEach(([profileId, bucket]) => {
    next.data[profileId] = normalizeBucket(bucket)
  })

  return next
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredCloneSafe(DEFAULT_STATE)
    return stripCardioFromWorkouts(migrateState(JSON.parse(raw)))
  } catch (err) {
    console.error('Falha ao ler dados do LocalStorage, reiniciando estado.', err)
    return structuredCloneSafe(DEFAULT_STATE)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (err) {
    console.error('Falha ao salvar dados do LocalStorage.', err)
    return false
  }
}

export function ensureProfileBucket(state, profileId) {
  if (!state.data[profileId]) state.data[profileId] = normalizeBucket()
  else state.data[profileId] = normalizeBucket(state.data[profileId])
  return state
}

function structuredCloneSafe(obj) {
  return JSON.parse(JSON.stringify(obj))
}
