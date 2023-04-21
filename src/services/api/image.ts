import type { ImageFeature, IResponseGetImage, IResponseGetImages } from '~/server-side/useCases/image/image.dto'

import { apiService } from './api.service'

export async function getImageFromFeature(feature: ImageFeature, featureId: number): Promise<IResponseGetImages> {
  const response = await apiService.get(`/image/${feature}/${featureId}`)
  return response
}

export async function getImageByTournamentId(tournamentId: number): Promise<IResponseGetImage> {
  const response = await apiService.get(`/image/tournament/${tournamentId}`)
  return response
}
