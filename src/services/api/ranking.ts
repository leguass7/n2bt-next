import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IRanking, IResponseRanking, IResponseRankings, IResponseUserRanking } from '~/server-side/useCases/ranking/ranking.dto'

import { apiService } from './api.service'

export async function paginateRanking(categoryId: number, params: TableFetchParams = {}): Promise<IResponsePaginated<IRanking>> {
  const response = await apiService.get('/ranking', { params: { categoryId, ...params } })
  return response
}

export async function listRankings(categoryId: number): Promise<IResponseUserRanking> {
  const response = await apiService.get(`/ranking/list`, { params: { categoryId } })
  return response
}

export async function createRanking(data: IRanking): Promise<IResponseRanking> {
  const response = await apiService.post('/ranking', data)
  return response
}

export async function autoGenerateRanking(categoryId: number): Promise<IResponseUserRanking> {
  const response = await apiService.get(`/ranking/generate`, { params: { categoryId } })
  return response
}

export async function getRanking(rankingId: number): Promise<IResponseRanking> {
  const response = await apiService.get(`/ranking/${rankingId}`)
  return response
}

type FindParams = { userId?: string | string[] }
export async function findRankings(categoryId: number, params: FindParams = {}): Promise<IResponseRankings> {
  const response = await apiService.get(`/ranking/find`, { params: { categoryId, ...params } })
  return response
}

export async function deleteRanking(id: number): Promise<IResponseRanking> {
  const response = await apiService.delete(`/ranking/${id}`)
  return response
}
export async function updateRanking(id: number, data: IRanking): Promise<IResponseRanking> {
  const response = await apiService.patch(`/ranking/${id}`, data)
  return response
}

export async function storeRanking({ id, ...data }: IRanking): Promise<IResponseRanking> {
  if (id) return updateRanking(id, data)
  return createRanking(data)
}
