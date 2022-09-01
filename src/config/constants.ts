import imgOriginal from '~/assets/original-1ano.jpg'
import imgSpeed from '~/assets/primeira-speed.jpg'
import type { CategoryOption } from '~/components/forms/InputSelects'

export const categories: CategoryOption[] = [
  { id: 'D', label: 'D' },
  { id: 'C', label: 'C' },
  { id: 'B', label: 'B' },
  { id: 'A', label: 'A' },
  { id: 'PRO', label: 'Pro' }
]

export const genders: CategoryOption[] = [
  { id: 'F', label: 'Feminino' },
  { id: 'M', label: 'Masculino' }
]

export const shirtSizes: CategoryOption[] = [
  { id: 'PP', label: 'PP' },
  { id: 'P', label: 'P' },
  { id: 'M', label: 'M' },
  { id: 'G', label: 'G' },
  { id: 'GG', label: 'GG' },
  { id: 'XG', label: 'XG' }
]

export const tournamentImages = [
  { id: 1, image: imgSpeed },
  { id: 2, image: imgOriginal }
  //
]

export const getTournamentImage = (tournamentId: number) => {
  return tournamentImages.find(f => f.id === tournamentId)?.image?.src || tournamentImages[0]?.image?.src
}

export const categoryGenders: CategoryOption[] = [
  { id: 'F', label: 'Feminino' },
  { id: 'M', label: 'Masculino' },
  { id: 'MF', label: 'Mista' }
]
