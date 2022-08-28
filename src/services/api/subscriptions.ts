import type { IResponseSubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

import { apiService } from './api.service'

export async function createSubscription(data: Partial<Subscription>): Promise<IResponseSubscription> {
  const response = await apiService.post('/subscription', data)
  return response
}

// export async function listSubscriptions(byPartner?: boolean): Promise<IResponseSubscriptions> {
//   const url = byPartner ? '/subscription/partner' : '/subscription'
//   const response = await apiService.get(url)
//   return response
// }

// export async function deleteSubscription(id: number): Promise<IResponseSubscriptions> {
//   const response = await apiService.delete('/subscription', { params: { id } })
//   return response
// }
