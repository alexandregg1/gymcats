import { generateId } from './id.js'

const WEEKDAY_ALIASES = [
  { day: 0, names: ['domingo', 'dom'] },
  { day: 1, names: ['segunda-feira', 'segunda feira', 'segunda', 'seg'] },
  { day: 2, names: ['terça-feira', 'terca-feira', 'terça feira', 'terca feira', 'terça', 'terca', 'ter'] },
  { day: 3, names: ['quarta-feira', 'quarta feira', 'quarta', 'qua'] },
  { day: 4, names: ['quinta-feira', 'quinta feira', 'quinta', 'qui'] },
  { day: 5, names: ['sexta-feira', 'sexta feira', 'sexta', 'sex'] },
  { day: 6, names: ['sábado', 'sabado', 'sáb', 'sab'] },
]

const MUSCLE_HINTS = [
  { muscle: 'Peito', terms: ['supino', 'crucifixo', 'peck deck', 'crossover', 'voador'] },
  { muscle: 'Costas', terms: ['puxada', 'remada', 'barra fixa', 'pulldown', 'pull down', 'pullover'] },
  { muscle: 'Ombros', terms: ['desenvolvimento', 'elevação lateral', 'elevacao lateral', 'elevação frontal', 'elevacao frontal', 'face pull'] },
  { muscle: 'Bíceps', terms: ['rosca', 'bíceps', 'biceps'] },
  { muscle: 'Tríceps', terms: ['tríceps', 'triceps', 'testa', 'francês', 'frances'] },
  { muscle: 'Antebraços', terms: ['antebraço', 'antebraco', 'wrist curl', 'rosca punho'] },
  { muscle: 'Abdômen', terms: ['abdominal', 'abdômen', 'abdomen', 'prancha', 'crunch'] },
  { muscle: 'Glúteos', terms: ['glúteo', 'gluteo', 'hip thrust', 'elevação pélvica', 'elevacao pelvica', 'coice'] },
  { muscle: 'Quadríceps', terms: ['agachamento', 'leg press', 'extensora', 'hack squat', 'passada', 'afundo'] },
  { muscle: 'Posteriores', terms: ['stiff', 'terra romeno', 'romeno', 'flexora', 'mesa flexora', 'cadeira flexora', 'good morning'] },
  { muscle: 'Panturrilhas', terms: ['panturrilha', 'gêmeos', 'gemeos', 'calf raise'] },
]

function cleanText(value = '') {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/[•●▪◦]/g, '-')
    .replace(/\r\n?/g, '\n')
}

function normalize(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function toNumber(raw, fallback = 0) {
  if (raw == null || raw === '') return fallback
  const value = Number(String(raw).replace(',', '.'))
  return Number.isFinite(value) ? value : fallback
}

function parseWeekdays(text) {
  const normalized = normalize(text)
  return WEEKDAY_ALIASES.filter(({ names }) => names.some((name) => normalized.includes(normalize(name)))).map(({ day }) => day)
}

function inferMuscles(name) {
  const normalized = normalize(name)
  return MUSCLE_HINTS.filter(({ terms }) => terms.some((term) => normalized.includes(normalize(term)))).map(({ muscle }) => muscle)
}

function stripExercisePrefix(line) {
  return line
    .replace(/^\s*(?:[-–—*]+|\d+[.)-])\s*/, '')
    .replace(/^\s*(?:exerc[ií]cio\s*\d*\s*[:.-]?\s*)/i, '')
    .trim()
}

function looksLikeMetadata(line) {
  return /^(?:treino|ficha|nome|foco|objetivo|dias?|frequ[eê]ncia|observa[cç][aã]o|obs)\s*[:=-]/i.test(line.trim())
}

function extractNamedValue(line, labels, pattern) {
  const labelGroup = labels.join('|')
  const match = line.match(new RegExp(`(?:${labelGroup})\\s*[:=-]?\\s*(${pattern})`, 'i'))
  return match?.[1] ?? null
}

