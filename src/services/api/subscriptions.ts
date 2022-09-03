import { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type {
  IRequestSubscriptionTransfer,
  IResponseSubscription,
  IResponseSubscriptions,
  IResponseSubscriptionSummary,
  ISubscription
} from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

import { apiService } from './api.service'

export async function createSubscription(data: Partial<Subscription>): Promise<IResponseSubscription> {
  const response = await apiService.post('/subscription', data)
  return response
}

export async function paginateSubscription(categoryId: number, params: TableFetchParams = {}): Promise<IResponsePaginated<ISubscription>> {
  const response = await apiService.get('/subscription', { params: { categoryId, ...params } })
  return response
}

export async function getSubscriptionSummary(tournamentId: number, params: TableFetchParams = {}): Promise<IResponseSubscriptionSummary> {
  const response = await apiService.get('/subscription/summary', { params: { tournamentId, ...params } })
  return response
}

export async function transferSubscriptions(tournamentId: number, data: IRequestSubscriptionTransfer): Promise<IResponseSubscriptionSummary> {
  const response = await apiService.post('/subscription/transfer', data, { params: { tournamentId } })
  return response
}

export async function updateSubscription(subscriptionId: number, data: Partial<ISubscription>): Promise<IResponseSubscription> {
  const response = await apiService.patch(`/subscription/${subscriptionId}`, data)
  return response
}

export type AdminSubscriptionsParams = {
  categoryId?: number
}
export async function listAdminSubscriptions(params?: AdminSubscriptionsParams): Promise<IResponseSubscriptions> {
  const response = await apiService.get('/subscription/list', { params })
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
