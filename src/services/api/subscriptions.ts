import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type {
  IRequestSubscriptionTransfer,
  IResponseSubscription,
  IResponseSubscriptions,
  IResponseSubscriptionsReport,
  IResponseSubscriptionSummary,
  ISubscription
} from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { apiService } from './api.service'

export type PaginateSubscription = TableFetchParams & {
  onlyConfirmed?: boolean
}
export type AdminSubscriptionsParams = {
  categoryId?: number
}

export async function resendPaymentSubscription(subscriptionIds: number[]): Promise<IResponseSubscription> {
  const response = await apiService.post(`/subscription/resend`, { subscriptionIds })
  return response
}

export async function createSubscription(data: Partial<ISubscription>): Promise<IResponseSubscription> {
  const response = await apiService.post('/subscription', data)
  return response
}

export async function createPairSubscription(data: Partial<ISubscription>): Promise<IResponseSubscription> {
  const response = await apiService.post('/subscription/pair', data)
  return response
}

export async function paginateSubscription(categoryId: number, params: PaginateSubscription = {}): Promise<IResponsePaginated<ISubscription>> {
  const response = await apiService.get('/subscription', { params: { categoryId, ...params } })
  return response
}

export async function getSubscriptionSummary(tournamentId: number, params: TableFetchParams = {}): Promise<IResponseSubscriptionSummary> {
  const response = await apiService.get('/subscription/summary', { params: { tournamentId, ...params } })
  return response
}

export async function getSubscriptionReport(tournamentId: number, params: TableFetchParams = {}): Promise<IResponseSubscriptionsReport> {
  const response = await apiService.get('/subscription/report', { params: { tournamentId, ...params } })
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

export async function listCategorySubscriptions(categoryId: number): Promise<IResponseSubscriptions> {
  const response = await apiService.get(`/subscription/list`, { params: { categoryId } })
  return response
}

// admin
export async function listAdminSubscriptions(params?: AdminSubscriptionsParams): Promise<IResponseSubscriptions> {
  const response = await apiService.get('/subscription/list', { params })
  return response
}

export async function searchAdminSubscriptionUsers(params?: Record<string, any>): Promise<IResponseSubscriptions> {
  const response = await apiService.get('/subscription/search', { params })
  return response
}

export async function getDownloadSubscriptions(tournamentId: number, params: TableFetchParams = {}) {
  const response = await apiService.getFileByDownload('/subscription/download', { tournamentId, ...params })
  return response || null
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

// export async function adminReportSubscriptions(tournamentId: number): Promise<IResponseSubscriptions> {
//   const response = await apiService.get(`/subscription/report`, { params: { tournamentId } })
//   return response
// }