function parseExerciseLine(rawLine) {
  let line = stripExercisePrefix(rawLine)
  if (!line || looksLikeMetadata(line)) return null

  const original = line
  const setsRepsMatch = line.match(/(\d+)\s*[x×]\s*(\d+)(?:\s*[-–]\s*(\d+)\b(?!\s*kg\b))?/i)
  const verboseSetsRepsMatch = line.match(/(\d+)\s*s[eé]ries?\s*(?:de\s*)?(\d+(?:\s*[-–]\s*\d+)?)\s*(?:repeti[cç][oõ]es?|reps?)?/i)
  const setsNamed = extractNamedValue(line, ['s[eé]ries?', 'series?', 'sets?'], '\\d+')
  const repsNamed = extractNamedValue(line, ['reps?', 'repeti[cç][oõ]es?'], '\\d+(?:\\s*[-–]\\s*\\d+)?')
  const loadNamed = extractNamedValue(line, ['carga', 'peso'], '\\d+(?:[.,]\\d+)?')
  const restNamed = extractNamedValue(line, ['descanso', 'intervalo', 'rest'], '\\d+')
  const loadMatch = line.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i)
  const restMatch = line.match(/(\d+)\s*(?:s|seg|segs|segundos?)\b/i)

  let sets = toNumber(setsRepsMatch?.[1] ?? verboseSetsRepsMatch?.[1] ?? setsNamed, 3)
  const compactReps = setsRepsMatch ? `${setsRepsMatch[2]}${setsRepsMatch[3] ? `-${setsRepsMatch[3]}` : ''}` : null
  let reps = String(compactReps ?? verboseSetsRepsMatch?.[2] ?? repsNamed ?? '10-12').replace(/\s+/g, '')
  let load = toNumber(loadNamed ?? loadMatch?.[1], 0)
  let restSeconds = Math.round(toNumber(restNamed ?? restMatch?.[1], 60))

  // Formatos tabulares: Exercício | 4 | 8-12 | 70kg | 90s
  const columns = line.split(/\s*[|;\t]\s*/).filter(Boolean)
  let name = ''
  if (columns.length >= 2) {
    name = columns[0]
    const numericColumns = columns.slice(1)
    if (!setsNamed && !setsRepsMatch && /^\d+$/.test(numericColumns[0] || '')) sets = toNumber(numericColumns[0], sets)
    if (!repsNamed && !setsRepsMatch && /^\d+(?:[-–]\d+)?$/.test(numericColumns[1] || '')) reps = numericColumns[1].replace('–', '-')
    if (!loadNamed && !loadMatch) {
      const candidate = numericColumns.find((value) => /kg/i.test(value))
      if (candidate) load = toNumber(candidate.replace(/[^\d.,]/g, ''), load)
    }
    if (!restNamed && !restMatch) {
      const candidate = numericColumns.find((value) => /(?:seg|s\b)/i.test(value))
      if (candidate) restSeconds = Math.round(toNumber(candidate.replace(/\D/g, ''), restSeconds))
    }
  }

  if (!name) {
    name = line
      .replace(/\b\d+\s*[x×]\s*\d+(?:\s*[-–]\s*\d+\b(?!\s*kg\b))?/gi, '')
      .replace(/\b\d+\s*s[eé]ries?\s*(?:de\s*)?\d+(?:\s*[-–]\s*\d+)?\s*(?:repeti[cç][oõ]es?|reps?)?/gi, '')
      .replace(/\b(?:s[eé]ries?|series?|sets?|reps?|repeti[cç][oõ]es?|carga|peso|descanso|intervalo|rest)\s*[:=-]?\s*\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+)?\s*(?:kg|s|seg|segs|segundos?)?/gi, '')
      .replace(/\b\d+(?:[.,]\d+)?\s*kg\b/gi, '')
      .replace(/\b\d+\s*(?:s|seg|segs|segundos?)\b/gi, '')
      .replace(/[\s\-–—|,:;]+$/g, '')
      .replace(/^\s*[-–—|,:;]+\s*/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  // Sem qualquer sinal de prescrição, é provavelmente título/subtítulo e não exercício.
  const hasPrescription = Boolean(setsRepsMatch || verboseSetsRepsMatch || setsNamed || repsNamed || loadNamed || loadMatch || restNamed || restMatch || columns.length >= 3)
  if (!hasPrescription || name.length < 2) return null

  return {
    id: generateId('ex'),
    type: 'strength',
    name,
    muscleGroups: inferMuscles(name),
    sets: Math.max(1, sets),
    reps,
    load: Math.max(0, load),
    restSeconds: Math.max(15, restSeconds || 60),
    _source: original,
  }
}

function metadataValue(lines, keys) {
  const keyPattern = keys.join('|')
  for (const line of lines) {
    const match = line.match(new RegExp(`^(?:${keyPattern})\\s*[:=-]\\s*(.+)$`, 'i'))
    if (match) return match[1].trim()
  }
  return ''
}

function guessTitle(lines) {
  const explicit = metadataValue(lines, ['treino', 'ficha', 'nome'])
  if (explicit) return explicit
  const candidate = lines.find((line) => {
    const trimmed = line.trim()
    return trimmed && !parseExerciseLine(trimmed) && !looksLikeMetadata(trimmed) && trimmed.length <= 60
  })
  return candidate?.replace(/^#+\s*/, '').trim() || 'Ficha importada'
}

export function parseWorkoutText(input = '') {
  const text = cleanText(input).trim()
  if (!text) return { workout: null, warnings: ['Cole ou carregue uma ficha para importar.'], ignoredLines: [] }

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const exercises = []
  const ignoredLines = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    let exercise = parseExerciseLine(line)

    // Exportações simples frequentemente quebram o nome e a prescrição em duas linhas:
    // "Supino reto" + "4x10 - 60kg - 90s". Unimos apenas quando a segunda
    // linha começa claramente com uma prescrição para não misturar cabeçalhos.
    if (!exercise && index + 1 < lines.length && !looksLikeMetadata(line)) {
      const next = lines[index + 1]
      const prescriptionOnly = /^(?:[-–—*]\s*)?(?:\d+\s*[x×]\s*\d+|\d+\s*s[eé]ries?)/i.test(next)
      if (prescriptionOnly) {
        exercise = parseExerciseLine(`${line} ${next}`)
        if (exercise) index += 1
      }
    }

    if (exercise) exercises.push(exercise)
    else ignoredLines.push(line)
  }

  const focus = metadataValue(lines, ['foco', 'objetivo'])
  const weekdayText = metadataValue(lines, ['dias?', 'frequ[eê]ncia'])
  const weekdays = weekdayText ? parseWeekdays(weekdayText) : []
  const name = guessTitle(lines)
  const warnings = []

  if (exercises.length === 0) warnings.push('Nenhum exercício com séries/repetições foi reconhecido.')
  if (!weekdays.length) warnings.push('Dias da semana não foram identificados; você poderá marcá-los no editor.')
  if (exercises.some((exercise) => exercise.load === 0)) warnings.push('Algumas cargas não foram informadas e ficaram como 0 kg.')

  return {
    workout: {
      name,
      focus,
      weekdays,
      exercises: exercises.map(({ _source, ...exercise }) => exercise),
    },
    warnings,
    ignoredLines,
  }
}
