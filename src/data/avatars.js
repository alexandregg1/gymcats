import catClipboard from '../assets/avatars/cat-clipboard.png'
import catYogamat from '../assets/avatars/cat-yogamat.png'
import catDumbbell from '../assets/avatars/cat-dumbbell.png'

export const AVATARS = [
  { id: 'cat-clipboard', src: catClipboard, label: 'Gato com prancheta' },
  { id: 'cat-yogamat', src: catYogamat, label: 'Gato no tapete' },
  { id: 'cat-dumbbell', src: catDumbbell, label: 'Gato na academia' },
]

export function getAvatarById(id) {
  return AVATARS.find((a) => a.id === id) || null
}
