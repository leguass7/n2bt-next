import type { ImageFeature, IResponseGetImages } from '~/server-side/useCases/image/image.dto'

import { apiService } from './api.service'

export async function getImageFromFeature(feature: ImageFeature, featureId: number): Promise<IResponseGetImages> {
  const response = await apiService.get(`/image/${feature}/${featureId}`)
  return response
}
