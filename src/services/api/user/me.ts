import type { IResponseSubscriptions } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { apiService } from '../api.service'

export async function listMeSubscriptions(): Promise<IResponseSubscriptions> {
  const response = await apiService.get('/me/subscription')
  return response
}
