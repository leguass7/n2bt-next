import imgBt from '~/assets/bt.jpg'
import imgCard from '~/assets/card.png'
import imgDunas from '~/assets/dunas-out-large.jpg'
import imgFute from '~/assets/fute.jpg'
import imgNorth from '~/assets/north-09.jpg'
import imgOriginal from '~/assets/original-1ano.jpg'
import imgSpeed from '~/assets/primeira-speed.jpg'
import imgRafinha from '~/assets/rafinha-10.jpg'
import imgSummer from '~/assets/summer-50-large.jpg'
import imgVolei from '~/assets/volei.jpg'
import type { CategoryOption } from '~/components/forms/InputSelects'
import { brighten } from '~/helpers/colors'

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

/** Lista de imagens pre definidas para entrar no build (bundle do nextJs) */
export const tournamentImages = [
  { id: 1, image: imgSpeed },
  { id: 2, image: imgOriginal },
  { id: 3, image: imgSummer },
  { id: 4, image: imgDunas },
  { id: 5, image: imgBt },
  { id: 6, image: imgVolei },
  { id: 7, image: imgFute },
  { id: 9, image: imgNorth },
  { id: 10, image: imgRafinha }
  //
]

export const siteName = 'Circuito Esportivo de Areia'

export const getTournamentImage = (tournamentId: number) => {
  return tournamentImages.find(f => f.id === tournamentId)?.image?.src || imgCard?.src
}

export const categoryGenders: CategoryOption[] = [
  { id: 'F', label: 'Feminino' },
  { id: 'M', label: 'Masculino' },
  { id: 'MF', label: 'Mista' }
]

export const genderColors = {
  M: brighten('#00f', 1.5),
  F: brighten('#f00', 1.5)
}

export const promoCodeSize = 8
