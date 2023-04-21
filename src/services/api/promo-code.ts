import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IPromoCode, IResponsePromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'

import { apiService } from './api.service'

export type AdminCheckinParams = {
  tournamentId?: number
}

export async function listPromoCodes(tournamentId: number, params: TableFetchParams = {}): Promise<IResponsePaginated<IPromoCode>> {
  const response = await apiService.get('/promo-code/list', { params: { tournamentId, ...params } })
  return response
}

export async function storePromoCode(data: Partial<IPromoCode>): Promise<IResponsePromoCode> {
  const response = await apiService.patch(`/promo-code/store`, data)
  return response
}

export async function getPromoCode(promoCodeId: number): Promise<IResponsePromoCode> {
  const response = await apiService.get(`/promo-code/${promoCodeId}`)
  return response
}
