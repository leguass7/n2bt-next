import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { CheckinRawDto, ICheckin } from '~/server-side/useCases/checkin/checkin.dto'
import type { IResponseSubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { apiService } from './api.service'

export type AdminCheckinParams = {
  tournamentId?: number
}

export async function listCheckin(tournamentId: number, params: TableFetchParams = {}): Promise<IResponsePaginated<CheckinRawDto>> {
  const response = await apiService.get('/checkin/list', { params: { tournamentId, ...params } })
  return response
}

export async function storeCheckin(data: Partial<ICheckin>): Promise<IResponseSubscription> {
  const response = await apiService.patch(`/checkin/store`, data)
  return response
}
