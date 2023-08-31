import type { TableFetchParams } from '~/components/CustomTable/types'
import { type SearchPromoCodeDto } from '~/pages/api/promo-code/search.dto'
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

export async function updatePromoCode(promoCodeId: number, data: Partial<IPromoCode>): Promise<IResponsePromoCode> {
  const response = await apiService.patch(`/promo-code/${promoCodeId}`, data)
  return response
}

export async function createPromoCode(data: Partial<IPromoCode>): Promise<IResponsePromoCode> {
  const response = await apiService.post(`/promo-code`, data)
  return response
}

export async function storePromoCode({ id, ...data }: Partial<IPromoCode>): Promise<IResponsePromoCode> {
  const handler = () => {
    if (id && id > 0) return updatePromoCode(id, data)
    return createPromoCode(data)
  }
  const response = await handler()
  return response
}

export async function getPromoCode(promoCodeId: number): Promise<IResponsePromoCode> {
  const response = await apiService.get(`/promo-code/${promoCodeId}`)
  return response
}

export async function searchPromoCode(filter: SearchPromoCodeDto): Promise<IResponsePromoCode> {
  const params = new URLSearchParams(filter as any)?.toString?.()
  const query = params ? `?${params}` : ''

  const response = await apiService.get(`/promo-code/search${query}`)
  return response
}

export async function deletePromoCode(promoCodeId: number): Promise<IResponsePromoCode> {
  const response = await apiService.delete(`/promo-code/${promoCodeId}`)
  return response
}
