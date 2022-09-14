import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { ICheckin } from '~/server-side/useCases/checkin/checkin.dto'
import type { IResponseSubscription, ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { apiService } from './api.service'

export type AdminCheckinParams = {
  tournamentId?: number
}

export async function listCheckin(tournamentId: number, params: TableFetchParams = {}): Promise<IResponsePaginated<ISubscription>> {
  const response = await apiService.get('/subscription', { params: { tournamentId, ...params } })
  return response
}

export async function updateCheckin(checkinId: number, data: Partial<ICheckin>): Promise<IResponseSubscription> {
  const response = await apiService.patch(`/checkin/${checkinId}`, data)
  return response
}
