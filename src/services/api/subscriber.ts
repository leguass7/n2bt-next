import type { IResponseSubscription, ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { apiService } from './api.service'

export async function createPublicSubscription(data: Partial<ISubscription>): Promise<IResponseSubscription> {
  const response = await apiService.post('/subscriber', data)
  return response
}
